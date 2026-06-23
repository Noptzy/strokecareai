import { useQuery } from "@tanstack/react-query"
import { orpc } from "@web/libs/orpc/client"

export function useRiskAssessment() {
	return useQuery(orpc.risk.getAssessment.queryOptions())
}
