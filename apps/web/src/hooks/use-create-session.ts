import { useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useCreateSession() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.companion.createSession.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.companion.listSessions.queryKey() })
			},
		}),
	)
}
