import { useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useUpdateAdminSettings() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.settings.updateSettings.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.settings.getSettings.queryKey() })
			},
		}),
	)
}
