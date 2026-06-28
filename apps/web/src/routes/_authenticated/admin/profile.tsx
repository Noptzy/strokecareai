import { createFileRoute, useRouteContext } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/profile")({
	component: AdminProfile,
})

function AdminProfile() {
	const { session } = useRouteContext({ from: "/_authenticated" })
	const user = session?.user

	return (
		<div className="admin-form-section" style={{ maxWidth: 720 }}>
			<h3 className="admin-form-section-title">Admin Profile</h3>
			<p className="admin-form-section-desc">Informasi akun administrator</p>
			<div className="admin-form-row">
				<div className="admin-form-field">
					<label className="admin-form-label" htmlFor="name">Nama</label>
					<input id="name" className="admin-form-input" defaultValue={user?.name ?? ""} readOnly />
				</div>
				<div className="admin-form-field">
					<label className="admin-form-label" htmlFor="email">Email</label>
					<input id="email" className="admin-form-input" defaultValue={user?.email ?? ""} readOnly />
				</div>
			</div>
			<div className="admin-form-row">
				<div className="admin-form-field">
					<label className="admin-form-label" htmlFor="role">Role</label>
					<input id="role" className="admin-form-input" defaultValue={user?.role ?? "admin"} readOnly />
				</div>
				<div className="admin-form-field">
					<label className="admin-form-label">Session ID</label>
					<input className="admin-form-input" defaultValue={session?.session.id ?? ""} readOnly />
				</div>
			</div>
			<p className="admin-form-help">Profil admin tidak dapat diubah dari konsol ini.</p>
		</div>
	)
}
