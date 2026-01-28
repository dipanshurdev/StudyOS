"use server";

async function getAIKeys() {
  return {
    GROQ_API_KEY:
      process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY,
    HUGGINGFACE_API_KEY:
      process.env.HUGGINGFACE_API_KEY ||
      process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY,
  };
}

interface AIPrompt {
  summarize: (content: string) => string;
  explain: (content: string) => string;
  questions: (content: string) => string;
  flashcards: (content: string) => string;
  mindmap: (content: string) => string;
  chat: (
    content: string,
    conversationHistory?: Array<{ role: string; content: string }>,
  ) => string;
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

  flashcards: (content: string) => `
You are an expert study assistant specializing in creating effective flashcards. Based on the following study material, generate 10-15 high-quality flashcards that cover the most important concepts.

Each flashcard should:
- Have a clear, concise front side (question or term)
- Have a detailed back side (answer or explanation)
- Focus on key concepts, definitions, formulas, or important facts
- Be suitable for spaced repetition learning

Content:
${content}

Format your response as a JSON array of objects with "front" and "back" keys. Example:
[
  {"front": "What is photosynthesis?", "back": "The process by which plants convert light energy into chemical energy..."},
  {"front": "Define mitosis", "back": "Cell division that results in two identical daughter cells..."}
]

Return ONLY valid JSON, no additional text.`,

  mindmap: (content: string) => `
You are an expert at creating visual learning structures. Based on the following content, generate a mind map structure that organizes the information hierarchically.

The mind map should:
- Have a central topic (main theme)
- Include 4-6 main branches (major topics)
- Each branch should have 2-4 sub-branches (key points)
- Be logically organized and easy to follow

Content:
${content}

Format your response as a JSON object with this structure:
{
  "centralTopic": "Main topic name",
  "branches": [
    {
      "name": "Branch name",
      "subBranches": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}

Return ONLY valid JSON, no additional text.`,

  chat: (
    content: string,
    conversationHistory?: Array<{ role: string; content: string }>,
  ) => {
    const historyContext = conversationHistory
      ? conversationHistory
          .slice(-6)
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n")
      : "";

    return `
You are a patient, knowledgeable AI tutor helping a student understand their study material. You should:
- Answer questions clearly and concisely
- Use examples and analogies when helpful
- Break down complex concepts into simpler parts
- Encourage the student and provide positive feedback
- If asked about something not in the material, say so politely

${historyContext ? `Previous conversation:\n${historyContext}\n\n` : ""}
Student's question or the study material they're asking about:
${content}

Provide a helpful, encouraging response that helps them learn.`;
  },
};

async function callGroq(prompt: string): Promise<string> {
  const { GROQ_API_KEY } = await getAIKeys();

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
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
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Groq API error: ${response.status} - ${error.error?.message || "Unknown error"}`,
      );
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from Groq");
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Groq API error:", error);
    throw error;
  }
}

async function callHuggingFace(prompt: string): Promise<string> {
  const { HUGGINGFACE_API_KEY } = await getAIKeys();

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
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
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `HuggingFace API error: ${response.status} - ${error.error || error.error_description || "Unknown error"}`,
      );
    }

    const data = await response.json();

    let text = "";
    if (Array.isArray(data)) {
      text = data[0]?.generated_text || "";
    } else if (data.generated_text) {
      text = data.generated_text;
    }

    if (!text) {
      throw new Error("No generated text in HuggingFace response");
    }

    return text.replace(prompt, "").trim();
  } catch (error) {
    console.error("HuggingFace API error:", error);
    throw error;
  }
}

export async function generateAIResponse(
  action:
    | "summarize"
    | "explain"
    | "questions"
    | "flashcards"
    | "mindmap"
    | "chat",
  content: string,
  conversationHistory?: Array<{ role: string; content: string }>,
): Promise<string> {
  if (!content.trim()) {
    throw new Error(
      "Content cannot be empty. Please paste some study material.",
    );
  }

  if (content.length > 20000) {
    throw new Error(
      "Content is too long (max 20,000 characters). Please use shorter content.",
    );
  }

  const prompt =
    action === "chat"
      ? prompts[action](content, conversationHistory)
      : prompts[action](content);

  try {
    console.log("[v0] Attempting Groq API call for action:", action);
    const result = await callGroq(prompt);
    console.log("[v0] Groq API successful");
    return result;
  } catch (groqError) {
    console.warn(
      "[v0] Groq failed, attempting HuggingFace fallback:",
      groqError,
    );
    try {
      console.log("[v0] Attempting HuggingFace fallback for action:", action);
      const result = await callHuggingFace(prompt);
      console.log("[v0] HuggingFace fallback successful");
      return result;
    } catch (hfError) {
      console.error("[v0] Both AI services failed:", hfError);
      throw new Error(
        "AI services are temporarily unavailable. Please try again in a moment. This usually resolves quickly.",
      );
    }
  }
}
