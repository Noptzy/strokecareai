import { useGSAP } from "@gsap/react"
import { createFileRoute } from "@tanstack/react-router"
import gsap from "gsap"
import { useMemo, useRef, useState } from "react"
import { useAdminDashboard } from "@web/hooks/use-admin-dashboard"

export const Route = createFileRoute("/_authenticated/admin/users")({
	component: AdminUsers,
})

type RiskFilter = "all" | "high" | "medium" | "low"
type SortOrder = "newest" | "oldest"

const RISK_FILTERS: { id: RiskFilter; label: string }[] = [
	{ id: "all", label: "Semua" },
	{ id: "high", label: "Risiko tinggi" },
	{ id: "medium", label: "Risiko sedang" },
	{ id: "low", label: "Risiko rendah" },
]

function getInitials(name: string): string {
	return name
		.split(" ")
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase() ?? "")
		.join("")
}

function formatDate(date: Date | string): string {
	const d = new Date(date)
	const now = Date.now()
	const diff = now - d.getTime()
	const hours = Math.floor(diff / 3600000)
	if (hours < 1) return "Baru saja"
	if (hours < 24) return `${hours} jam lalu`
	const days = Math.floor(hours / 24)
	if (days < 7) return `${days} hari lalu`
	return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
}

function AdminUsers() {
	const { data, isLoading, error } = useAdminDashboard()
	const container = useRef<HTMLDivElement>(null)
	const [search, setSearch] = useState("")
	const [filter, setFilter] = useState<RiskFilter>("all")
	const [sort, setSort] = useState<SortOrder>("newest")

	useGSAP(
		() => {
			gsap.from(".admin-reveal", {
				opacity: 0,
				y: 8,
				duration: 0.4,
				stagger: 0.04,
				ease: "power2.out",
			})
		},
		{ scope: container },
	)

	const filteredUsers = useMemo(() => {
		if (!data?.users) return []
		let users = [...data.users]
		if (filter !== "all") {
			users = users.filter((u) => u.riskTier === filter)
		}
		if (search.trim()) {
			const q = search.toLowerCase()
			users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
		}
		users.sort((a, b) => {
			const ta = new Date(a.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)).getTime()
			const tb = new Date(b.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)).getTime()
			return sort === "newest" ? tb - ta : ta - tb
		})
		return users
	}, [data, filter, search, sort])

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="admin-toolbar">
					<div className="admin-search animate-pulse h-10" />
				</div>
				<div className="admin-table-wrap animate-pulse h-96" />
			</div>
		)
	}

	if (error) {
		return (
			<div role="alert" className="admin-panel text-center py-12">
				<p className="text-error">Gagal memuat data: {(error as Error).message}</p>
			</div>
		)
	}

	return (
		<div ref={container} className="space-y-4">
			<div className="admin-toolbar admin-reveal">
				<div className="admin-search">
					<span className="material-symbols-outlined" aria-hidden="true">search</span>
					<input
						type="text"
						placeholder="Cari nama atau email..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						aria-label="Cari user"
					/>
				</div>
				<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
					{RISK_FILTERS.map((f) => (
						<button
							key={f.id}
							type="button"
							className={`admin-filter-pill ${filter === f.id ? "active" : ""}`}
							onClick={() => setFilter(f.id)}
						>
							{f.label}
						</button>
					))}
				</div>
				<select className="admin-select" value={sort} onChange={(e) => setSort(e.target.value as SortOrder)} aria-label="Urutkan">
					<option value="newest">Terbaru</option>
					<option value="oldest">Terlama</option>
				</select>
			</div>

			<div className="admin-table-wrap admin-reveal">
				{filteredUsers.length === 0 ? (
					<div className="py-16 text-center">
						<div className="admin-activity-icon" style={{ margin: "0 auto 12px" }}>
							<span className="material-symbols-outlined" aria-hidden="true">person_off</span>
						</div>
						<p className="admin-toggle-name">Tidak ada user ditemukan</p>
						<p className="admin-toggle-desc">Coba ubah filter atau kata kunci pencarian</p>
					</div>
				) : (
					<table className="admin-table">
						<caption className="sr-only">Daftar pengguna dengan tingkat risiko stroke</caption>
						<thead>
							<tr>
								<th scope="col">User</th>
								<th scope="col">Risiko</th>
								<th scope="col">Faktor Risiko</th>
								<th scope="col">Chat terakhir</th>
								<th scope="col">Status</th>
								<th scope="col" style={{ textAlign: "right" }}>Aksi</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user) => (
								<tr key={user.id}>
									<td>
										<div className="admin-user-cell">
											<div className="admin-user-avatar">{getInitials(user.name)}</div>
											<div>
												<div className="admin-user-name">{user.name}</div>
												<div className="admin-user-email">{user.email}</div>
											</div>
										</div>
									</td>
									<td>
										<span className={`admin-risk-badge ${user.riskTier}`}>{user.riskTier}</span>
									</td>
									<td style={{ maxWidth: 220 }}>
										<div style={{ fontSize: 11, color: "var(--on-surface-variant)" }}>
											{user.riskFactors.length > 0 ? user.riskFactors.join(", ") : "—"}
										</div>
									</td>
									<td>
										<span className="admin-toggle-desc">{formatDate(new Date())}</span>
									</td>
									<td>
										<span className="admin-toggle-desc">
											<span className="admin-status-dot active" />
											Aktif
										</span>
									</td>
									<td>
										<div className="admin-row-actions">
											<button type="button" className="admin-icon-btn" aria-label="Lihat detail" title="View">
												<span className="material-symbols-outlined" aria-hidden="true">visibility</span>
											</button>
											<button type="button" className="admin-icon-btn" aria-label="Edit user" title="Edit">
												<span className="material-symbols-outlined" aria-hidden="true">edit</span>
											</button>
											<button type="button" className="admin-icon-btn danger" aria-label="Hapus user" title="Delete">
												<span className="material-symbols-outlined" aria-hidden="true">delete</span>
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			<div className="admin-toggle-desc" style={{ textAlign: "center", marginTop: 12 }}>
				Menampilkan {filteredUsers.length} dari {data?.users.length ?? 0} user
			</div>
		</div>
	)
}
