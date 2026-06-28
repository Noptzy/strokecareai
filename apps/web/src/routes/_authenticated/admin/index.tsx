import { useGSAP } from "@gsap/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import gsap from "gsap"
import { useRef } from "react"
import { useAdminDashboard } from "@web/hooks/use-admin-dashboard"

export const Route = createFileRoute("/_authenticated/admin/")({
	component: AdminDashboard,
})

const RECENT_ACTIVITY = [
	{ icon: "person_add", title: "User baru terdaftar", time: "2 menit lalu" },
	{ icon: "psychology", title: "Knowledge Base diperbarui ke v1.2", time: "1 jam lalu" },
	{ icon: "description", title: "Prompt v1.3 dipublish", time: "3 jam lalu" },
	{ icon: "warning", title: "5 user terdeteksi risiko tinggi", time: "5 jam lalu" },
	{ icon: "forum", title: "342 chat session hari ini", time: "8 jam lalu" },
]

const WEEKLY_BAR_HEIGHTS = [42, 58, 48, 72, 64, 88, 76]

function AdminDashboard() {
	const { data, isLoading, error } = useAdminDashboard()
	const container = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			gsap.from(".admin-reveal", {
				opacity: 0,
				y: 12,
				duration: 0.5,
				stagger: 0.06,
				ease: "power2.out",
			})
			gsap.from(".admin-chart-bar", {
				scaleY: 0,
				transformOrigin: "bottom",
				duration: 0.8,
				stagger: 0.05,
				ease: "power3.out",
			})
		},
		{ scope: container },
	)

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="admin-stats-grid">
					{[0, 1, 2, 3].map((i) => (
						<div key={i} className="admin-stat-card animate-pulse h-28" />
					))}
				</div>
				<div className="admin-panel h-64 animate-pulse" />
			</div>
		)
	}

	if (error) {
		return (
			<div role="alert" className="admin-panel text-center py-12">
				<p className="text-error">Gagal memuat dashboard: {(error as Error).message}</p>
			</div>
		)
	}

	const totalUsers = data?.totalUsers ?? 0
	const high = data?.riskTiers.high ?? 0
	const medium = data?.riskTiers.medium ?? 0
	const low = data?.riskTiers.low ?? 0
	const totalSessions = 3241

	return (
		<div ref={container} className="space-y-6">
			<section className="admin-reveal">
				<h2 className="admin-brand-name" style={{ fontSize: 22, marginBottom: 4 }}>
					Selamat datang, Admin
				</h2>
				<p className="admin-toggle-desc">Ringkasan sistem StrokeCare AI</p>
			</section>

			<section className="admin-stats-grid">
				<article className="admin-stat-card admin-reveal">
					<div className="admin-stat-header">
						<div className="admin-stat-icon">
							<span className="material-symbols-outlined" aria-hidden="true">group</span>
						</div>
					</div>
					<p className="admin-stat-label">Total Users</p>
					<p className="admin-stat-value">{totalUsers.toLocaleString("id-ID")}</p>
					<p className="admin-stat-delta">
						<span className="material-symbols-outlined" style={{ fontSize: 14 }} aria-hidden="true">trending_up</span>
						+12 minggu ini
					</p>
				</article>

				<article className="admin-stat-card admin-reveal">
					<div className="admin-stat-header">
						<div className="admin-stat-icon success">
							<span className="material-symbols-outlined" aria-hidden="true">forum</span>
						</div>
					</div>
					<p className="admin-stat-label">Total Chat Sessions</p>
					<p className="admin-stat-value">{totalSessions.toLocaleString("id-ID")}</p>
					<p className="admin-toggle-desc">7 hari terakhir</p>
				</article>

				<article className="admin-stat-card admin-reveal">
					<div className="admin-stat-header">
						<div className="admin-stat-icon error">
							<span className="material-symbols-outlined" aria-hidden="true">warning</span>
						</div>
					</div>
					<p className="admin-stat-label">High Risk Users</p>
					<p className="admin-stat-value">{high}</p>
					<p className="admin-stat-delta down">
						<span className="material-symbols-outlined" style={{ fontSize: 14 }} aria-hidden="true">priority_high</span>
						perlu perhatian
					</p>
				</article>

				<article className="admin-stat-card admin-reveal">
					<div className="admin-stat-header">
						<div className="admin-stat-icon warning">
							<span className="material-symbols-outlined" aria-hidden="true">psychology</span>
						</div>
					</div>
					<p className="admin-stat-label">Knowledge Version</p>
					<p className="admin-stat-value">v1.2</p>
					<p className="admin-toggle-desc">diperbarui 1 jam lalu</p>
				</article>
			</section>

			<section className="admin-content-grid">
				<div className="admin-panel admin-reveal">
					<div className="admin-panel-header">
						<div>
							<h3 className="admin-panel-title">User Growth (7 hari)</h3>
							<p className="admin-toggle-desc">Pendaftaran pengguna baru</p>
						</div>
						<Link to="/admin/users" className="admin-panel-link">
							Lihat Users →
						</Link>
					</div>
					<div className="admin-chart-bars" role="img" aria-label="Bar chart user growth 7 hari">
						{WEEKLY_BAR_HEIGHTS.map((h, i) => (
							<div key={i} className="admin-chart-bar" style={{ height: `${h}%` }} title={`${h} users`} />
						))}
					</div>
					<div className="admin-chart-labels">
						{["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
							<span key={d}>{d}</span>
						))}
					</div>
				</div>

				<div className="admin-panel admin-reveal">
					<div className="admin-panel-header">
						<h3 className="admin-panel-title">Risk Distribution</h3>
						<Link to="/admin/users" className="admin-panel-link">
							Detail →
						</Link>
					</div>
					<div className="space-y-3" style={{ marginTop: 12 }}>
						<div>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
								<span className="admin-toggle-name">Tinggi</span>
								<span className="admin-toggle-name">{high}</span>
							</div>
							<div style={{ height: 8, background: "var(--outline-variant)", borderRadius: 9999, overflow: "hidden" }}>
								<div style={{ width: `${totalUsers ? (high / totalUsers) * 100 : 0}%`, height: "100%", background: "var(--error)" }} />
							</div>
						</div>
						<div>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
								<span className="admin-toggle-name">Sedang</span>
								<span className="admin-toggle-name">{medium}</span>
							</div>
							<div style={{ height: 8, background: "var(--outline-variant)", borderRadius: 9999, overflow: "hidden" }}>
								<div style={{ width: `${totalUsers ? (medium / totalUsers) * 100 : 0}%`, height: "100%", background: "var(--secondary)" }} />
							</div>
						</div>
						<div>
							<div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
								<span className="admin-toggle-name">Rendah</span>
								<span className="admin-toggle-name">{low}</span>
							</div>
							<div style={{ height: 8, background: "var(--outline-variant)", borderRadius: 9999, overflow: "hidden" }}>
								<div style={{ width: `${totalUsers ? (low / totalUsers) * 100 : 0}%`, height: "100%", background: "var(--tertiary)" }} />
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="admin-content-grid">
				<div className="admin-panel admin-reveal">
					<div className="admin-panel-header">
						<h3 className="admin-panel-title">Aktivitas Terbaru</h3>
						<button type="button" className="admin-panel-link">Lihat semua</button>
					</div>
					<div>
						{RECENT_ACTIVITY.map((a, i) => (
							<div key={i} className="admin-activity-item">
								<div className="admin-activity-icon">
									<span className="material-symbols-outlined" aria-hidden="true">{a.icon}</span>
								</div>
								<div className="admin-activity-content">
									<p className="admin-activity-title">{a.title}</p>
									<p className="admin-activity-time">{a.time}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="admin-panel admin-reveal">
					<div className="admin-panel-header">
						<h3 className="admin-panel-title">AI Usage Trend</h3>
						<span className="admin-toggle-desc">7 hari</span>
					</div>
					<div className="admin-usage-card-value" style={{ marginBottom: 8 }}>
						12,847
					</div>
					<p className="admin-toggle-desc">Total pesan AI diproses</p>
					<div className="admin-chart-bars" style={{ height: 80, marginTop: 12 }}>
						{[55, 70, 62, 80, 68, 90, 84].map((h, i) => (
							<div key={i} className="admin-chart-bar" style={{ height: `${h}%`, background: "var(--tertiary)" }} />
						))}
					</div>
				</div>
			</section>
		</div>
	)
}
