import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { authClient } from "../libs/auth/client.ts";

interface RouterContext {
  queryClient: QueryClient;
  session: any | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    try {
      const session = await authClient.getSession();
      return { session: session?.data || null };
    } catch {
      return { session: null };
    }
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
