import { ChatOpenAI } from "@langchain/openai"
import { OpenAIConfig } from "@letscode-dev-friendly/shared"

export const llm = new ChatOpenAI({
    apiKey: OpenAIConfig.apiKey,
    // configuration: {
    //     baseURL: OpenAIConfig.baseURL,
    // },
    modelName: OpenAIConfig.chatModel || 'gpt-40-mini',
    temperature: 0.1,
})