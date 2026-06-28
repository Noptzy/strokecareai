import { useQuery } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useAdminSettings() {
	return useQuery(orpc.settings.getSettings.queryOptions())
}
