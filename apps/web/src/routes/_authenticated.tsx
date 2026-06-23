import { Link, Navigate, Outlet, createFileRoute, redirect, useRouteContext } from "@tanstack/react-router"
import { BottomNav } from "@web/components/layout/bottom-nav"
import { Header } from "@web/components/layout/header"
import { Loading } from "@web/components/ui/loading"
import { useProfile } from "@web/hooks/use-profile"

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({ context }) => {
		if (!context.session) {
			throw redirect({ to: "/auth/login" })
		}
	},
	errorComponent: RouteError,
	component: AuthenticatedLayout,
})

function RouteError({ error }: { error: Error }) {
	return (
		<main className="min-h-screen flex items-center justify-center px-gutter bg-surface">
			<div className="max-w-md text-center space-y-stack-md">
				<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error-container/30 mb-stack-sm">
					<span className="font-headline-md text-headline-md text-error">!</span>
				</div>
				<h1 className="font-headline-lg text-headline-lg text-error">Terjadi Kesalahan</h1>
				<p className="font-body-md text-on-surface-variant">{error.message}</p>
				<div className="flex flex-col sm:flex-row gap-3 justify-center pt-stack-sm">
					<Link
						to="/dashboard"
						className="inline-flex items-center justify-center min-h-11 bg-primary text-on-primary rounded-lg px-6 py-3 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity"
					>
						Dashboard
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

function AuthenticatedLayout() {
	const { session } = useRouteContext({ from: "/_authenticated" })
	const isAdmin = session?.user.role === "admin"

	const { data: profile, isLoading, error } = useProfile()

	if (!isAdmin) {
		if (isLoading) return <Loading message="Memuat profil..." />

		if (error) {
			return <RouteError error={error as Error} />
		}

		if (!profile || !profile.onboardingCompleted) {
			return <Navigate to="/onboarding" />
		}
	}

	return (
		<div className="flex flex-col min-h-screen">
			{!isAdmin && <Header />}
			<main className="flex-1 pb-[72px] md:pb-0">
				<Outlet />
			</main>
			{!isAdmin && <BottomNav />}
		</div>
	)
}
