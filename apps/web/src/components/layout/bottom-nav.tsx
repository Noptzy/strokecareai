import { Link, useNavigate } from "@tanstack/react-router"
import { authClient } from "@web/libs/auth/client"

export function BottomNav() {
	const navigate = useNavigate()
	const signOut = async () => {
		await authClient.signOut()
		await navigate({ to: "/auth/login" })
	}

	return (
		<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface-container-low border-t border-outline-variant/20 shadow-sm rounded-t-full">
			<Link
				to="/dashboard"
				className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-transform duration-200 hover:bg-surface-container-high p-2 rounded-full"
				activeProps={{ className: "bg-primary-container text-on-primary-container rounded-full px-4 py-1" }}
			>
				<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
					dashboard
				</span>
				<span className="font-label-caps text-[10px] uppercase">Dash</span>
			</Link>
			<Link
				to="/companion"
				className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-transform duration-200 hover:bg-surface-container-high p-2 rounded-full"
				activeProps={{ className: "bg-primary-container text-on-primary-container rounded-full px-4 py-1" }}
			>
				<span className="material-symbols-outlined">history</span>
				<span className="font-label-caps text-[10px] uppercase">Riwayat</span>
			</Link>
			<button
				type="button"
				onClick={() => void signOut()}
				className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-transform duration-200 hover:bg-surface-container-high p-2 rounded-full"
			>
				<span className="material-symbols-outlined">logout</span>
				<span className="font-label-caps text-[10px] uppercase">Keluar</span>
			</button>
		</nav>
	)
}
