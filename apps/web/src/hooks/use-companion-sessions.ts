import { useQuery } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useCompanionSessions() {
	return useQuery(orpc.companion.listSessions.queryOptions())
}
