export type AuthProvider = "google" | "github"

export const AUTH_PROVIDER_LABELS: Record<AuthProvider, string> = {
	google: "Google",
	github: "GitHub",
}

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== "undefined" ? window.location.origin : "")

export async function listAuthProviders(): Promise<AuthProvider[]> {
	const response = await fetch(`${API_BASE}/api/auth/providers`, {
		credentials: "include",
	})

	if (!response.ok) {
		return []
	}

	const data = (await response.json()) as { providers?: AuthProvider[] }
	return data.providers ?? []
}
