import { useForm } from "@tanstack/react-form"
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { authClient } from "@web/libs/auth/client"

import { useUIStore } from "@web/hooks/use-ui-store"
import { z } from "zod"

export const Route = createFileRoute("/auth/signup")({
	component: SignupPage,
})

const nameField = z.string().min(2, "Nama minimal 2 karakter").max(80)
const emailField = z.string().email("Masukkan email yang valid")
const passwordField = z.string().min(8, "Kata sandi minimal 8 karakter")

function SignupPage() {
	const navigate = useNavigate()
	const { showSignupPassword: showPassword, setShowSignupPassword: setShowPassword } = useUIStore()
	const form = useForm({
		defaultValues: { name: "", email: "", password: "" },
		validators: {
			onSubmitAsync: async ({ value }) => {
				const res = await authClient.signUp.email(value)
				if (res.error) return res.error.message ?? "Pendaftaran gagal"
				return null
			},
		},
		onSubmit: async () => {
			await navigate({ to: "/onboarding" })
		},
	})

	return (
		<div className="min-h-screen flex items-center justify-center bg-surface px-gutter py-section-gap">
			<div className="max-w-md w-full bg-surface-container-lowest p-10 rounded-2xl border border-outline/20 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] space-y-stack-md">
				<header className="text-center space-y-2">
					<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
						Mulai Perjalanan Anda
					</span>
					<h1 className="font-headline-lg text-headline-lg text-on-surface">Daftar StrokeCare AI</h1>
					<p className="font-body-md text-on-surface-variant">Buat akun untuk melacak kesehatan Anda dengan aman.</p>
				</header>

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
					<form.Field name="name" validators={{ onChange: nameField }}>
						{(field) => (
							<div className="space-y-2">
								<label htmlFor={field.name} className="font-label-caps text-label-caps text-on-surface-variant">
									Nama
								</label>
								<input
									id={field.name}
									type="text"
									required
									autoComplete="name"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									className="w-full bg-surface-container-lowest border border-outline/20 focus:border-primary focus:ring-0 rounded-lg p-3 font-body-md transition-all"
									placeholder="Nama lengkap"
								/>
								{!field.state.meta.isValid && (
									<p className="text-error text-xs" id={`${field.name}-error`}>
										{field.state.meta.errors.map((err) => err?.message).join(", ")}
									</p>
								)}
							</div>
						)}
					</form.Field>

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
									Kata Sandi (min. 8 karakter)
								</label>
								<div className="relative">
									<input
										id={field.name}
										type={showPassword ? "text" : "password"}
										required
										autoComplete="new-password"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										className="w-full bg-surface-container-lowest border border-outline/20 focus:border-primary focus:ring-0 rounded-lg p-3 pr-10 font-body-md transition-all"
										placeholder="••••••••"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
										aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
									>
										{showPassword ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<title>Sembunyikan kata sandi</title>
												<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
												<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
												<path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
												<line x1="2" x2="22" y1="2" y2="22" />
											</svg>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<title>Tampilkan kata sandi</title>
												<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
												<circle cx="12" cy="12" r="3" />
											</svg>
										)}
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
								disabled={isSubmitting}
								className="w-full bg-primary text-on-primary rounded-lg p-3 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
							>
								{isSubmitting ? "Memproses..." : "Daftar"}
							</button>
						)}
					</form.Subscribe>
				</form>

				<p className="text-center font-body-md text-on-surface-variant">
					Sudah punya akun?{" "}
					<Link to="/auth/login" className="text-primary hover:underline font-medium">
						Masuk
					</Link>
				</p>
			</div>
		</div>
	)
}
