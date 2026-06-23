import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"

const GAUGE_COLORS: Record<"low" | "medium" | "high", string> = {
	low: "#4caf50",
	medium: "#ff9800",
	high: "#f44336",
}

const SEMI_CIRCUMFERENCE = Math.PI * 80

interface RiskGaugeProps {
	score: number
	level: "low" | "medium" | "high"
}

export function RiskGauge({ score, level }: RiskGaugeProps) {
	const clamped = Math.min(100, Math.max(0, score))
	const color = GAUGE_COLORS[level]
	const container = useRef<HTMLDivElement>(null)
	const fillRef = useRef<SVGPathElement>(null)
	const labelRef = useRef<HTMLSpanElement>(null)

	useGSAP(
		() => {
			const counter = { value: 0 }
			gsap.to(fillRef.current, {
				strokeDasharray: `${(clamped / 100) * SEMI_CIRCUMFERENCE} ${SEMI_CIRCUMFERENCE}`,
				duration: 1,
				ease: "power2.out",
			})
			gsap.to(counter, {
				value: clamped,
				duration: 1,
				ease: "power2.out",
				onUpdate: () => {
					if (labelRef.current) labelRef.current.textContent = `${Math.round(counter.value)}%`
				},
			})
		},
		{ dependencies: [clamped], scope: container, revertOnUpdate: true },
	)

	return (
		<div ref={container} className="relative flex items-center justify-center w-[200px] h-[120px]">
			<svg width="200" height="110" viewBox="0 0 200 110" aria-hidden="true">
				<path
					d="M 20 100 A 80 80 0 0 1 180 100"
					fill="none"
					stroke="currentColor"
					strokeWidth="14"
					className="text-outline-variant/20"
					strokeLinecap="round"
				/>
				<path
					ref={fillRef}
					d="M 20 100 A 80 80 0 0 1 180 100"
					fill="none"
					stroke={color}
					strokeWidth="14"
					strokeDasharray={`0 ${SEMI_CIRCUMFERENCE}`}
					strokeLinecap="round"
				/>
			</svg>
			<div className="absolute bottom-0 inset-x-0 text-center">
				<span ref={labelRef} className="font-headline-lg text-headline-lg font-bold" style={{ color }}>
					0%
				</span>
			</div>
		</div>
	)
}
