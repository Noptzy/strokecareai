import { Outlet, createFileRoute } from "@tanstack/react-router"
import { Footer } from "@web/components/layout/footer"
import { Header } from "@web/components/layout/header"

export const Route = createFileRoute("/_public")({
	component: PublicLayout,
})

function PublicLayout() {
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	)
}
