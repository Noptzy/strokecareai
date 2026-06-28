export function Empty({ title, description }: { title: string; description?: string }) {
	return (
		<div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
			<div className="mb-4 rounded-full bg-muted p-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="lucide lucide-inbox"
				>
					<title>Kosong</title>
					<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
					<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
				</svg>
			</div>
			<h3 className="mb-1 font-semibold text-foreground">{title}</h3>
			{description && <p className="text-sm">{description}</p>}
		</div>
	)
}
