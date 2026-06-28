import { useGSAP } from "@gsap/react"
import { Link, createFileRoute } from "@tanstack/react-router"
import { authClient } from "@web/libs/auth/client"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRef } from "react"
import "./kenali-stroke.css"

gsap.registerPlugin(useGSAP, ScrollTrigger)

export const Route = createFileRoute("/kenali-stroke")({
	component: KenaliStroke,
})

interface Scene {
	readonly id: number
	readonly bg: string
	readonly fg: string
	readonly accent: string
	readonly eyebrow: string
	readonly title: string
	readonly body: string
	readonly cta: boolean
}

const SCENES: readonly Scene[] = [
	{
		id: 1,
		bg: "#f9f6f0",
		fg: "#1c1917",
		accent: "#892d32",
		eyebrow: "Tahap Awal",
		title: "Stroke sering dimulai dengan gejala yang terlihat ringan.",
		body: "Seringkali diabaikan karena dianggap kelelahan biasa. Kewaspadaan dini adalah kunci keselamatan.",
		cta: false,
	},
	{
		id: 2,
		bg: "#f2ebe1",
		fg: "#1c1917",
		accent: "#99452c",
		eyebrow: "Kognitif",
		title: "Kesulitan memahami percakapan sederhana.",
		body: "Otak mulai mengalami disrupsi aliran darah, menghambat pemrosesan bahasa dan logika dasar.",
		cta: false,
	},
	{
		id: 3,
		bg: "#ebddd0",
		fg: "#1c1917",
		accent: "#735c00",
		eyebrow: "Artikulasi",
		title: "Ucapan menjadi tidak jelas atau terdengar pelo.",
		body: "Otot wajah melemah. Cobalah meminta mereka mengucap kalimat sederhana; perhatikan kejelasan suaranya.",
		cta: false,
	},
	{
		id: 4,
		bg: "#e58a67",
		fg: "#ffffff",
		accent: "#ffffff",
		eyebrow: "Motorik Halus",
		title: "Kesulitan mengangkat satu sisi tubuh.",
		body: "Kelumpuhan sesaat atau kelemahan drastis pada satu lengan atau kaki merupakan tanda bahaya utama.",
		cta: false,
	},
	{
		id: 5,
		bg: "#c85a41",
		fg: "#ffffff",
		accent: "#ffffff",
		eyebrow: "Keseimbangan",
		title: "Kesulitan berjalan atau koordinasi tubuh menurun.",
		body: "Sensasi limbung yang tiba-tiba. Dunia seakan berputar, dan langkah kaki menjadi tidak sinkron.",
		cta: false,
	},
	{
		id: 6,
		bg: "#8b2621",
		fg: "#ffffff",
		accent: "#fde68a",
		eyebrow: "Golden Hour",
		title: "Setiap menit sangat berarti.",
		body: "Penanganan yang terlambat dapat meningkatkan risiko kerusakan permanen pada jaringan otak. Panggil layanan darurat sekarang.",
		cta: false,
	},
	{
		id: 7,
		bg: "#4a1513",
		fg: "#ffffff",
		accent: "#fde68a",
		eyebrow: "Bertindak Sekarang",
		title: "Jangan tunggu gejala memburuk.",
		body: "Deteksi dini adalah perlindungan terbaik bagi Anda dan orang yang Anda cintai. Gunakan AI kami untuk memantau risiko secara presisi.",
		cta: true,
	},
]

const SCENE_TOTAL_HEIGHT_VH = SCENES.length * 100

