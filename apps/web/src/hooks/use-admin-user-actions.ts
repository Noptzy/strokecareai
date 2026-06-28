import { useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useCreateAdminUser() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.admin.createUser.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.admin.getDashboard.queryKey() })
			},
		}),
	)
}

export function useUpdateAdminUser() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.admin.updateUser.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.admin.getDashboard.queryKey() })
			},
		}),
	)
}

export function useDeleteAdminUser() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.admin.deleteUser.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: orpc.admin.getDashboard.queryKey() })
			},
		}),
	)
}
