import { useQuery } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useAdminDashboard() {
	return useQuery(orpc.admin.getDashboard.queryOptions())
}
