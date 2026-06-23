import type { QueryClient } from "@tanstack/react-query"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { authClient } from "@web/libs/auth/client"

interface SessionShape {
	user: { id: string; name: string; email: string; role?: string }
	session: { id: string; userId: string; expiresAt: Date | string }
}

interface RouterContext {
	queryClient: QueryClient
	session: SessionShape | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: async () => {
		try {
			const res = await authClient.getSession()
			if (res.data?.user && res.data?.session) {
				return {
					session: {
						user: {
							id: res.data.user.id,
							name: res.data.user.name ?? "",
							email: res.data.user.email,
							role: (res.data.user as { role?: string }).role,
						},
						session: {
							id: res.data.session.id,
							userId: res.data.session.userId,
							expiresAt: res.data.session.expiresAt,
						},
					},
				}
			}
			return { session: null }
		} catch {
			return { session: null }
		}
	},
	component: RootComponent,
})

function RootComponent() {
	return <Outlet />
}
