import { Link, Outlet, createFileRoute, redirect, useLocation, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import logoUrl from "../../../../../assets/logo.png"
import "./admin.css"

export const Route = createFileRoute("/_authenticated/admin")({
	beforeLoad: ({ context }) => {
		if (context.session?.user?.role !== "admin") {
			throw redirect({ to: "/dashboard" })
		}
	},
	component: AdminLayout,
})

type NavItem = {
	to: string
	label: string
	icon: string
	badge?: string
}

type NavSection = {
	label: string
	items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
	{
		label: "Main",
		items: [
			{ to: "/admin", label: "Dashboard", icon: "dashboard" },
			{ to: "/admin/users", label: "Users", icon: "group" },
			{ to: "/admin/settings", label: "Settings", icon: "settings" },
		],
	},
	{
		label: "Account",
		items: [{ to: "/admin/profile", label: "Admin Profile", icon: "account_circle" }],
	},
]

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
	"/admin": { title: "Dashboard", subtitle: "Ringkasan sistem StrokeCare AI" },
	"/admin/users": { title: "Users", subtitle: "Kelola pengguna terdaftar" },
	"/admin/settings": { title: "Settings", subtitle: "Konfigurasi sistem" },
	"/admin/profile": { title: "Admin Profile", subtitle: "Profil administrator" },
}

function isItemActive(itemPath: string, currentPath: string): boolean {
	if (itemPath === "/admin") {
		return currentPath === "/admin" || currentPath === "/admin/"
	}
	return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}

function AdminLayout() {
	const [collapsed, setCollapsed] = useState(false)
	const [mobileOpen, setMobileOpen] = useState(false)
	const location = useLocation()
	const navigate = useNavigate()
	const currentPath = location.pathname
	const meta = PAGE_META[currentPath] ?? { title: "Admin", subtitle: "" }

	const handleLogout = async () => {
		try {
			await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" })
		} catch (e) {
			console.error(e)
		}
		window.location.href = "/auth/login"
	}

	const closeMobile = () => setMobileOpen(false)

	return (
		<div className="admin-layout">
			<button
				type="button"
				aria-label="Tutup sidebar"
				className={`admin-backdrop ${mobileOpen ? "open" : ""}`}
				onClick={closeMobile}
			/>

			<aside
				className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}
				aria-label="Navigasi admin"
			>
				<div className="admin-sidebar-header">
					<div className="admin-logo">
						<img
							src={logoUrl}
							alt="StrokeCare Admin"
							width={36}
							height={36}
							onError={(e) => {
								const target = e.currentTarget
								target.style.display = "none"
								const parent = target.parentElement
								if (parent && !parent.querySelector(".admin-logo-fallback")) {
									const fallback = document.createElement("span")
									fallback.className = "admin-logo-fallback"
									fallback.textContent = "S"
									parent.appendChild(fallback)
								}
							}}
						/>
					</div>
					<div className="admin-brand">
						<span className="admin-brand-name">StrokeCare Admin</span>
						<span className="admin-brand-tag">Console</span>
					</div>
				</div>

				<nav className="admin-nav" aria-label="Menu utama">
					{NAV_SECTIONS.map((section) => (
						<div key={section.label} className="admin-nav-section">
							<h3 className="admin-nav-section-label" title={section.label}>
								{section.label}
							</h3>
							{section.items.map((item) => {
								const isActive = isItemActive(item.to, currentPath)
								const isDisabled = item.badge === "Soon"
								return isDisabled ? (
									<div
										key={item.to}
										className="admin-nav-item"
										style={{ opacity: 0.45, cursor: "not-allowed" }}
										title="Coming soon"
									>
										<span className="material-symbols-outlined" aria-hidden="true">
											{item.icon}
										</span>
										<span className="admin-nav-item-label">{item.label}</span>
										{item.badge && <span className="admin-nav-badge">{item.badge}</span>}
									</div>
								) : (
									<Link
										key={item.to}
										to={item.to}
										activeOptions={{ exact: true }}
										className={`admin-nav-item ${isActive ? "active" : ""}`}
										onClick={closeMobile}
									>
										<span className="material-symbols-outlined" aria-hidden="true">
											{item.icon}
										</span>
										<span className="admin-nav-item-label">{item.label}</span>
									</Link>
								)
							})}
						</div>
					))}
				</nav>

				<div className="admin-sidebar-footer">
					<button
						type="button"
						className="admin-collapse-btn"
						onClick={() => setCollapsed((v) => !v)}
						aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						<span className="material-symbols-outlined" aria-hidden="true">
							{collapsed ? "chevron_right" : "chevron_left"}
						</span>
					</button>
					<button
						type="button"
						className="admin-collapse-btn"
						onClick={handleLogout}
						aria-label="Logout"
						title="Logout"
					>
						<span className="material-symbols-outlined" aria-hidden="true">
							logout
						</span>
					</button>
				</div>
			</aside>

			<div className="admin-main">
				<header className="admin-topbar">
					<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
						<button
							type="button"
							className="admin-mobile-toggle"
							onClick={() => setMobileOpen(true)}
							aria-label="Buka menu"
						>
							<span className="material-symbols-outlined" aria-hidden="true">
								menu
							</span>
						</button>
						<div className="admin-topbar-title">
							<h1>{meta.title}</h1>
							{meta.subtitle && <p>{meta.subtitle}</p>}
						</div>
					</div>
					<div className="admin-topbar-actions">
						<button
							type="button"
							className="admin-btn secondary"
							onClick={() => navigate({ to: "/" })}
							title="Lihat sebagai user"
						>
							<span className="material-symbols-outlined" aria-hidden="true">
								open_in_new
							</span>
							View Site
						</button>
					</div>
				</header>

				<main className="admin-content">
					<Outlet />
				</main>
			</div>
		</div>
	)
}
