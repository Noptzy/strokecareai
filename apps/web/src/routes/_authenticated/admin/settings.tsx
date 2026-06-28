import { useGSAP } from "@gsap/react"
import { createFileRoute } from "@tanstack/react-router"
import gsap from "gsap"
import { useRef, useState } from "react"

export const Route = createFileRoute("/_authenticated/admin/settings")({
	component: AdminSettings,
})

type TabId = "general" | "ai" | "security" | "notifications"

const TABS: { id: TabId; label: string; icon: string }[] = [
	{ id: "general", label: "General", icon: "tune" },
	{ id: "ai", label: "AI", icon: "psychology" },
	{ id: "security", label: "Security", icon: "lock" },
	{ id: "notifications", label: "Notifications", icon: "notifications" },
]

type Toggle = { id: string; name: string; desc: string; on: boolean }

const AI_TOGGLES: Toggle[] = [
	{ id: "auto-title", name: "AI auto-title", desc: "Otomatis generate judul chat dari pesan pertama", on: true },
	{ id: "suggested", name: "Suggested prompts", desc: "Tampilkan prompt rekomendasi di chat", on: true },
	{ id: "typing", name: "Typing animation", desc: "Animasi titik-titik saat AI mengetik", on: true },
	{ id: "risk", name: "Risk prediction", desc: "Hitung estimasi risiko stroke dari profil", on: true },
]

const NOTIF_TOGGLES: Toggle[] = [
	{ id: "email", name: "Email alerts", desc: "Kirim notifikasi ke admin via email", on: true },
	{ id: "high-risk", name: "High risk alerts", desc: "Alert real-time untuk user risiko tinggi", on: true },
	{ id: "daily", name: "Daily reports", desc: "Laporan harian statistik penggunaan", on: false },
]

