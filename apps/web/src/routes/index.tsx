import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div>
      <h1>Welcome to the Single Tenant Web App</h1>
    </div>
  ),
});
