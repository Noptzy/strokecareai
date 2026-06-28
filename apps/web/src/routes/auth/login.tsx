import { useForm } from "@tanstack/react-form"
import { Link, createFileRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { useAuthProviders } from "@web/hooks/use-auth-providers"
import { useUIStore } from "@web/hooks/use-ui-store"
import { authClient } from "@web/libs/auth/client"
import type { AuthProvider } from "@web/libs/auth/providers"
import { AUTH_PROVIDER_LABELS } from "@web/libs/auth/providers"
import { useState } from "react"
import { z } from "zod"

export const Route = createFileRoute("/auth/login")({
	component: LoginPage,
})

const emailField = z.string().email("Masukkan email yang valid")
const passwordField = z.string().min(1, "Kata sandi wajib diisi")

function LoginPage() {
	const navigate = useNavigate()
	const router = useRouter()
	const { showLoginPassword: showPassword, setShowLoginPassword: setShowPassword } = useUIStore()
	const providersQuery = useAuthProviders()
	const [socialError, setSocialError] = useState<string | null>(null)
	const [isSocialSubmitting, setIsSocialSubmitting] = useState(false)

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: {
			onSubmitAsync: async ({ value }) => {
				const res = await authClient.signIn.email({
					...value,
					callbackURL: "/dashboard",
				})
				if (res.error) return res.error.message ?? "Login gagal"
				return null
			},
		},
		onSubmit: async () => {
			await router.invalidate()
			await navigate({ to: "/dashboard" })
		},
	})

	async function handleSocialSignIn(provider: AuthProvider) {
		setSocialError(null)
		setIsSocialSubmitting(true)

		try {
			const origin = window.location.origin
			const result = await authClient.signIn.social({
				provider,
				callbackURL: `${origin}/dashboard`,
				errorCallbackURL: `${origin}/auth/login`,
			})

			if (result.error) {
				setSocialError(result.error.message || `Masuk dengan ${AUTH_PROVIDER_LABELS[provider]} gagal.`)
			}
		} finally {
			setIsSocialSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-surface px-gutter py-section-gap">
			<div className="max-w-md w-full bg-surface-container-lowest p-10 rounded-2xl border border-outline/20 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] space-y-stack-md">
				<header className="text-center space-y-2">
					<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
						Selamat Datang Kembali
					</span>
					<h1 className="font-headline-lg text-headline-lg text-on-surface">Masuk ke StrokeCare AI</h1>
					<p className="font-body-md text-on-surface-variant">
						Lanjutkan perjalanan pemulihan Anda dengan akses aman ke data pribadi.
					</p>
				</header>

				{providersQuery.isSuccess && providersQuery.data.length > 0 && (
					<div className="space-y-3">
						{providersQuery.data.map((provider) => (
							<button
								key={provider}
								type="button"
								disabled={isSocialSubmitting}
								onClick={() => void handleSocialSignIn(provider)}
								className="w-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface py-3 rounded-lg font-body-md font-medium hover:border-primary hover:text-primary active:scale-[0.99] transition-all disabled:opacity-60"
							>
								Masuk dengan {AUTH_PROVIDER_LABELS[provider]}
							</button>
						))}
						<div className="flex items-center gap-3 pt-2">
							<div className="h-px flex-1 bg-outline-variant/40" />
							<span className="font-label-caps text-label-caps text-on-surface-variant">ATAU</span>
							<div className="h-px flex-1 bg-outline-variant/40" />
						</div>
					</div>
				)}

				{socialError && (
					<div role="alert" className="bg-error-container/20 text-error rounded-lg p-3 text-sm">
						{socialError}
					</div>
				)}

				<form.Subscribe selector={(s) => s.errorMap.onSubmit}>
					{(formError) =>
						formError ? (
							<div role="alert" className="bg-error-container/20 text-error rounded-lg p-3 text-sm">
								{String(formError)}
							</div>
						) : null
					}
				</form.Subscribe>

				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault()
						void form.handleSubmit()
					}}
				>
					<form.Field name="email" validators={{ onChange: emailField }}>
						{(field) => (
							<div className="space-y-2">
								<label htmlFor={field.name} className="font-label-caps text-label-caps text-on-surface-variant">
									Email
								</label>
								<input
									id={field.name}
									type="email"
									required
									autoComplete="email"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									className="w-full bg-surface-container-lowest border border-outline/20 focus:border-primary focus:ring-0 rounded-lg p-3 font-body-md transition-all"
									placeholder="nama@email.com"
								/>
								{!field.state.meta.isValid && (
									<p className="text-error text-xs" id={`${field.name}-error`}>
										{field.state.meta.errors.map((err) => err?.message).join(", ")}
									</p>
								)}
							</div>
						)}
					</form.Field>

					<form.Field name="password" validators={{ onChange: passwordField }}>
						{(field) => (
							<div className="space-y-2">
								<label htmlFor={field.name} className="font-label-caps text-label-caps text-on-surface-variant">
									Kata Sandi
								</label>
								<div className="relative">
									<input
										id={field.name}
										type={showPassword ? "text" : "password"}
										required
										autoComplete="current-password"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										className="w-full bg-surface-container-lowest border border-outline/20 focus:border-primary focus:ring-0 rounded-lg p-3 pr-10 font-body-md transition-all"
										placeholder="Minimal 8 karakter"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
										aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
									>
										<span className="material-symbols-outlined" aria-hidden="true">
											{showPassword ? "visibility_off" : "visibility"}
										</span>
									</button>
								</div>
								{!field.state.meta.isValid && (
									<p className="text-error text-xs" id={`${field.name}-error`}>
										{field.state.meta.errors.map((err) => err?.message).join(", ")}
									</p>
								)}
							</div>
						)}
					</form.Field>

					<form.Subscribe selector={(s) => s.isSubmitting}>
						{(isSubmitting) => (
							<button
								type="submit"
								disabled={isSubmitting || isSocialSubmitting}
								className="w-full bg-primary text-on-primary rounded-lg p-3 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
							>
								{isSubmitting ? "Memproses..." : "Masuk"}
							</button>
						)}
					</form.Subscribe>
				</form>

				<p className="text-center font-body-md text-on-surface-variant">
					Belum punya akun?{" "}
					<Link to="/auth/signup" className="text-primary hover:underline font-medium">
						Daftar
					</Link>
				</p>
			</div>
		</div>
	)
}
