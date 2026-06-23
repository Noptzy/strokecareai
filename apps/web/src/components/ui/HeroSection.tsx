import type { ReactNode } from "react"

interface HeroSectionProps {
	eyebrow: string
	title: ReactNode
	description: string
	primaryAction?: ReactNode
	secondaryAction?: ReactNode
	illustration?: ReactNode
}

export function HeroSection({
	eyebrow,
	title,
	description,
	primaryAction,
	secondaryAction,
	illustration,
}: HeroSectionProps) {
	return (
		<section className="py-section-gap flex flex-col md:flex-row items-center gap-12 min-h-[716px]">
			<div className="flex-1 space-y-stack-md hero-content">
				<div className="inline-block bg-primary-container/10 text-primary font-label-caps text-label-caps px-3 py-1 rounded-sm border border-primary/20">
					{eyebrow}
				</div>
				<h1 className="font-display text-display leading-tight text-on-surface">{title}</h1>
				<p className="font-body-lg text-body-lg text-on-surface-variant max-w-[500px]">{description}</p>
				<div className="flex flex-wrap gap-4 pt-stack-sm">
					{primaryAction}
					{secondaryAction}
				</div>
			</div>
			{illustration ? <div className="flex-1 hero-image">{illustration}</div> : null}
		</section>
	)
}
