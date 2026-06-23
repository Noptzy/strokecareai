import { useQuery } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useProfile() {
	return useQuery(orpc.profile.get.queryOptions())
}
