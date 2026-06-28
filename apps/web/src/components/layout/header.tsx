import { Link, useNavigate } from "@tanstack/react-router"
import { authClient } from "@web/libs/auth/client"

const NAV_LINK_CLASS =
	"font-body-md text-body-md font-normal hover:text-primary transition-all duration-300 cursor-pointer active:opacity-70 text-on-surface-variant"
const NAV_ACTIVE_CLASS = "text-primary font-bold border-b-2 border-primary pb-1"
const ACTION_CLASS =
	"bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps tracking-widest uppercase hover:opacity-90 transition-all cursor-pointer"

export function Header() {
	const { data: session } = authClient.useSession()
	const navigate = useNavigate()

	const signOut = async () => {
		await authClient.signOut()
		await navigate({ to: "/" })
	}

	const navLinks = (
		<>
			<Link to="/" className={NAV_LINK_CLASS} activeProps={{ className: NAV_ACTIVE_CLASS }}>
				Home
			</Link>
			<Link to="/kenali-stroke" className={NAV_LINK_CLASS} activeProps={{ className: NAV_ACTIVE_CLASS }}>
				Kenali Stroke
			</Link>
			{session && (
				<>
					<Link to="/dashboard" className={NAV_LINK_CLASS} activeProps={{ className: NAV_ACTIVE_CLASS }}>
						Dashboard
					</Link>
					<Link to="/companion" className={NAV_LINK_CLASS} activeProps={{ className: NAV_ACTIVE_CLASS }}>
						Riwayat
					</Link>
				</>
			)}
		</>
	)

	return (
		<header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-md">
			<nav className="flex justify-between items-center max-w-[1100px] mx-auto px-gutter py-4">
				<div className="font-headline-md text-headline-md font-bold text-primary">StrokeCare AI</div>
				<div className="hidden md:flex items-center gap-8">{navLinks}</div>
				<div className="flex items-center gap-3">
					{session ? (
						<button type="button" onClick={() => void signOut()} className={ACTION_CLASS}>
							Keluar
						</button>
					) : (
						<Link to="/auth/login" className={ACTION_CLASS}>
							Masuk
						</Link>
					)}
					<details className="md:hidden relative">
						<summary
							className="flex items-center justify-center min-w-11 min-h-11 rounded-lg list-none cursor-pointer text-on-surface-variant [&::-webkit-details-marker]:hidden"
							aria-label="Menu navigasi"
						>
							<svg
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								aria-hidden="true"
							>
								<line x1="4" y1="6" x2="20" y2="6" />
								<line x1="4" y1="12" x2="20" y2="12" />
								<line x1="4" y1="18" x2="20" y2="18" />
							</svg>
						</summary>
						<div className="absolute right-0 top-full mt-2 flex flex-col gap-1 bg-surface-container-low border border-outline-variant/10 rounded-xl p-stack-sm min-w-44 shadow-lg">
							{navLinks}
						</div>
					</details>
				</div>
			</nav>
		</header>
	)
}
