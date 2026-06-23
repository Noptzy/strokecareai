import type { AppRouterClient } from "@api/index.ts"
import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== "undefined" ? window.location.origin : "")

const link = new RPCLink({
	url: `${API_BASE}/rpc`,
	fetch: (i, init) => fetch(i, { ...init, credentials: "include" }),
})

export const client: AppRouterClient = createORPCClient(link)
export const orpc = createTanstackQueryUtils(client)
