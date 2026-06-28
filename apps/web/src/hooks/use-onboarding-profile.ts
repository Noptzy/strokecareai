import { useMutation, useQueryClient } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useOnboardingProfile() {
	const queryClient = useQueryClient()
	return useMutation(
		orpc.profile.upsert.mutationOptions({
			onSuccess: (data) => {
				queryClient.setQueryData(orpc.profile.get.queryKey(), data)
			},
		}),
	)
}
