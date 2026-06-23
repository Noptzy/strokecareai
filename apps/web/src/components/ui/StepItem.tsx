interface StepItemProps {
	number: number
	title: string
	description: string
}

export function StepItem({ number, title, description }: StepItemProps) {
	return (
		<div className="step-item flex gap-6">
			<div className="flex-none w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md shadow-md">
				{number}
			</div>
			<div className="flex-1 space-y-2">
				<h3 className="font-headline-md text-[20px]">{title}</h3>
				<p className="font-body-md text-on-surface-variant leading-relaxed">{description}</p>
			</div>
		</div>
	)
}
