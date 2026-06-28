import { useGSAP } from "@gsap/react"
import { createFileRoute } from "@tanstack/react-router"
import { useAdminDashboard } from "@web/hooks/use-admin-dashboard"
import { useCreateAdminUser, useDeleteAdminUser, useUpdateAdminUser } from "@web/hooks/use-admin-user-actions"
import type { AdminUsersRiskFilter, AdminUsersSortOrder } from "@web/hooks/use-admin-users-ui-store"
import { useAdminUsersUIStore } from "@web/hooks/use-admin-users-ui-store"
import gsap from "gsap"
import { useRef } from "react"

export const Route = createFileRoute("/_authenticated/admin/users")({
	component: AdminUsers,
})

const RISK_FILTERS: { id: AdminUsersRiskFilter; label: string }[] = [
	{ id: "all", label: "Semua" },
	{ id: "high", label: "Risiko tinggi" },
	{ id: "medium", label: "Risiko sedang" },
	{ id: "low", label: "Risiko rendah" },
]

type AdminUserRow = NonNullable<ReturnType<typeof useAdminDashboard>["data"]>["users"][number]

function getInitials(name: string): string {
	return name
		.split(" ")
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("")
}

function formatDate(date: Date | string): string {
	const parsedDate = new Date(date)
	return parsedDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

function getFilteredUsers(
	users: AdminUserRow[],
	search: string,
	filter: AdminUsersRiskFilter,
	sort: AdminUsersSortOrder,
): AdminUserRow[] {
	const normalizedSearch = search.trim().toLowerCase()
	return users
		.filter((user) => filter === "all" || user.riskTier === filter)
		.filter((user) => {
			if (!normalizedSearch) return true
			return user.name.toLowerCase().includes(normalizedSearch) || user.email.toLowerCase().includes(normalizedSearch)
		})
		.sort((leftUser, rightUser) => {
			const leftTime = new Date(leftUser.createdAt).getTime()
			const rightTime = new Date(rightUser.createdAt).getTime()
			return sort === "newest" ? rightTime - leftTime : leftTime - rightTime
		})
}

function getFormValue(formData: FormData, key: string): string {
	return String(formData.get(key) ?? "").trim()
}

function AdminUsers() {
	const dashboardQuery = useAdminDashboard()
	const createUserMutation = useCreateAdminUser()
	const updateUserMutation = useUpdateAdminUser()
	const deleteUserMutation = useDeleteAdminUser()
	const container = useRef<HTMLDivElement>(null)
	const {
		search,
		filter,
		sort,
		formMode,
		editingUser,
		setSearch,
		setFilter,
		setSort,
		openCreateForm,
		openEditForm,
		closeForm,
	} = useAdminUsersUIStore()

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

	if (dashboardQuery.isLoading) {
		return (
			<div className="space-y-4">
				<div className="admin-toolbar">
					<div className="admin-search animate-pulse h-10" />
				</div>
				<div className="admin-table-wrap animate-pulse h-96" />
			</div>
		)
	}

	if (dashboardQuery.isError) {
		return (
			<div role="alert" className="admin-panel text-center py-12">
				<p className="text-error">Gagal memuat data: {(dashboardQuery.error as Error).message}</p>
			</div>
		)
	}

	const dashboardData = dashboardQuery.data
	if (!dashboardData) {
		return (
			<div role="alert" className="admin-panel text-center py-12">
				<p className="text-error">Data admin belum tersedia.</p>
			</div>
		)
	}

	const filteredUsers = getFilteredUsers(dashboardData.users, search, filter, sort)
	const isMutating = createUserMutation.isPending || updateUserMutation.isPending

	const submitUserForm = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const name = getFormValue(formData, "name")
		const email = getFormValue(formData, "email")
		const role = getFormValue(formData, "role") as "admin" | "user"
		const banned = formData.get("banned") === "on"

		if (formMode === "edit" && editingUser) {
			updateUserMutation.mutate({ id: editingUser.id, name, email, role, banned }, { onSuccess: closeForm })
			return
		}

		const password = getFormValue(formData, "password")
		createUserMutation.mutate({ name, email, password, role, banned }, { onSuccess: closeForm })
	}

	const deleteUser = (user: AdminUserRow) => {
		if (!window.confirm(`Hapus akun ${user.name}?`)) return
		deleteUserMutation.mutate({ id: user.id })
	}

	return (
		<div ref={container} className="space-y-4">
			<div className="admin-toolbar admin-reveal">
				<div className="admin-search">
					<span className="material-symbols-outlined" aria-hidden="true">
						search
					</span>
					<input
						type="text"
						placeholder="Cari nama atau email..."
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						aria-label="Cari user"
					/>
				</div>
				<div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
					{RISK_FILTERS.map((riskFilter) => (
						<button
							key={riskFilter.id}
							type="button"
							className={`admin-filter-pill ${filter === riskFilter.id ? "active" : ""}`}
							onClick={() => setFilter(riskFilter.id)}
						>
							{riskFilter.label}
						</button>
					))}
				</div>
				<select
					className="admin-select"
					value={sort}
					onChange={(event) => setSort(event.target.value as AdminUsersSortOrder)}
					aria-label="Urutkan"
				>
					<option value="newest">Terbaru</option>
					<option value="oldest">Terlama</option>
				</select>
				<button type="button" className="admin-filter-pill active" onClick={openCreateForm}>
					Tambah User
				</button>
			</div>

			<div className="admin-table-wrap admin-reveal">
				{filteredUsers.length === 0 ? (
					<div className="py-16 text-center">
						<div className="admin-activity-icon" style={{ margin: "0 auto 12px" }}>
							<span className="material-symbols-outlined" aria-hidden="true">
								person_off
							</span>
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
								<th scope="col">Role</th>
								<th scope="col">Risiko</th>
								<th scope="col">Faktor Risiko</th>
								<th scope="col">Dibuat</th>
								<th scope="col">Status</th>
								<th scope="col" style={{ textAlign: "right" }}>
									Aksi
								</th>
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
										<span className="admin-toggle-desc">{user.role}</span>
									</td>
									<td>
										<span className={`admin-risk-badge ${user.riskTier}`}>{user.riskTier}</span>
									</td>
									<td style={{ maxWidth: 220 }}>
										<div style={{ fontSize: 11, color: "var(--on-surface-variant)" }}>
											{user.riskFactors.length > 0 ? user.riskFactors.join(", ") : "-"}
										</div>
									</td>
									<td>
										<span className="admin-toggle-desc">{formatDate(user.createdAt)}</span>
									</td>
									<td>
										<span className="admin-toggle-desc">
											<span className={`admin-status-dot ${user.banned ? "" : "active"}`} />
											{user.banned ? "Diblokir" : "Aktif"}
										</span>
									</td>
									<td>
										<div className="admin-row-actions">
											<button
												type="button"
												className="admin-icon-btn"
												aria-label="Edit user"
												title="Edit"
												onClick={() => openEditForm(user)}
											>
												<span className="material-symbols-outlined" aria-hidden="true">
													edit
												</span>
											</button>
											<button
												type="button"
												className="admin-icon-btn danger"
												aria-label="Hapus user"
												title="Delete"
												disabled={deleteUserMutation.isPending}
												onClick={() => deleteUser(user)}
											>
												<span className="material-symbols-outlined" aria-hidden="true">
													delete
												</span>
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
				Menampilkan {filteredUsers.length} dari {dashboardData.users.length} user
			</div>

			{formMode !== "closed" && (
				<div
					role="dialog"
					aria-modal="true"
					className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4"
				>
					<form
						key={editingUser?.id ?? "create"}
						className="admin-panel w-full max-w-lg space-y-4"
						onSubmit={submitUserForm}
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="admin-section-title">{formMode === "edit" ? "Edit User" : "Tambah User"}</h2>
								<p className="admin-toggle-desc">Kelola akun yang bisa memakai StrokeCare AI.</p>
							</div>
							<button type="button" className="admin-icon-btn" onClick={closeForm} aria-label="Tutup form">
								<span className="material-symbols-outlined" aria-hidden="true">
									close
								</span>
							</button>
						</div>
						<label className="space-y-2 block">
							<span className="font-label-caps text-label-caps text-on-surface-variant">Nama</span>
							<input
								name="name"
								required
								minLength={2}
								defaultValue={editingUser?.name ?? ""}
								className="admin-search w-full"
							/>
						</label>
						<label className="space-y-2 block">
							<span className="font-label-caps text-label-caps text-on-surface-variant">Email</span>
							<input
								name="email"
								required
								type="email"
								defaultValue={editingUser?.email ?? ""}
								className="admin-search w-full"
							/>
						</label>
						{formMode === "create" && (
							<label className="space-y-2 block">
								<span className="font-label-caps text-label-caps text-on-surface-variant">Password</span>
								<input name="password" required minLength={8} type="password" className="admin-search w-full" />
							</label>
						)}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<label className="space-y-2 block">
								<span className="font-label-caps text-label-caps text-on-surface-variant">Role</span>
								<select name="role" className="admin-select w-full" defaultValue={editingUser?.role ?? "user"}>
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</select>
							</label>
							<label className="flex items-center gap-3 pt-7">
								<input name="banned" type="checkbox" defaultChecked={editingUser?.banned ?? false} />
								<span className="admin-toggle-name">Blokir akun</span>
							</label>
						</div>
						{(createUserMutation.isError || updateUserMutation.isError) && (
							<div role="alert" className="bg-error-container/20 text-error rounded-lg p-3 text-sm">
								{String((createUserMutation.error ?? updateUserMutation.error) as Error)}
							</div>
						)}
						<div className="flex justify-end gap-3">
							<button type="button" className="admin-filter-pill" onClick={closeForm}>
								Batal
							</button>
							<button type="submit" className="admin-filter-pill active" disabled={isMutating}>
								{isMutating ? "Menyimpan..." : "Simpan"}
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	)
}
