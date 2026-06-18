import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/" });
    }
  },
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
});
