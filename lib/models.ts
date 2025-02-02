export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  category: string;
  contextWindow?: number;
  promptPrice?: number;
  completionPrice?: number;
}

export const POPULAR_MODELS: OpenRouterModel[] = [
  { 
    id: "anthropic/claude-3.5-sonnet", 
    name: "Claude 3 Sonnet", 
    category: "Anthropic",
    description: "Expert coding and analysis",
    contextWindow: 200000,
    promptPrice: 0.0015,
    completionPrice: 0.0075
  },
  { 
    id: "anthropic/claude-3.5-haiku:beta", 
    name: "Claude 3.5 Haiku", 
    category: "Anthropic",
    description: "Programming and tech specialist",
    contextWindow: 200000,
    promptPrice: 0.015,
    completionPrice: 0.075
  },
  { 
    id: "openai/gpt-4-turbo", 
    name: "GPT-4 Turbo", 
    category: "OpenAI",
    description: "Legal and marketing expert",
    contextWindow: 128000,
    promptPrice: 0.01,
    completionPrice: 0.03
  },
  { 
    id: "openai/gpt-4o-mini", 
    name: "GPT-4o Mini", 
    category: "OpenAI",
    description: "Cost-effective general intelligence",
    contextWindow: 128000,
    promptPrice: 0.01,
    completionPrice: 0.03
  },
  { 
    id: "google/gemini-pro", 
    name: "Gemini Pro", 
    category: "Google",
    description: "Health and academic specialist",
    contextWindow: 32000,
    promptPrice: 0.001,
    completionPrice: 0.002
  },
  { 
    id: "meta-llama/llama-3.3-70b-instruct", 
    name: "Llama 3.3 70B Instruct", 
    category: "Meta",
    description: "Finance and legal expert",
    contextWindow: 4096,
    promptPrice: 0.0007,
    completionPrice: 0.0009
  },
  { 
    id: "mistralai/mistral-nemo", 
    name: "Mistral Nemo", 
    category: "Mistral",
    description: "Multilingual trivia specialist",
    contextWindow: 32000,
    promptPrice: 0.002,
    completionPrice: 0.006
  }
]; 