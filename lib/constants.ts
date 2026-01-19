/**
 * Application constants and configuration
 */

export const APP_CONFIG = {
  // Limits
  FREE_TIER_DAILY_LIMIT: 5,

  // AI Models
  GROQ_MODEL: "llama-3.1-8b-instant",
  HUGGINGFACE_MODEL: "mistralai/Mistral-7B-Instruct-v0.1",

  // API Timeouts
  AI_GENERATION_TIMEOUT: 30000, // 30 seconds

  // Database
  DB_NAME: "studybuddy",
  COLLECTIONS: {
    USERS: "users",
    STUDY_DOCUMENTS: "study_documents",
    USAGE_LIMITS: "usage_limits",
  },
}

export const AI_PROMPTS = {
  SUMMARIZE: (content: string) => `
You are a study assistant. Create a concise summary of the following content in 2-3 bullet points. Keep it brief and to the point.

Content:
${content}

Provide only the bullet points, no additional text.`,

  EXPLAIN: (content: string) => `
You are a study assistant. Explain the following content in simple, easy-to-understand language. Use everyday examples if possible.

Content:
${content}

Keep your explanation clear and concise.`,

  QUESTIONS: (content: string) => `
You are a study assistant. Generate 3-4 practice questions based on the following content:
- 2 multiple choice questions (MCQ)
- 1-2 short answer questions

Format:
MCQ 1: [Question]
a) [Option]
b) [Option]
c) [Option]
d) [Option]

MCQ 2: [Same format]

Short Answer: [Question]

Content:
${content}`,
}
