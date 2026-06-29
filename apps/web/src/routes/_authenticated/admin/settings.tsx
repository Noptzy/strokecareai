import { useGSAP } from "@gsap/react"
import { createFileRoute } from "@tanstack/react-router"
import gsap from "gsap"
import { useRef, useState } from "react"

import { KnowledgeTab } from "@web/components/admin/knowledge-tab"

export const Route = createFileRoute("/_authenticated/admin/settings")({
	component: AdminSettings,
})

type TabId = "general" | "ai" | "security" | "knowledge"

const TABS: { id: TabId; label: string; icon: string }[] = [
	{ id: "general", label: "General", icon: "tune" },
	{ id: "ai", label: "AI", icon: "psychology" },
	{ id: "security", label: "Security", icon: "lock" },
	{ id: "knowledge", label: "Knowledge", icon: "menu_book" },
]

type Toggle = { id: string; name: string; desc: string; on: boolean }

const AI_TOGGLES: Toggle[] = [
	{ id: "auto-title", name: "AI auto-title", desc: "Otomatis generate judul chat dari pesan pertama", on: true },
	{ id: "risk", name: "Risk prediction", desc: "Hitung estimasi risiko stroke dari profil", on: true },
]



function AdminSettings() {
	const container = useRef<HTMLDivElement>(null)
	const [tab, setTab] = useState<TabId>("general")
	const [aiToggles, setAiToggles] = useState(AI_TOGGLES)
	const [temperature, setTemperature] = useState(0.7)
	const [model, setModel] = useState("openrouter/google/gemini-2.5-flash")
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
						<h3 className="admin-form-section-title">OpenRouter AI Configuration</h3>
						<p className="admin-form-section-desc">Pilih model dari OpenRouter yang digunakan untuk chat</p>
						<div className="admin-form-row">
							<div className="admin-form-field">
								<label className="admin-form-label" htmlFor="model">Model ID</label>
								<input 
									id="model" 
									className="admin-form-input" 
									value={model} 
									onChange={(e) => setModel(e.target.value)}
									placeholder="e.g., google/gemini-2.5-flash" 
								/>
								<span className="admin-form-help">Gunakan format ID dari OpenRouter</span>
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

			{tab === "knowledge" && (
				<KnowledgeTab />
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
