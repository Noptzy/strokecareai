import { useQuery } from "@tanstack/react-query"
import { listAuthProviders } from "@web/libs/auth/providers"

export const AUTH_PROVIDERS_QUERY_KEY = ["auth", "providers"] as const

export function useAuthProviders() {
	return useQuery({
		queryKey: AUTH_PROVIDERS_QUERY_KEY,
		queryFn: listAuthProviders,
		staleTime: 5 * 60_000,
	})
}
