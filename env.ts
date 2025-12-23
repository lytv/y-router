export interface Env {
  OPENROUTER_BASE_URL: string;
  // Model mapping configuration
  // Map Claude models to OpenRouter models
  MODEL_MAP_OPUS?: string;    // e.g., "moonshotai/kimi-k2"
  MODEL_MAP_SONNET?: string;  // e.g., "moonshotai/kimi-k2"
  MODEL_MAP_HAIKU?: string;   // e.g., "google/gemini-2.0-flash-exp:free"
}
