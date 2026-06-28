import { useGSAP } from "@gsap/react"
import { Link, createFileRoute, redirect, useRouteContext } from "@tanstack/react-router"
import { useProfile } from "@web/hooks/use-profile"
import gsap from "gsap"
import { useRef } from "react"
import "./dashboard.css"

export const Route = createFileRoute("/_authenticated/dashboard")({
	beforeLoad: ({ context }) => {
		if (context.session?.user.role === "admin") {
			throw redirect({ to: "/admin" })
		}
	},
	component: Dashboard,
})

const NAV_ITEMS = [
	{
		to: "/diagnosa",
		label: "Diagnosa",
		description: "Lihat estimasi risiko stroke dan rekomendasi personal.",
		icon: "monitor_heart",
		accent: "bg-error-container/30 text-error",
	},
	{
		to: "/companion",
		label: "AI Companion",
		description: "Diskusi gejala, faktor risiko, dan perjalanan pemulihan.",
		icon: "forum",
		accent: "bg-primary-container/40 text-primary",
	},
	{
		to: "/recovery",
		label: "Pemulihan",
		description: "Latihan pernapasan, aktivitas ringan, dan nutrisi harian.",
		icon: "self_improvement",
		accent: "bg-tertiary-container/40 text-tertiary",
	},
	{
		to: "/kenali-stroke",
		label: "Kenali Stroke",
		description: "Pelajari tanda-tanda awal stroke secara visual.",
		icon: "visibility",
		accent: "bg-secondary-container/40 text-secondary",
	},
] as const

function getGreeting(): string {
	const hour = new Date().getHours()
	if (hour < 11) return "Selamat pagi"
	if (hour < 15) return "Selamat siang"
	if (hour < 18) return "Selamat sore"
	return "Selamat malam"
}

