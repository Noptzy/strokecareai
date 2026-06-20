import { Link, createFileRoute, useNavigate, useRouter } from "@tanstack/react-router"
import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { authClient } from "../../libs/auth/client"

export const Route = createFileRoute("/auth/login")({
	component: LoginPage,
})

type AuthMode = "sign-in" | "sign-up"
type AuthProvider = "google" | "github"

const providerLabels: Record<AuthProvider, string> = {
	google: "Google",
	github: "GitHub",
}

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== "undefined" ? window.location.origin : "")

function LoginPage() {
	const navigate = useNavigate()
	const router = useRouter()
	const [mode, setMode] = useState<AuthMode>("sign-in")
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [providers, setProviders] = useState<AuthProvider[]>([])
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		let isMounted = true

		async function loadProviders() {
			try {
				const response = await fetch(`${API_BASE}/api/auth/providers`, {
					credentials: "include",
				})

				if (!response.ok) {
					return
				}

				const data = (await response.json()) as { providers?: AuthProvider[] }
				if (isMounted) {
					setProviders(data.providers ?? [])
				}
			} catch {
				if (isMounted) {
					setProviders([])
				}
			}
		}

		void loadProviders()

		return () => {
			isMounted = false
		}
	}, [])

	const callbackURL = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard"

	async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setErrorMessage(null)
		setIsSubmitting(true)

		try {
			if (mode === "sign-up") {
				const result = await authClient.signUp.email({
					name,
					email,
					password,
					callbackURL: "/onboarding",
				})

				if (result.error) {
					setErrorMessage(result.error.message || "Registrasi gagal. Periksa kembali data Anda.")
					return
				}

				await router.invalidate()
				await navigate({ to: "/onboarding" })
				return
			}

			const result = await authClient.signIn.email({
				email,
				password,
				callbackURL: "/dashboard",
			})

			if (result.error) {
				setErrorMessage(result.error.message || "Masuk gagal. Periksa email dan kata sandi Anda.")
				return
			}

			await router.invalidate()
			await navigate({ to: "/dashboard" })
		} finally {
			setIsSubmitting(false)
		}
	}

	async function handleSocialSignIn(provider: AuthProvider) {
		setErrorMessage(null)
		setIsSubmitting(true)

		try {
			const result = await authClient.signIn.social({
				provider,
				callbackURL,
				errorCallbackURL: `${window.location.origin}/auth/login`,
			})

			if (result.error) {
				setErrorMessage(result.error.message || `Masuk dengan ${providerLabels[provider]} gagal.`)
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="min-h-screen bg-background warm-ivory-gradient flex items-center justify-center px-gutter py-section-gap">
			<section className="w-full max-w-[460px] bg-surface-container-low border border-outline-variant/20 rounded-xl p-8 md:p-10 shadow-[0_20px_50px_-20px_rgba(137,45,50,0.18)]">
				<div className="mb-stack-md">
					<Link to="/" className="font-headline-md text-headline-md text-primary font-bold">
						StrokeCare AI
					</Link>
					<span className="font-label-caps text-label-caps text-secondary block mt-8 uppercase tracking-widest">
						{mode === "sign-in" ? "Masuk akun" : "Buat akun"}
					</span>
					<h1 className="font-headline-lg text-headline-lg text-on-surface mt-2">
						{mode === "sign-in" ? "Lanjutkan perjalanan kesehatan Anda." : "Mulai profil StrokeCare Anda."}
					</h1>
					<p className="font-body-md text-body-md text-on-surface-variant mt-3">
						Informasi di aplikasi ini bersifat edukatif dan bukan pengganti diagnosis atau saran medis profesional.
					</p>
				</div>

				{providers.length > 0 && (
					<div className="space-y-3 mb-stack-md">
						{providers.map((provider) => (
							<button
								key={provider}
								type="button"
								disabled={isSubmitting}
								onClick={() => handleSocialSignIn(provider)}
								className="w-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface py-3 rounded-lg font-body-md font-medium hover:border-primary hover:text-primary active:scale-[0.99] transition-all disabled:opacity-60"
							>
								Masuk dengan {providerLabels[provider]}
							</button>
						))}
						<div className="flex items-center gap-3 pt-2">
							<div className="h-px flex-1 bg-outline-variant/40" />
							<span className="font-label-caps text-label-caps text-on-surface-variant">ATAU</span>
							<div className="h-px flex-1 bg-outline-variant/40" />
						</div>
					</div>
				)}

				<form className="space-y-5" onSubmit={handleEmailAuth}>
					{mode === "sign-up" && (
						<div className="space-y-2">
							<label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="name">
								Nama Lengkap
							</label>
							<input
								id="name"
								className="w-full bg-surface-container-lowest border border-outline/20 focus:border-secondary focus:ring-0 rounded-lg p-4 font-body-md text-on-surface transition-all placeholder:text-outline-variant"
								value={name}
								onChange={(event) => setName(event.target.value)}
								placeholder="Masukkan nama Anda"
								required
							/>
						</div>
					)}
					<div className="space-y-2">
						<label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							className="w-full bg-surface-container-lowest border border-outline/20 focus:border-secondary focus:ring-0 rounded-lg p-4 font-body-md text-on-surface transition-all placeholder:text-outline-variant"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="nama@email.com"
							type="email"
							required
						/>
					</div>
					<div className="space-y-2">
						<label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">
							Kata Sandi
						</label>
						<input
							id="password"
							className="w-full bg-surface-container-lowest border border-outline/20 focus:border-secondary focus:ring-0 rounded-lg p-4 font-body-md text-on-surface transition-all placeholder:text-outline-variant"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							minLength={8}
							placeholder="Minimal 8 karakter"
							type="password"
							required
						/>
					</div>

					{errorMessage && (
						<div className="bg-error-container/40 border border-error/20 rounded-lg p-4 text-on-error-container font-body-md text-body-md">
							{errorMessage}
						</div>
					)}

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full bg-primary text-on-primary py-4 rounded-lg font-body-md font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
					>
						{isSubmitting ? "Memproses..." : mode === "sign-in" ? "Masuk" : "Daftar"}
					</button>
				</form>

				<button
					type="button"
					className="w-full mt-stack-md text-secondary font-body-md hover:underline"
					onClick={() => {
						setErrorMessage(null)
						setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"))
					}}
				>
					{mode === "sign-in" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
				</button>
			</section>
		</main>
	)
}
