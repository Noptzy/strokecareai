import { useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useSendMessage() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.companion.sendMessage.mutationOptions({
			onMutate: async (vars) => {
				const key = orpc.companion.listMessages.queryKey({ input: { sessionId: vars.sessionId } })
				await queryClient.cancelQueries({ queryKey: key })
				const previous = queryClient.getQueryData(key)
				queryClient.setQueryData(key, (old) => [
					...(old ?? []),
					{
						id: `optimistic-${Date.now()}`,
						sessionId: vars.sessionId,
						role: "user" as const,
						content: vars.content,
						createdAt: new Date(),
					},
				])
				return { key, previous }
			},
			onError: (_error, _vars, ctx) => {
				if (ctx) queryClient.setQueryData(ctx.key, ctx.previous)
			},
			onSettled: (_data, _error, vars) => {
				queryClient.invalidateQueries({
					queryKey: orpc.companion.listMessages.queryKey({ input: { sessionId: vars.sessionId } }),
				})
				queryClient.invalidateQueries({ queryKey: orpc.companion.listSessions.queryKey() })
			},
		}),
	)
}
