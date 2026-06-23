import type { ReactNode } from "react"

interface FeatureCardProps {
	icon: ReactNode
	title: string
	description: string
	className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
	return (
		<article
			className={`feature-card bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow ${className ?? ""}`}
		>
			<div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary mb-6">
				{icon}
			</div>
			<h3 className="font-headline-md text-[20px] mb-3">{title}</h3>
			<p className="font-body-md text-on-surface-variant leading-relaxed">{description}</p>
		</article>
	)
}