function KenaliStroke() {
	const { data: session } = authClient.useSession()
	const container = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			const mm = gsap.matchMedia(container)
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const firstScene = SCENES[0]
				gsap.set(".bg-anim-container", { backgroundColor: firstScene.bg, color: firstScene.fg })
				gsap.set(".scene-figure", { opacity: 0, scale: 0.92 })
				gsap.set(".scene-text", { opacity: 0, y: 30 })
				gsap.set(".figure-0, .text-0", { opacity: 1, scale: 1, y: 0 })

				SCENES.forEach((_, i) => {
					ScrollTrigger.create({
						trigger: `[data-marker="${i + 1}"]`,
						start: "top center",
						end: "bottom center",
						onEnter: () => showScene(i),
						onEnterBack: () => showScene(i),
					})
				})

				const bgTimeline = gsap.timeline({
					defaults: { immediateRender: true },
					scrollTrigger: {
						trigger: container.current,
						start: "top top",
						end: "bottom bottom",
						scrub: 0.3,
					},
				})
				SCENES.forEach((scene, i) => {
					bgTimeline.to(
						".bg-anim-container",
						{ backgroundColor: scene.bg, color: scene.fg, duration: 1, ease: "none" },
						i,
					)
				})
			})

			// Fallback for reduced motion
			mm.add("(prefers-reduced-motion: reduce)", () => {
				const lastScene = SCENES[SCENES.length - 1]
				gsap.set(".bg-anim-container", { backgroundColor: lastScene.bg, color: lastScene.fg })
				gsap.set(".scene-figure", { opacity: 1, scale: 1 })
				gsap.set(".scene-text", { opacity: 1, y: 0 })
			})
		},
		{ scope: container },
	)

	function showScene(index: number) {
		gsap.to(".scene-figure", { opacity: 0, scale: 0.92, duration: 0.5, ease: "power2.out", overwrite: "auto" })
		gsap.to(`.figure-${index}`, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.2)", overwrite: "auto" })
		gsap.to(".scene-text", { opacity: 0, y: 30, duration: 0.4, ease: "power2.out", overwrite: "auto" })
		gsap.to(`.text-${index}`, { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out", overwrite: "auto" })
	}

	return (
		<main ref={container} className="relative bg-transparent" style={{ height: `${SCENE_TOTAL_HEIGHT_VH}vh` }}>
			<Link
				to={session ? "/dashboard" : "/"}
				className="fixed top-5 left-5 z-50 flex items-center gap-2 min-h-11 px-4 py-2 rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/50 transition-colors font-label-caps text-label-caps uppercase tracking-widest"
				aria-label="Kembali"
			>
				← Kembali
			</Link>
			{SCENES.map((scene, i) => (
				<div
					key={scene.id}
					data-marker={scene.id}
					className="absolute left-0 w-full"
					style={{ top: `${i * 100}vh`, height: "100vh" }}
					aria-hidden="true"
				/>
			))}

			<div className="bg-anim-container sticky top-0 h-screen w-full overflow-hidden">
				<div className="relative h-full w-full">
					<div className="absolute left-[6%] top-1/2 -translate-y-1/2 w-[36%] max-w-[420px] aspect-[3/4]">
						{SCENES.map((scene, i) => (
							<div
								key={scene.id}
								className={`scene-figure figure-${i} absolute inset-0 flex items-center justify-center`}
								style={{ color: scene.fg }}
							>
								<SceneFigure variant={i} accent={scene.accent} />
							</div>
						))}
					</div>

					<div className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[44%] max-w-[520px]">
						{SCENES.map((scene, i) => (
							<div key={scene.id} className={`scene-text text-${i} absolute inset-0 flex flex-col justify-center`}>
								<span
									className="font-label-caps text-label-caps uppercase tracking-widest mb-4"
									style={{ color: scene.cta ? scene.accent : scene.fg, opacity: scene.cta ? 1 : 0.75 }}
								>
									{scene.eyebrow}
								</span>
								<h2
									className="font-headline-lg text-headline-lg md:text-display leading-tight mb-stack-sm"
									style={{ color: scene.fg }}
								>
									{scene.title}
								</h2>
								<p
									className="font-body-md text-body-md leading-relaxed max-w-[440px]"
									style={{ color: scene.fg, opacity: 0.85 }}
								>
									{scene.body}
								</p>
								{scene.cta ? (
									<div className="flex flex-col md:flex-row gap-stack-md mt-stack-md">
										{session ? (
											<Link
												to="/dashboard"
												className="px-8 py-4 bg-white text-[#4a1513] rounded-full font-headline-md text-headline-md font-bold shadow-xl hover:scale-105 transition-transform text-center"
											>
												Kembali ke Dashboard
											</Link>
										) : (
											<Link
												to="/auth/login"
												className="px-8 py-4 bg-white text-[#4a1513] rounded-full font-headline-md text-headline-md font-bold shadow-xl hover:scale-105 transition-transform text-center"
											>
												Pelajari Risiko Anda (Login)
											</Link>
										)}
										<button
											type="button"
											className="px-8 py-4 border-2 border-white/40 text-white rounded-full font-headline-md text-headline-md font-medium hover:bg-white/10 transition-colors"
										>
											Hubungi Layanan Darurat
										</button>
									</div>
								) : null}
							</div>
						))}
					</div>

					<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none">
						<div className="w-px h-12 bg-current opacity-30 overflow-hidden">
							<div className="w-full h-1/2 bg-current animate-[scrollPulse_1.8s_ease-in-out_infinite]" />
						</div>
						<span className="font-label-caps text-label-caps uppercase tracking-widest opacity-60">
							Gulir untuk melanjutkan
						</span>
					</div>
				</div>
			</div>
		</main>
	)
}

interface SceneFigureProps {
	variant: number
	accent: string
}

function SceneFigure({ variant, accent }: SceneFigureProps) {
	const stroke = variant >= 4 ? "#ffffff" : "#161d1f"
	const baseProps = {
		viewBox: "0 0 100 150",
		fill: "none" as const,
		stroke,
		strokeWidth: 3,
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
		className: "w-full h-full",
	}

	switch (variant) {
		case 0:
			return (
				<svg {...baseProps} aria-hidden="true">
					<circle cx="50" cy="30" r="12" />
					<path d="M50 42 L50 90 M50 50 L30 80 M50 50 L70 80 M50 90 L35 140 M50 90 L65 140" />
				</svg>
			)
		case 1:
			return (
				<svg {...baseProps} aria-hidden="true">
					<circle cx="45" cy="32" r="12" />
					<path d="M45 44 L50 90 M50 50 L32 72 M50 50 L72 60 M72 60 L82 45 M50 90 L35 140 M50 90 L65 140" />
					<path d="M82 12 C 92 8, 96 22, 86 32 C 80 36, 80 42, 80 42" stroke={accent} />
					<circle cx="86" cy="52" r="2.5" fill={accent} stroke="none" />
				</svg>
			)
		case 2:
			return (
				<svg {...baseProps} aria-hidden="true">
					<circle cx="50" cy="30" r="12" />
					<path d="M50 42 L50 90 M50 50 L30 80 M50 50 L70 80 M50 90 L35 140 M50 90 L65 140" />
					<path d="M62 30 Q 72 18 82 28 T 96 22" strokeWidth={2} opacity={0.7} />
					<path d="M60 38 Q 72 34 78 44 T 92 42" strokeWidth={2} opacity={0.7} />
					<path d="M58 24 Q 68 14 78 22" strokeWidth={2} opacity={0.5} />
				</svg>
			)
		case 3:
			return (
				<svg {...baseProps} aria-hidden="true">
					<circle cx="50" cy="30" r="12" />
					<path d="M50 42 L50 90 M50 50 L30 80 M50 50 L62 92 M50 90 L35 140 M50 90 L65 140" />
					<path d="M68 88 L68 110 M63 105 L68 110 L73 105" stroke={accent} strokeWidth={2.5} />
					<circle cx="68" cy="118" r="1.5" fill={accent} stroke="none" />
				</svg>
			)
		case 4:
			return (
				<svg {...baseProps} aria-hidden="true">
					<circle cx="58" cy="35" r="12" />
					<path d="M58 47 L45 92 M48 55 L26 76 M48 55 L76 82 M45 92 L40 138 M45 92 L70 128" />
					<path d="M18 122 Q 30 142 52 146" strokeWidth={2} strokeDasharray="4 4" opacity={0.7} />
					<path d="M82 60 L82 78" stroke={accent} strokeWidth={3} />
				</svg>
			)
		case 5:
			return (
				<svg {...baseProps} aria-hidden="true">
					<circle cx="65" cy="40" r="12" />
					<path d="M65 52 L40 95 M50 60 L20 70 M50 60 L82 92 M40 95 L30 140 M40 95 L65 130" />
					<path d="M88 8 L88 30 M86 36 L90 36" stroke={accent} strokeWidth={4} />
					<path d="M12 22 L24 36 M8 46 L14 50" stroke={accent} strokeWidth={3} opacity={0.8} />
					<circle cx="88" cy="42" r="3" fill={accent} stroke="none" />
				</svg>
			)
		case 6:
			return (
				<svg {...baseProps} aria-hidden="true">
					<circle cx="35" cy="82" r="12" />
					<path d="M35 94 L35 130 M35 102 L15 122 M35 102 L55 122 M35 130 L62 130 M62 130 L82 140" />
					<path d="M8 146 L92 146" stroke={stroke} strokeWidth={2} opacity={0.4} />
					<path d="M55 70 L55 86 M52 82 L55 86 L58 82" stroke={accent} strokeWidth={2.5} />
				</svg>
			)
		default:
			return null
	}
}
