import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/not-found")({
	component: NotFound,
})

function NotFound() {
	return (
		<main className="min-h-[70vh] flex items-center justify-center px-gutter py-section-gap">
			<div className="text-center space-y-stack-md max-w-md">
				<div
					className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-primary-container/30 mb-stack-sm"
					aria-hidden="true"
				>
					<span className="font-display text-display text-primary text-6xl">404</span>
				</div>
				<div className="space-y-2">
					<h1 className="font-headline-lg text-headline-lg text-on-surface">Halaman tidak ditemukan</h1>
					<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
						Tautan yang Anda buka mungkin sudah tidak berlaku atau halaman telah dipindahkan. Mari kembali ke jalur yang
						aman.
					</p>
				</div>
				<div className="flex flex-col sm:flex-row gap-3 justify-center pt-stack-sm">
					<Link
						to="/dashboard"
						className="inline-flex items-center justify-center min-h-11 bg-primary text-on-primary rounded-lg px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity"
					>
						Kembali ke Dashboard
					</Link>
					<Link
						to="/"
						className="inline-flex items-center justify-center min-h-11 border border-outline/20 text-on-surface rounded-lg px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container-high transition-colors"
					>
						Halaman Utama
					</Link>
				</div>
			</div>
		</main>
	)
}
