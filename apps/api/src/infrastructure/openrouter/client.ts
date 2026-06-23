import { internalError } from "@api/application/shared/errors"
import type { ChatCompletionRequest, ChatMessage, OpenRouterService } from "@api/domain/ports/openrouter-service"

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
const DEFAULT_MODEL = "openrouter/auto"
const DEFAULT_TEMPERATURE = 0.7
const DEFAULT_MAX_TOKENS = 512

interface OpenRouterResponse {
	choices?: Array<{ message?: { content?: string } }>
	error?: { message?: string }
}

export function createOpenRouterClient(apiKey: string): OpenRouterService {
	return {
		async chat(req: ChatCompletionRequest): Promise<string> {
			const body = {
				model: req.model ?? DEFAULT_MODEL,
				temperature: req.temperature ?? DEFAULT_TEMPERATURE,
				max_tokens: req.maxTokens ?? DEFAULT_MAX_TOKENS,
				messages: req.messages.map((m: ChatMessage) => ({ role: m.role, content: m.content })),
			}
			let res: Response
			try {
				res = await fetch(ENDPOINT, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${req.apiKey ?? apiKey}`,
					},
					body: JSON.stringify(body),
				})
			} catch (e) {
				throw internalError(`openrouter network error: ${(e as Error).message}`)
			}
			if (!res.ok) {
				const text = await res.text()
				throw internalError(`openrouter ${res.status}: ${text.slice(0, 200)}`)
			}
			const data = (await res.json()) as OpenRouterResponse
			const content = data.choices?.[0]?.message?.content
			if (!content) throw internalError("openrouter returned no content")
			return content
		},
	}
}
