interface RiskBadgeProps {
	level: "low" | "medium" | "high"
}

const LEVEL_STYLES: Record<RiskBadgeProps["level"], string> = {
	low: "bg-tertiary-container text-on-tertiary-container",
	medium: "bg-secondary-container text-on-secondary-container",
	high: "bg-error-container text-on-error-container",
}

const LEVEL_LABELS: Record<RiskBadgeProps["level"], string> = {
	low: "Risiko Rendah",
	medium: "Risiko Sedang",
	high: "Risiko Tinggi",
}

export function RiskBadge({ level }: RiskBadgeProps) {
	return (
		<span
			className={`inline-block font-label-caps text-label-caps uppercase tracking-widest px-3 py-1 rounded-full ${LEVEL_STYLES[level]}`}
		>
			{LEVEL_LABELS[level]}
		</span>
	)
}
