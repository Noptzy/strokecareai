import { useGSAP } from "@gsap/react"
import { Link, createFileRoute } from "@tanstack/react-router"
import { RiskBadge } from "@web/components/ui/RiskBadge"
import { RiskGauge } from "@web/components/ui/RiskGauge"
import { useRiskAssessment } from "@web/hooks/use-risk-assessment"
import gsap from "gsap"
import { useRef } from "react"
import "./diagnosa.css"

export const Route = createFileRoute("/_authenticated/diagnosa")({
	component: Diagnosa,
})

const RISK_LEVELS = {
	low: {
		hero: "linear-gradient(135deg, oklch(96% 0.04 150), oklch(94% 0.06 150))",
		blob: "oklch(75% 0.15 150)",
		label: "Risiko Rendah",
		message: "Profil risiko Anda terlihat baik. Pertahankan gaya hidup sehat.",
	},
	medium: {
		hero: "linear-gradient(135deg, oklch(97% 0.04 80), oklch(94% 0.08 80))",
		blob: "oklch(75% 0.15 80)",
		label: "Risiko Sedang",
		message: "Ada beberapa faktor yang perlu diperhatikan. Tinjau rekomendasi di bawah.",
	},
	high: {
		hero: "linear-gradient(135deg, oklch(96% 0.04 25), oklch(93% 0.08 25))",
		blob: "oklch(68% 0.20 25)",
		label: "Risiko Tinggi",
		message: "Faktor risiko Anda signifikan. Konsultasikan dengan tenaga kesehatan.",
	},
} as const

