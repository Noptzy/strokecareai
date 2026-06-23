import { useQuery } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useCompanionMessages(sessionId: string | null) {
	return useQuery(
		orpc.companion.listMessages.queryOptions({
			input: { sessionId: sessionId ?? "" },
			enabled: Boolean(sessionId),
		}),
	)
}