function Dashboard() {
	const { data: profile, isPending, error } = useProfile()
	const { session } = useRouteContext({ from: "/_authenticated" })
	const userName = session?.user.name?.trim() || "Pengguna"
	const container = useRef<HTMLElement>(null)

	useGSAP(
		() => {
			gsap.from(".dashboard-reveal", {
				opacity: 0,
				y: 20,
				duration: 0.6,
				stagger: 0.1,
				ease: "power3.out",
			})
			gsap.from(".dashboard-blob", {
				scale: 0.6,
				opacity: 0,
				duration: 1.4,
				ease: "power2.out",
			})
		},
		{ dependencies: [profile], scope: container },
	)

	if (isPending) {
		return (
			<main className="max-w-[1100px] mx-auto px-gutter py-section-gap">
				<div
					className="dashboard-animate h-40 rounded-2xl bg-surface-container-low animate-pulse"
					aria-label="Memuat dashboard"
				/>
			</main>
		)
	}

	if (error || !profile) {
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

	const riskFactorCount = profile.riskFactors.length
	const onboardingProgress = profile.onboardingCompleted ? 100 : 35
	const firstName = userName.split(" ")[0]

	return (
		<main ref={container} className="max-w-[1100px] mx-auto px-gutter py-section-gap space-y-section-gap">
			<section className="dashboard-hero dashboard-reveal relative overflow-hidden rounded-3xl border border-outline-variant/10 px-8 py-10 md:px-12 md:py-14">
				<div
					className="dashboard-hero-blob dashboard-blob w-72 h-72 bg-primary"
					style={{ top: "-30%", right: "-10%" }}
					aria-hidden="true"
				/>
				<div
					className="dashboard-hero-blob dashboard-blob w-96 h-96 bg-secondary"
					style={{ bottom: "-50%", left: "-15%" }}
					aria-hidden="true"
				/>

				<div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-stack-md">
					<div className="space-y-3 max-w-xl">
						<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
							{getGreeting()}
						</span>
						<h1 className="font-headline-lg text-headline-lg md:text-display text-on-surface tracking-tight">
							Halo, {firstName}
						</h1>
						<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
							Profil risiko Anda telah diperbarui. Lanjutkan perjalanan pemulihan Anda hari ini — setiap langkah kecil
							bermakna.
						</p>
					</div>
					<Link
						to="/onboarding"
						className="dashboard-reveal inline-flex items-center justify-center min-h-12 gap-2 bg-primary text-on-primary rounded-full px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
					>
						<span className="material-symbols-outlined text-[20px]" aria-hidden="true">
							edit
						</span>
						Perbarui Profil
					</Link>
				</div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-3 gap-gutter" aria-label="Ringkasan profil">
				<article className="dashboard-reveal dashboard-card-hover bg-surface-container-low rounded-2xl border border-outline-variant/10 p-stack-md space-y-stack-sm">
					<div className="flex items-center justify-between">
						<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
							Usia
						</span>
						<span className="material-symbols-outlined text-on-surface-variant text-[20px]" aria-hidden="true">
							cake
						</span>
					</div>
					<p className="font-display text-headline-lg text-on-surface">
						{profile.age ?? "—"}
						<span className="font-body-md text-on-surface-variant ml-1">tahun</span>
					</p>
				</article>

				<article className="dashboard-reveal dashboard-card-hover bg-surface-container-low rounded-2xl border border-outline-variant/10 p-stack-md space-y-stack-sm">
					<div className="flex items-center justify-between">
						<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
							Faktor Risiko
						</span>
						<span className="material-symbols-outlined text-on-surface-variant text-[20px]" aria-hidden="true">
							monitor_heart
						</span>
					</div>
					<p className="font-display text-headline-lg text-on-surface">
						{riskFactorCount}
						<span className="font-body-md text-on-surface-variant ml-1">tercatat</span>
					</p>
				</article>

				<article className="dashboard-reveal dashboard-card-hover bg-surface-container-low rounded-2xl border border-outline-variant/10 p-stack-md space-y-stack-sm">
					<div className="flex items-center justify-between">
						<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
							Onboarding
						</span>
						<span className="material-symbols-outlined text-on-surface-variant text-[20px]" aria-hidden="true">
							{profile.onboardingCompleted ? "verified" : "pending"}
						</span>
					</div>
					<p className="font-display text-headline-lg text-on-surface">
						{profile.onboardingCompleted ? "Selesai" : "Belum"}
					</p>
					<div className="dashboard-progress-track">
						<div
							className="dashboard-progress-fill"
							style={{ width: `${onboardingProgress}%` }}
							role="progressbar"
							aria-valuenow={onboardingProgress}
							aria-valuemin={0}
							aria-valuemax={100}
							aria-label="Progres onboarding"
						/>
					</div>
				</article>
			</section>

			{profile.riskFactors.length > 0 && (
				<section
					className="dashboard-reveal bg-surface-container-low rounded-2xl border border-outline-variant/10 p-stack-md space-y-stack-sm"
					aria-labelledby="faktor-risiko-heading"
				>
					<div className="flex items-center justify-between">
						<h2
							id="faktor-risiko-heading"
							className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest"
						>
							Faktor Risiko Anda
						</h2>
						<Link
							to="/diagnosa"
							className="font-label-caps text-label-caps text-primary uppercase tracking-widest hover:underline"
						>
							Lihat Detail
						</Link>
					</div>
					<ul role="list" className="flex flex-wrap gap-2">
						{profile.riskFactors.map((rf) => (
							<li
								key={rf}
								className="text-sm bg-primary-container/40 text-on-primary-container px-3 py-1.5 rounded-full capitalize font-medium"
							>
								{rf.replace(/_/g, " ")}
							</li>
						))}
					</ul>
				</section>
			)}

			<section aria-labelledby="aksi-cepat-heading" className="space-y-stack-sm">
				<h2
					id="aksi-cepat-heading"
					className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest"
				>
					Aksi Cepat
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
					{NAV_ITEMS.map((item) => (
						<Link
							key={item.to}
							to={item.to}
							className="dashboard-reveal dashboard-card-hover group bg-surface-container-low rounded-2xl border border-outline-variant/10 p-stack-md space-y-stack-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<div
								className={`w-12 h-12 rounded-2xl ${item.accent} flex items-center justify-center transition-transform group-hover:scale-110`}
							>
								<span className="material-symbols-outlined text-[24px]" aria-hidden="true">
									{item.icon}
								</span>
							</div>
							<div className="space-y-1">
								<h3 className="font-headline-md text-[18px] text-on-surface">{item.label}</h3>
								<p className="font-body-md text-on-surface-variant leading-snug">{item.description}</p>
							</div>
							<div className="flex items-center gap-1 text-primary font-label-caps text-label-caps uppercase tracking-widest pt-2">
								Buka
								<span className="material-symbols-outlined dashboard-action-arrow text-[18px]" aria-hidden="true">
									arrow_forward
								</span>
							</div>
						</Link>
					))}
				</div>
			</section>
		</main>
	)
}
