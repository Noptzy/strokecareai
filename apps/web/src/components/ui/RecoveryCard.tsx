import type { ReactNode } from "react"

interface RecoveryCardProps {
	icon: ReactNode
	title: string
	description: string
	action: ReactNode
}

export function RecoveryCard({ icon, title, description, action }: RecoveryCardProps) {
	return (
		<article className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
			<div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary mb-6">
				{icon}
			</div>
			<h2 className="font-headline-md text-[20px] mb-3">{title}</h2>
			<p className="font-body-md text-on-surface-variant leading-relaxed mb-6">{description}</p>
			{action}
		</article>
	)
}