function AdminSettings() {
	const container = useRef<HTMLDivElement>(null)
	const [tab, setTab] = useState<TabId>("general")
	const [aiToggles, setAiToggles] = useState(AI_TOGGLES)
	const [notifToggles, setNotifToggles] = useState(NOTIF_TOGGLES)
	const [temperature, setTemperature] = useState(0.7)
	const [model, setModel] = useState("gpt-4")
	const [saved, setSaved] = useState(false)

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

	const toggleAi = (id: string) => {
		setAiToggles((prev) => prev.map((t) => (t.id === id ? { ...t, on: !t.on } : t)))
		setSaved(false)
	}
	const toggleNotif = (id: string) => {
		setNotifToggles((prev) => prev.map((t) => (t.id === id ? { ...t, on: !t.on } : t)))
		setSaved(false)
	}
	const handleSave = () => {
		setSaved(true)
		setTimeout(() => setSaved(false), 2500)
	}

	return (
		<div ref={container}>
			<div className="admin-tabs admin-reveal">
				{TABS.map((t) => (
					<button
						key={t.id}
						type="button"
						className={`admin-tab ${tab === t.id ? "active" : ""}`}
						onClick={() => setTab(t.id)}
					>
						<span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: "middle", marginRight: 4 }} aria-hidden="true">
							{t.icon}
						</span>
						{t.label}
					</button>
				))}
			</div>

			{tab === "general" && (
				<div className="admin-form-section admin-reveal">
					<h3 className="admin-form-section-title">General Settings</h3>
					<p className="admin-form-section-desc">Konfigurasi umum sistem</p>
					<div className="admin-form-row">
						<div className="admin-form-field">
							<label className="admin-form-label" htmlFor="hospital">Hospital name</label>
							<input id="hospital" className="admin-form-input" defaultValue="StrokeCare General Hospital" />
						</div>
						<div className="admin-form-field">
							<label className="admin-form-label" htmlFor="system">System name</label>
							<input id="system" className="admin-form-input" defaultValue="StrokeCare AI" />
						</div>
					</div>
					<div className="admin-form-row">
						<div className="admin-form-field">
							<label className="admin-form-label" htmlFor="tz">Timezone</label>
							<select id="tz" className="admin-form-select" defaultValue="asia-jakarta">
								<option value="asia-jakarta">Asia/Jakarta (UTC+7)</option>
								<option value="utc">UTC</option>
							</select>
						</div>
						<div className="admin-form-field">
							<label className="admin-form-label" htmlFor="lang">Language</label>
							<select id="lang" className="admin-form-select" defaultValue="id">
								<option value="id">Bahasa Indonesia</option>
								<option value="en">English</option>
							</select>
						</div>
					</div>
					<button type="button" className="admin-btn" onClick={handleSave}>
						<span className="material-symbols-outlined" aria-hidden="true">save</span>
						Simpan
					</button>
				</div>
			)}

			{tab === "ai" && (
				<>
					<div className="admin-form-section admin-reveal">
						<h3 className="admin-form-section-title">AI Model</h3>
						<p className="admin-form-section-desc">Pilih model AI yang digunakan untuk chat</p>
						<div className="admin-form-row">
							<div className="admin-form-field">
								<label className="admin-form-label" htmlFor="model">Model</label>
								<select id="model" className="admin-form-select" value={model} onChange={(e) => setModel(e.target.value)}>
									<option value="gpt-4">GPT-4</option>
									<option value="gpt-5">GPT-5</option>
									<option value="claude">Claude 3.5</option>
									<option value="gemini">Gemini 2.0</option>
								</select>
							</div>
							<div className="admin-form-field">
								<label className="admin-form-label" htmlFor="temp">
									Temperature: {temperature.toFixed(1)}
								</label>
								<input
									id="temp"
									type="range"
									min="0"
									max="1"
									step="0.1"
									value={temperature}
									onChange={(e) => setTemperature(Number(e.target.value))}
									className="admin-slider"
								/>
								<span className="admin-form-help">0 = deterministik, 1 = kreatif</span>
							</div>
						</div>
						<div className="admin-form-row">
							<div className="admin-form-field">
								<label className="admin-form-label" htmlFor="length">Response length</label>
								<select id="length" className="admin-form-select" defaultValue="medium">
									<option value="short">Short</option>
									<option value="medium">Medium</option>
									<option value="long">Long</option>
								</select>
							</div>
							<div className="admin-form-field">
								<label className="admin-form-label" htmlFor="sensitivity">Emergency sensitivity</label>
								<select id="sensitivity" className="admin-form-select" defaultValue="medium">
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
								</select>
							</div>
						</div>
					</div>

					<div className="admin-form-section admin-reveal">
						<h3 className="admin-form-section-title">Features</h3>
						<p className="admin-form-section-desc">Toggle fitur AI yang aktif</p>
						{aiToggles.map((t) => (
							<div key={t.id} className="admin-toggle-row">
								<div className="admin-toggle-label">
									<span className="admin-toggle-name">{t.name}</span>
									<span className="admin-toggle-desc">{t.desc}</span>
								</div>
								<button
									type="button"
									role="switch"
									aria-checked={t.on}
									className={`admin-toggle ${t.on ? "on" : ""}`}
									onClick={() => toggleAi(t.id)}
								>
									<span className="admin-toggle-knob" />
								</button>
							</div>
						))}
					</div>

					<div style={{ marginTop: 16 }}>
						<button type="button" className="admin-btn" onClick={handleSave}>
							<span className="material-symbols-outlined" aria-hidden="true">save</span>
							Simpan Pengaturan AI
						</button>
					</div>
				</>
			)}

			{tab === "security" && (
				<div className="admin-form-section admin-reveal">
					<h3 className="admin-form-section-title">Security & Access</h3>
					<p className="admin-form-section-desc">Kelola session, password, dan akses admin</p>
					<div className="admin-form-row">
						<div className="admin-form-field">
							<label className="admin-form-label" htmlFor="session-timeout">Session timeout (menit)</label>
							<input id="session-timeout" type="number" className="admin-form-input" defaultValue={60} />
						</div>
						<div className="admin-form-field">
							<label className="admin-form-label" htmlFor="password-policy">Password policy</label>
							<select id="password-policy" className="admin-form-select" defaultValue="strong">
								<option value="basic">Basic (8+ chars)</option>
								<option value="medium">Medium (10+ chars, mixed)</option>
								<option value="strong">Strong (12+ chars, special)</option>
							</select>
						</div>
					</div>
					<div className="admin-toggle-row">
						<div className="admin-toggle-label">
							<span className="admin-toggle-name">Two-Factor Authentication (2FA)</span>
							<span className="admin-toggle-desc">Wajibkan 2FA untuk semua admin</span>
						</div>
						<button type="button" role="switch" aria-checked="true" className="admin-toggle on">
							<span className="admin-toggle-knob" />
						</button>
					</div>
					<div className="admin-toggle-row">
						<div className="admin-toggle-label">
							<span className="admin-toggle-name">Admin access control</span>
							<span className="admin-toggle-desc">Hanya role admin yang bisa akses</span>
						</div>
						<button type="button" role="switch" aria-checked="true" className="admin-toggle on">
							<span className="admin-toggle-knob" />
						</button>
					</div>
					<button type="button" className="admin-btn" style={{ marginTop: 16 }} onClick={handleSave}>
						<span className="material-symbols-outlined" aria-hidden="true">save</span>
						Simpan
					</button>
				</div>
			)}

			{tab === "notifications" && (
				<div className="admin-form-section admin-reveal">
					<h3 className="admin-form-section-title">Notification Preferences</h3>
					<p className="admin-form-section-desc">Pilih notifikasi yang ingin diterima</p>
					{notifToggles.map((t) => (
						<div key={t.id} className="admin-toggle-row">
							<div className="admin-toggle-label">
								<span className="admin-toggle-name">{t.name}</span>
								<span className="admin-toggle-desc">{t.desc}</span>
							</div>
							<button
								type="button"
								role="switch"
								aria-checked={t.on}
								className={`admin-toggle ${t.on ? "on" : ""}`}
								onClick={() => toggleNotif(t.id)}
							>
								<span className="admin-toggle-knob" />
							</button>
						</div>
					))}
					<button type="button" className="admin-btn" style={{ marginTop: 16 }} onClick={handleSave}>
						<span className="material-symbols-outlined" aria-hidden="true">save</span>
						Simpan
					</button>
				</div>
			)}

			{saved && (
				<div className="admin-toast success" role="status">
					<span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
					Pengaturan berhasil disimpan
				</div>
			)}
		</div>
	)
}
