import { useGSAP } from "@gsap/react"
import { Link, createFileRoute } from "@tanstack/react-router"
import { RecoveryCard } from "@web/components/ui/RecoveryCard"
import gsap from "gsap"
import { useRef } from "react"
import "./recovery.css"

export const Route = createFileRoute("/_authenticated/recovery")({
	component: Recovery,
})

const RECOVERY_CARDS = [
	{
		session: "meditation",
		icon: "self_improvement",
		title: "Meditasi Pagi",
		description: "Latihan pernapasan 5 menit untuk menenangkan pikiran dan mempersiapkan sistem saraf Anda.",
		label: "Mulai Sesi",
		tone: "from-tertiary-container/40",
	},
	{
		session: "activity",
		icon: "directions_walk",
		title: "Aktivitas Ringan",
		description: "Panduan gerakan lambat untuk meregangkan otot tanpa membebani detak jantung Anda.",
		label: "Lihat Panduan",
		tone: "from-primary-container/40",
	},
	{
		session: "nutrition",
		icon: "restaurant_menu",
		title: "Nutrisi Harian",
		description: "Rekomendasi makanan yang mendukung elastisitas pembuluh darah dan kesehatan otak.",
		label: "Cek Menu",
		tone: "from-secondary-container/40",
	},
] as const

const ACHIEVEMENTS = [
	{
		icon: "favorite",
		color: "bg-primary",
		title: "Menjaga Tekanan Darah",
		body: "4 hari berturut-turut dalam batas normal.",
		state: "done",
	},
	{
		icon: "directions_run",
		color: "bg-secondary",
		title: "Konsisten Bergerak",
		body: "Telah menyelesaikan 3 sesi jalan santai.",
		state: "done",
	},
	{
		icon: "bedtime",
		color: "bg-outline",
		title: "Tidur Berkualitas",
		body: "Target: 7-8 jam per malam.",
		state: "pending",
	},
] as const

function Recovery() {
	const container = useRef<HTMLElement>(null)

	useGSAP(
		() => {
			gsap.from(".recovery-reveal", {
				opacity: 0,
				y: 20,
				duration: 0.6,
				stagger: 0.08,
				ease: "power3.out",
			})
			gsap.from(".recovery-blob", {
				scale: 0.5,
				opacity: 0,
				duration: 1.4,
				ease: "power2.out",
			})
		},
		{ scope: container },
	)

	return (
		<main ref={container} className="max-w-[1100px] mx-auto px-gutter py-section-gap flex flex-col gap-section-gap">
			<section className="recovery-hero recovery-reveal relative overflow-hidden rounded-3xl border border-outline-variant/10 px-8 py-10 md:px-12 md:py-14">
				<div
					className="recovery-hero-blob recovery-blob w-80 h-80 bg-tertiary"
					style={{ top: "-30%", right: "-10%" }}
					aria-hidden="true"
				/>
				<div
					className="recovery-hero-blob recovery-blob w-72 h-72 bg-primary"
					style={{ bottom: "-50%", left: "-15%" }}
					aria-hidden="true"
				/>

				<div className="relative z-10 space-y-3 max-w-2xl">
					<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
						Serene Recovery
					</span>
					<h1 className="font-headline-lg text-headline-lg md:text-display text-on-surface tracking-tight">
						Pemulihan Anda adalah perjalanan yang tenang.
					</h1>
					<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
						Kami menyusun panduan khusus yang disesuaikan dengan kondisi fisiologis Anda. Luangkan waktu sejenak,
						bernapas perlahan, dan mulai langkah demi langkah.
					</p>
				</div>
			</section>

			<section aria-labelledby="pilihan-pemulihan-heading" className="space-y-stack-sm">
				<h2
					id="pilihan-pemulihan-heading"
					className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest"
				>
					Pilihan Pemulihan
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
					{RECOVERY_CARDS.map((card) => (
						<div
							key={card.session}
							className={`recovery-reveal recovery-card-hover relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.tone} to-transparent`}
						>
							<RecoveryCard
								icon={
									<span className="material-symbols-outlined text-[28px]" aria-hidden="true">
										{card.icon}
									</span>
								}
								title={card.title}
								description={card.description}
								action={
									<Link
										to="/companion"
										search={{ session: card.session }}
										className="recovery-action-arrow font-label-caps text-label-caps text-primary uppercase tracking-widest hover:underline flex items-center gap-2"
									>
										{card.label}{" "}
										<span className="material-symbols-outlined text-[16px]" aria-hidden="true">
											arrow_forward
										</span>
									</Link>
								}
							/>
						</div>
					))}
				</div>
			</section>

			<section
				className="recovery-reveal recovery-card-hover bg-surface-container-low rounded-3xl border border-outline-variant/10 p-stack-md relative overflow-hidden"
				aria-labelledby="pencapaian-heading"
			>
				<div
					className="recovery-hero-blob recovery-blob w-72 h-72 bg-primary-fixed/30"
					style={{ top: "-20%", right: "-10%" }}
					aria-hidden="true"
				/>
				<div className="relative z-10">
					<div className="flex items-center gap-2 mb-stack-sm">
						<span className="material-symbols-outlined text-primary text-[24px]" aria-hidden="true">
							emoji_events
						</span>
						<h2 id="pencapaian-heading" className="font-headline-md text-[24px] text-on-surface">
							Pencapaian Minggu Ini
						</h2>
					</div>

					<ol className="relative border-l-2 border-outline-variant/30 pl-6 ml-4 space-y-8">
						{ACHIEVEMENTS.map((a) => (
							<li key={a.title} className="relative">
								<div
									className={`absolute -left-[35px] top-1 w-4 h-4 rounded-full ${a.color} ring-4 ring-surface-container-low`}
									aria-hidden="true"
								/>
								<h3
									className={`font-body-lg font-medium ${
										a.state === "pending" ? "text-on-surface-variant/60" : "text-on-surface"
									}`}
								>
									{a.title}
									{a.state === "pending" && (
										<span className="ml-2 text-xs uppercase tracking-widest text-on-surface-variant/60 font-label-caps">
											Mendatang
										</span>
									)}
								</h3>
								<p
									className={`font-body-md mt-1 ${
										a.state === "pending" ? "text-on-surface-variant/60" : "text-on-surface-variant"
									}`}
								>
									{a.body}
								</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			<div className="recovery-reveal flex justify-center">
				<Link
					to="/companion"
					className="inline-flex items-center min-h-12 gap-2 bg-primary text-on-primary rounded-full px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
				>
					<span className="material-symbols-outlined text-[20px]" aria-hidden="true">
						support_agent
					</span>
					Konsultasi dengan AI Companion
				</Link>
			</div>
		</main>
	)
}
