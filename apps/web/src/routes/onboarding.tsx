import { useForm } from "@tanstack/react-form"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useOnboardingProfile } from "@web/hooks/use-onboarding-profile"
import { RISK_FACTORS } from "@web/libs/orpc/schemas"
import { z } from "zod"

const onboardingSearchSchema = z.object({
	step: z.number().catch(1),
})

export const Route = createFileRoute("/onboarding")({
	validateSearch: onboardingSearchSchema,
	component: Onboarding,
})

type RiskFactor = (typeof RISK_FACTORS)[number]

const RISK_LABELS: Record<RiskFactor, string> = {
	hypertension: "Hipertensi",
	diabetes: "Diabetes",
	smoking: "Merokok",
	obesity: "Obesitas",
	heart_disease: "Penyakit Jantung",
	family_history: "Riwayat Keluarga",
}

const ageField = z.string().refine((v) => {
	const n = Number.parseInt(v, 10)
	return Number.isFinite(n) && n >= 1 && n <= 120
}, "Masukkan usia yang valid (1-120)")

const riskFactorsField = z.array(z.enum(RISK_FACTORS)).min(1, "Pilih minimal satu faktor risiko")

function Onboarding() {
	const navigate = useNavigate({ from: Route.fullPath })
	const mutation = useOnboardingProfile()
	const { step } = Route.useSearch()
	const setStep = (newStep: number) => void navigate({ search: { step: newStep } })

	const form = useForm({
		defaultValues: {
			age: "",
			gender: "",
			height: "",
			weight: "",
			riskFactors: [] as RiskFactor[],
			dailyFoodPattern: "",
			sleepPattern: "",
			stressLevel: "",
			smokingStatus: "",
			exercisePattern: "",
			priorIllnesses: "",
			familyMedicalHistory: "",
			notes: "",
		},
		validators: {
			onSubmitAsync: async ({ value }) => {
				try {
					await mutation.mutateAsync({
						...value,
						age: Number.parseInt(value.age, 10),
						height: value.height ? Number.parseFloat(value.height) : undefined,
						weight: value.weight ? Number.parseFloat(value.weight) : undefined,
						onboardingCompleted: true,
					})
					return null
				} catch (e) {
					return { form: (e as Error).message }
				}
			},
		},
		onSubmit: async () => {
			await navigate({ to: "/dashboard" })
		},
	})

	return (
		<main className="min-h-screen flex items-center justify-center bg-surface px-gutter py-section-gap">
			<form
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					if (step === 1) {
						const { age, riskFactors } = form.state.values
						if (age !== "" && riskFactors.length > 0) {
							setStep(2)
						}
						return
					}
					void form.handleSubmit()
				}}
				className="max-w-2xl w-full bg-surface-container-low rounded-2xl border border-outline-variant/10 p-stack-md space-y-stack-md shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]"
			>
				<header className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
							Langkah {step} dari 2
						</span>
						<span className="font-label-caps text-label-caps text-on-surface-variant">
							{Math.round((step / 2) * 100)}%
						</span>
					</div>
					<div
						role="progressbar"
						aria-valuenow={step}
						aria-valuemin={1}
						aria-valuemax={2}
						aria-label={`Langkah ${step} dari 2`}
						className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden"
					>
						<div className="h-full bg-primary transition-all duration-300" style={{ width: `${(step / 2) * 100}%` }} />
					</div>
					<h1 className="font-headline-lg text-headline-lg text-on-surface">
						{step === 1 ? "Bio & Risiko Dasar" : "Gaya Hidup & Riwayat Medis"}
					</h1>
					<p className="font-body-md text-on-surface-variant">
						Informasi ini membantu AI Companion memberikan saran yang paling relevan untuk Anda.
					</p>
				</header>

				{step === 1 && (
					<div className="space-y-stack-sm">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<form.Field name="age" validators={{ onChange: ageField }}>
								{(field) => (
									<div className="space-y-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">Usia *</label>
										<input
											type="number"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											className="w-full bg-surface-container-lowest border border-outline/20 focus:border-primary rounded-lg p-3 font-body-md"
										/>
										{!field.state.meta.isValid && (
											<p className="text-error text-xs">
												{field.state.meta.errors.map((err) => err?.message).join(", ")}
											</p>
										)}
									</div>
								)}
							</form.Field>

							<form.Field name="gender">
								{(field) => (
									<div className="space-y-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">Jenis Kelamin</label>
										<select
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											className="w-full bg-surface-container-lowest border border-outline/20 focus:border-primary rounded-lg p-3 font-body-md"
										>
											<option value="">Pilih...</option>
											<option value="L">Laki-laki</option>
											<option value="P">Perempuan</option>
										</select>
									</div>
								)}
							</form.Field>

							<form.Field name="height">
								{(field) => (
									<div className="space-y-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">Tinggi Badan (cm)</label>
										<input
											type="number"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											className="w-full bg-surface-container-lowest border border-outline/20 focus:border-primary rounded-lg p-3 font-body-md"
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="weight">
								{(field) => (
									<div className="space-y-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">Berat Badan (kg)</label>
										<input
											type="number"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											className="w-full bg-surface-container-lowest border border-outline/20 focus:border-primary rounded-lg p-3 font-body-md"
										/>
									</div>
								)}
							</form.Field>
						</div>

						<form.Field name="riskFactors" validators={{ onChange: riskFactorsField }}>
							{(field) => (
								<fieldset className="space-y-stack-sm pt-4">
									<legend className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
										Faktor Risiko (pilih minimal satu) *
									</legend>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
										{RISK_FACTORS.map((rf) => {
											const isOn = field.state.value.includes(rf)
											return (
												<button
													key={rf}
													type="button"
													onClick={() =>
														field.handleChange(
															isOn ? field.state.value.filter((x) => x !== rf) : [...field.state.value, rf],
														)
													}
													className={`rounded-lg border px-3 py-3 text-sm text-left transition-colors ${
														isOn
															? "bg-primary-container/30 border-primary text-primary"
															: "bg-surface-container-lowest border-outline-variant/20 text-on-surface-variant hover:border-primary"
													}`}
												>
													{RISK_LABELS[rf]}
												</button>
											)
										})}
									</div>
									{!field.state.meta.isValid && (
										<p className="text-error text-xs">
											{field.state.meta.errors.map((err) => err?.message).join(", ")}
										</p>
									)}
								</fieldset>
							)}
						</form.Field>
					</div>
				)}

				{step === 2 && (
					<div className="space-y-stack-sm">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<form.Field name="smokingStatus">
								{(field) => (
									<div className="space-y-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">Status Merokok</label>
										<select
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											className="w-full bg-surface-container-lowest border border-outline/20 rounded-lg p-3"
										>
											<option value="">Pilih...</option>
											<option value="Tidak Merokok">Tidak Merokok</option>
											<option value="Pernah Merokok">Pernah Merokok</option>
											<option value="Perokok Aktif">Perokok Aktif</option>
										</select>
									</div>
								)}
							</form.Field>

							<form.Field name="stressLevel">
								{(field) => (
									<div className="space-y-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">Tingkat Stres</label>
										<select
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											className="w-full bg-surface-container-lowest border border-outline/20 rounded-lg p-3"
										>
											<option value="">Pilih...</option>
											<option value="Rendah">Rendah</option>
											<option value="Sedang">Sedang</option>
											<option value="Tinggi">Tinggi</option>
										</select>
									</div>
								)}
							</form.Field>

							<form.Field name="dailyFoodPattern">
								{(field) => (
									<div className="space-y-2 md:col-span-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">Pola Makan Harian</label>
										<input
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Contoh: Sering makan gorengan / Cukup sayur"
											className="w-full bg-surface-container-lowest border border-outline/20 rounded-lg p-3"
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="exercisePattern">
								{(field) => (
									<div className="space-y-2 md:col-span-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">Pola Olahraga</label>
										<input
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Contoh: 2x seminggu jogging"
											className="w-full bg-surface-container-lowest border border-outline/20 rounded-lg p-3"
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="priorIllnesses">
								{(field) => (
									<div className="space-y-2 md:col-span-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">
											Penyakit Terdahulu
										</label>
										<textarea
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											className="w-full bg-surface-container-lowest border border-outline/20 rounded-lg p-3 h-20"
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="familyMedicalHistory">
								{(field) => (
									<div className="space-y-2 md:col-span-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">
											Riwayat Penyakit Keluarga
										</label>
										<textarea
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											className="w-full bg-surface-container-lowest border border-outline/20 rounded-lg p-3 h-20"
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="notes">
								{(field) => (
									<div className="space-y-2 md:col-span-2">
										<label className="font-label-caps text-label-caps text-on-surface-variant">Catatan Tambahan</label>
										<textarea
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Ada hal lain yang perlu kami ketahui?"
											className="w-full bg-surface-container-lowest border border-outline/20 rounded-lg p-3 h-20"
										/>
									</div>
								)}
							</form.Field>
						</div>
					</div>
				)}

				<form.Subscribe selector={(s) => s.errorMap.onSubmit}>
					{(formError) =>
						formError ? (
							<div role="alert" className="bg-error-container/20 text-error rounded-lg p-3 text-sm">
								{typeof formError === "string" ? formError : formError.form}
							</div>
						) : null
					}
				</form.Subscribe>

				<div className="flex justify-between pt-4">
					{step === 2 ? (
						<button
							type="button"
							onClick={() => setStep(1)}
							className="px-6 py-3 rounded-lg border border-outline/20 font-label-caps uppercase hover:bg-surface-container-high transition-colors text-on-surface-variant"
						>
							Kembali
						</button>
					) : (
						<div />
					)}

					{step === 1 ? (
						<form.Subscribe selector={(s) => [s.values.age, s.values.riskFactors]}>
							{([age, riskFactors]) => {
								const isValid = age !== "" && riskFactors.length > 0
								return (
									<button
										type="button"
										onClick={() => {
											if (isValid) setStep(2)
										}}
										disabled={!isValid}
										className="bg-primary text-on-primary rounded-lg px-8 py-3 font-label-caps uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
									>
										Lanjut
									</button>
								)
							}}
						</form.Subscribe>
					) : (
						<form.Subscribe selector={(s) => s.isSubmitting}>
							{(isSubmitting) => (
								<button
									type="submit"
									disabled={isSubmitting}
									className="bg-primary text-on-primary rounded-lg px-8 py-3 font-label-caps uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
								>
									{isSubmitting ? "Menyimpan..." : "Selesai"}
								</button>
							)}
						</form.Subscribe>
					)}
				</div>
			</form>
		</main>
	)
}
