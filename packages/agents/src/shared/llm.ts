import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models"; // Core abstraction layer
import { AIConfig, getLLMProvider } from "@letscode-dev-friendly/shared";

// Explicitly type as BaseChatModel to ensure uniform downstream method access
export const llm: BaseChatModel = getLLMProvider() === 'ollama'
    ? new ChatOllama({
        baseUrl: AIConfig.baseURL,
        model: AIConfig.chatModel || 'qwen2.5-coder',
        temperature: 0.1,
        format: "json", // Isolating the grammar engine rule strictly to the Ollama initialization pipeline
    })
    : new ChatOpenAI({
        apiKey: AIConfig.apiKey,
        modelName: AIConfig.chatModel || 'gpt-4o-mini',
        temperature: 0.1,
        // modelKwargs: { response_format: { type: "json_object" } } // Optional: Keep handled natively by LangChain
    });