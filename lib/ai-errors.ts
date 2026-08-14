// Thrown by the AI layer for request-level problems (validation, size limits)
// so route handlers can map them to proper 4xx responses instead of 500s.
export class AILimitError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AILimitError";
    this.status = status;
  }
}