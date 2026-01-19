"use server"

async function getAIKeys() {
  return {
    GROQ_API_KEY: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY,
  }
}

interface AIPrompt {
  summarize: (content: string) => string
  explain: (content: string) => string
  questions: (content: string) => string
}

const prompts: AIPrompt = {
  summarize: (content: string) => `
You are an expert study assistant. Create a clear, concise summary of the following content using 3-5 bullet points. 
Focus on the most important concepts and key takeaways. Keep each point brief but informative.

Content:
${content}

Format your response as bullet points only, no additional text or explanations.`,

  explain: (content: string) => `
You are a patient, knowledgeable tutor. Explain the following content in simple, easy-to-understand language.
Use analogies and real-world examples when possible. Break down complex ideas into smaller, digestible parts.
Make sure a high school student could understand this explanation.

Content:
${content}

Keep your explanation clear, engaging, and practical.`,

  questions: (content: string) => `
You are an expert educator. Based on the following content, generate 4 high-quality practice questions:
- 2 multiple choice questions (MCQ) with 4 options each
- 2 short answer questions that test deep understanding

Use realistic exam-style formatting. Make questions that test comprehension, not just memorization.

Content:
${content}

Format your response clearly with questions numbered and options labeled a-d for MCQs.`,
}

async function callGroq(prompt: string): Promise<string> {
  const { GROQ_API_KEY } = await getAIKeys()

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Groq API error: ${response.status} - ${error.error?.message || "Unknown error"}`)
    }

    const data = await response.json()
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from Groq")
    }

    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error("Groq API error:", error)
    throw error
  }
}

async function callHuggingFace(prompt: string): Promise<string> {
  const { HUGGINGFACE_API_KEY } = await getAIKeys()

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.7,
          do_sample: true,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        `HuggingFace API error: ${response.status} - ${error.error || error.error_description || "Unknown error"}`,
      )
    }

    const data = await response.json()

    let text = ""
    if (Array.isArray(data)) {
      text = data[0]?.generated_text || ""
    } else if (data.generated_text) {
      text = data.generated_text
    }

    if (!text) {
      throw new Error("No generated text in HuggingFace response")
    }

    return text.replace(prompt, "").trim()
  } catch (error) {
    console.error("HuggingFace API error:", error)
    throw error
  }
}

export async function generateAIResponse(
  action: "summarize" | "explain" | "questions",
  content: string,
): Promise<string> {
  if (!content.trim()) {
    throw new Error("Content cannot be empty. Please paste some study material.")
  }

  if (content.length > 20000) {
    throw new Error("Content is too long (max 20,000 characters). Please use shorter content.")
  }

  const prompt = prompts[action](content)

  try {
    console.log("[v0] Attempting Groq API call for action:", action)
    const result = await callGroq(prompt)
    console.log("[v0] Groq API successful")
    return result
  } catch (groqError) {
    console.warn("[v0] Groq failed, attempting HuggingFace fallback:", groqError)
    try {
      console.log("[v0] Attempting HuggingFace fallback for action:", action)
      const result = await callHuggingFace(prompt)
      console.log("[v0] HuggingFace fallback successful")
      return result
    } catch (hfError) {
      console.error("[v0] Both AI services failed:", hfError)
      throw new Error(
        "AI services are temporarily unavailable. Please try again in a moment. This usually resolves quickly.",
      )
    }
  }
}