function Diagnosa() {
	const { data: assessment, isPending, error } = useRiskAssessment()
	const container = useRef<HTMLElement>(null)

	useGSAP(
		() => {
			gsap.from(".diagnosa-reveal", {
				opacity: 0,
				y: 20,
				duration: 0.6,
				stagger: 0.08,
				ease: "power3.out",
			})
			gsap.from(".diagnosa-blob", {
				scale: 0.5,
				opacity: 0,
				duration: 1.4,
				ease: "power2.out",
			})
		},
		{ dependencies: [assessment], scope: container },
	)

	if (isPending) {
		return (
			<main className="max-w-[1100px] mx-auto px-gutter py-section-gap">
				<div
					className="diagnosa-animate h-56 rounded-3xl bg-surface-container-low animate-pulse"
					aria-label="Menghitung estimasi risiko"
				/>
			</main>
		)
	}

	if (error || !assessment) {
		return (
			<main className="max-w-[1100px] mx-auto px-gutter py-section-gap space-y-stack-md">
				<p className="font-body-md text-error">Profil belum diinisialisasi.</p>
				<Link
					to="/onboarding"
					className="inline-flex items-center min-h-11 bg-primary text-on-primary rounded-lg px-5 py-2.5 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity"
				>
					Mulai Onboarding
				</Link>
			</main>
		)
	}

	const level = RISK_LEVELS[assessment.level]

	return (
		<main ref={container} className="max-w-[1100px] mx-auto px-gutter py-section-gap space-y-section-gap">
			<section
				className="diagnosa-hero diagnosa-reveal relative overflow-hidden rounded-3xl border border-outline-variant/10 px-8 py-10 md:px-12 md:py-14"
				style={{ background: level.hero }}
			>
				<div
					className="diagnosa-hero-blob diagnosa-blob w-80 h-80"
					style={{ top: "-30%", right: "-10%", background: level.blob }}
					aria-hidden="true"
				/>
				<div
					className="diagnosa-hero-blob diagnosa-blob w-72 h-72 bg-primary"
					style={{ bottom: "-40%", left: "-15%" }}
					aria-hidden="true"
				/>

				<div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-stack-md">
					<div className="space-y-3 max-w-xl">
						<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
							Diagnosa Risiko
						</span>
						<h1 className="font-headline-lg text-headline-lg md:text-display text-on-surface tracking-tight">
							Estimasi Risiko Anda
						</h1>
						<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{level.message}</p>
					</div>
					<RiskBadge level={assessment.level} />
				</div>
			</section>

			<section
				className="diagnosa-reveal bg-surface-container-low rounded-3xl border border-outline-variant/10 p-stack-md flex flex-col items-center gap-stack-sm"
				aria-label="Visualisasi skor risiko"
			>
				<RiskGauge score={assessment.score} level={assessment.level} />
				<p className="font-body-md text-on-surface-variant text-center max-w-md leading-relaxed">
					{assessment.summary}
				</p>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 gap-gutter" aria-label="Faktor risiko dan protektif">
				<div
					className="diagnosa-reveal diagnosa-card-hover bg-surface-container-low rounded-2xl border border-outline-variant/10 p-stack-md space-y-stack-sm"
					aria-labelledby="faktor-memberatkan"
				>
					<div className="flex items-center gap-2">
						<span className="material-symbols-outlined text-error text-[20px]" aria-hidden="true">
							warning
						</span>
						<h2
							id="faktor-memberatkan"
							className="font-label-caps text-label-caps text-error uppercase tracking-widest"
						>
							Faktor Memberatkan
						</h2>
					</div>
					{assessment.contributors.length === 0 ? (
						<p className="text-sm text-on-surface-variant">Tidak ada faktor memberatkan terdeteksi.</p>
					) : (
						<ul role="list" className="space-y-3">
							{assessment.contributors.map((c) => (
								<li
									key={c.code}
									className="flex items-center justify-between gap-2 text-sm text-on-surface py-2 border-b border-outline-variant/10 last:border-0"
								>
									<span>{c.label}</span>
									<span
										className="text-error font-bold bg-error-container/30 px-2 py-0.5 rounded-full"
										aria-label={`Kontribusi skor ${c.points}`}
									>
										+{c.points}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>

				<div
					className="diagnosa-reveal diagnosa-card-hover bg-surface-container-low rounded-2xl border border-outline-variant/10 p-stack-md space-y-stack-sm"
					aria-labelledby="faktor-protektif"
				>
					<div className="flex items-center gap-2">
						<span className="material-symbols-outlined text-tertiary text-[20px]" aria-hidden="true">
							shield
						</span>
						<h2
							id="faktor-protektif"
							className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest"
						>
							Faktor Protektif
						</h2>
					</div>
					{assessment.protective.length === 0 ? (
						<p className="text-sm text-on-surface-variant">Belum ada faktor protektif tercatat.</p>
					) : (
						<ul role="list" className="space-y-2">
							{assessment.protective.map((p) => (
								<li
									key={p.code}
									className="text-sm text-on-surface flex items-center gap-2 py-2 border-b border-outline-variant/10 last:border-0"
								>
									<span className="material-symbols-outlined text-tertiary text-[18px]" aria-hidden="true">
										check_circle
									</span>
									{p.label}
								</li>
							))}
						</ul>
					)}
				</div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
				<div
					className="diagnosa-reveal diagnosa-card-hover bg-error-container/20 border border-error/20 rounded-2xl p-stack-md space-y-stack-sm"
					aria-labelledby="hindari-heading"
				>
					<div className="flex items-center gap-2">
						<span className="material-symbols-outlined text-error text-[20px]" aria-hidden="true">
							block
						</span>
						<h2 id="hindari-heading" className="font-label-caps text-label-caps text-error uppercase tracking-widest">
							Hindari
						</h2>
					</div>
					<ul role="list" className="space-y-2 text-sm text-on-surface">
						{assessment.avoid.map((a) => (
							<li key={a} className="flex items-start gap-2">
								<span className="text-error mt-0.5">•</span>
								<span>{a}</span>
							</li>
						))}
					</ul>
				</div>

				<div
					className="diagnosa-reveal diagnosa-card-hover bg-tertiary-container/30 border border-tertiary/20 rounded-2xl p-stack-md space-y-stack-sm"
					aria-labelledby="lakukan-heading"
				>
					<div className="flex items-center gap-2">
						<span className="material-symbols-outlined text-tertiary text-[20px]" aria-hidden="true">
							check_circle
						</span>
						<h2
							id="lakukan-heading"
							className="font-label-caps text-label-caps text-tertiary uppercase tracking-widest"
						>
							Lakukan
						</h2>
					</div>
					<ul role="list" className="space-y-2 text-sm text-on-surface">
						{assessment.recommend.map((r) => (
							<li key={r} className="flex items-start gap-2">
								<span className="text-tertiary mt-0.5">•</span>
								<span>{r}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			<div className="diagnosa-reveal flex flex-col sm:flex-row gap-3 justify-center items-center pt-stack-sm">
				<Link
					to="/companion"
					className="inline-flex items-center min-h-12 gap-2 bg-primary text-on-primary rounded-full px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
				>
					<span className="material-symbols-outlined text-[20px]" aria-hidden="true">
						forum
					</span>
					Diskusikan dengan AI
				</Link>
				<Link
					to="/recovery"
					className="inline-flex items-center min-h-12 gap-2 border border-outline/20 text-on-surface rounded-full px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container-high transition-colors"
				>
					<span className="material-symbols-outlined text-[20px]" aria-hidden="true">
						self_improvement
					</span>
					Mulai Pemulihan
				</Link>
			</div>
		</main>
	)
}
