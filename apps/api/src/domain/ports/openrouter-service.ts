export interface ChatMessage {
	role: "system" | "user" | "assistant"
	content: string
}

export interface ChatCompletionRequest {
	messages: ChatMessage[]
	model?: string
	temperature?: number
	maxTokens?: number
	apiKey?: string
}

export interface OpenRouterService {
	chat(req: ChatCompletionRequest): Promise<string>
}
