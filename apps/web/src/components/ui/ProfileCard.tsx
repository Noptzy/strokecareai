import type { ReactNode } from "react"

interface ProfileCardProps {
	avatarUrl?: string
	title: string
	subtitle?: string
	children?: ReactNode
}

export function ProfileCard({ avatarUrl, title, subtitle, children }: ProfileCardProps) {
	return (
		<section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]">
			<div className="flex items-center gap-4 mb-6">
				{avatarUrl ? (
					<div
						className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
						style={{ backgroundImage: `url('${avatarUrl}')` }}
					/>
				) : null}
				<div>
					<h2 className="font-headline-md text-headline-md">{title}</h2>
					{subtitle ? (
						<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
							{subtitle}
						</span>
					) : null}
				</div>
			</div>
			{children}
		</section>
	)
}
