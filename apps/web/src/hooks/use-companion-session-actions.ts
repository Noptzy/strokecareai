import { useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useUpdateSessionTitle() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.companion.updateSessionTitle.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.companion.listSessions.queryKey() })
			},
		}),
	)
}

export function useDeleteSession() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.companion.deleteSession.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.companion.listSessions.queryKey() })
			},
		}),
	)
}
