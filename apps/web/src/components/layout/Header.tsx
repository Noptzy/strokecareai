import { Link, useRouter } from "@tanstack/react-router"
import { authClient } from "../../libs/auth/client"

export function Header() {
	const router = useRouter()
	const session = authClient.useSession()
	const user = session.data?.user

	async function handleSignOut() {
		await authClient.signOut()
		await router.invalidate()
		await router.navigate({ to: "/" })
	}

	return (
		<header className="w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-md">
			<nav className="flex justify-between items-center max-w-[1100px] mx-auto px-gutter py-4">
				<Link to="/" className="font-headline-md text-headline-md font-bold text-primary">
					StrokeCare AI
				</Link>
				<div className="hidden md:flex items-center gap-8">
					<Link
						to="/"
						className="font-body-md text-body-md font-normal hover:text-primary transition-all duration-300 cursor-pointer active:opacity-70 text-on-surface-variant"
						activeProps={{ className: "text-primary font-bold border-b-2 border-primary pb-1" }}
					>
						Home
					</Link>
					<Link
						to="/kenali-stroke"
						className="font-body-md text-body-md font-normal hover:text-primary transition-all duration-300 cursor-pointer active:opacity-70 text-on-surface-variant"
						activeProps={{ className: "text-primary font-bold border-b-2 border-primary pb-1" }}
					>
						Kenali Stroke
					</Link>
					<Link
						to="/dashboard"
						className="font-body-md text-body-md font-normal hover:text-primary transition-all duration-300 cursor-pointer active:opacity-70 text-on-surface-variant"
						activeProps={{ className: "text-primary font-bold border-b-2 border-primary pb-1" }}
					>
						Dashboard
					</Link>
				</div>
				{user ? (
					<div className="flex items-center gap-3">
						<span className="hidden sm:block font-caption text-caption text-on-surface-variant max-w-[160px] truncate">
							{user.name}
						</span>
						<button
							type="button"
							onClick={handleSignOut}
							className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps tracking-widest uppercase hover:opacity-90 transition-all cursor-pointer"
						>
							Keluar
						</button>
					</div>
				) : (
					<Link
						to="/auth/login"
						className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps tracking-widest uppercase hover:opacity-90 transition-all cursor-pointer"
					>
						Masuk
					</Link>
				)}
			</nav>
		</header>
	)
}
