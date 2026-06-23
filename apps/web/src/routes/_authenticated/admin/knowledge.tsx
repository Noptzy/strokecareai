import { useGSAP } from "@gsap/react"
import { createFileRoute } from "@tanstack/react-router"
import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { useAdminSettings } from "@web/hooks/use-admin-settings"
import { useUpdateAdminSettings } from "@web/hooks/use-update-admin-settings"

export const Route = createFileRoute("/_authenticated/admin/knowledge")({
	component: AdminKnowledge,
})

type TabId = "general" | "medical" | "prompt-rules" | "emergency"

const TABS: { id: TabId; label: string }[] = [
	{ id: "general", label: "General" },
	{ id: "medical", label: "Medical" },
	{ id: "prompt-rules", label: "Prompt Rules" },
	{ id: "emergency", label: "Emergency Protocol" },
]

const SECTIONS_BY_TAB: Record<TabId, { id: string; title: string; icon: string }[]> = {
	general: [
		{ id: "context", title: "Context", icon: "info" },
		{ id: "stroke-symptoms", title: "Stroke Symptoms", icon: "monitor_heart" },
		{ id: "nutrition", title: "Nutrition", icon: "restaurant" },
		{ id: "rehabilitation", title: "Rehabilitation", icon: "self_improvement" },
		{ id: "emergency-flow", title: "Emergency Flow", icon: "emergency" },
	],
	medical: [
		{ id: "diagnostic-criteria", title: "Diagnostic Criteria", icon: "medical_services" },
		{ id: "medications", title: "Medications", icon: "medication" },
		{ id: "lab-values", title: "Lab Values", icon: "science" },
	],
	"prompt-rules": [
		{ id: "guardrails", title: "Guardrails", icon: "shield" },
		{ id: "style", title: "Communication Style", icon: "style" },
		{ id: "fallback", title: "Fallback Behavior", icon: "support" },
	],
	emergency: [
		{ id: "red-flags", title: "Red Flag Detection", icon: "flag" },
		{ id: "fast-check", title: "FAST Check Protocol", icon: "emergency" },
		{ id: "referral", title: "Referral Guidelines", icon: "local_hospital" },
	],
}

const VERSIONS = [
	{ version: "v1.2", time: "1 jam lalu", isCurrent: true },
	{ version: "v1.1", time: "3 hari lalu" },
	{ version: "v1.0", time: "2 minggu lalu" },
]

function AdminKnowledge() {
	const { data, isLoading, error } = useAdminSettings()
	const updateSettings = useUpdateAdminSettings()
	const container = useRef<HTMLDivElement>(null)
	const [tab, setTab] = useState<TabId>("general")
	const [activeSection, setActiveSection] = useState("context")
	const [content, setContent] = useState("")
	const [savedAt, setSavedAt] = useState<Date | null>(null)

	useEffect(() => {
		if (data?.knowledgeBase !== undefined) {
			setContent(data.knowledgeBase ?? "")
		}
	}, [data])

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

	const handleSave = () => {
		updateSettings.mutate(
			{ knowledgeBase: content },
			{
				onSuccess: () => setSavedAt(new Date()),
			},
		)
	}

	if (isLoading) {
		return <div className="admin-panel animate-pulse h-96" />
	}

	if (error) {
		return (
			<div role="alert" className="admin-panel text-center py-12">
				<p className="text-error">Gagal memuat: {(error as Error).message}</p>
			</div>
		)
	}

	const sections = SECTIONS_BY_TAB[tab]

	return (
		<div ref={container}>
			<div className="admin-tabs admin-reveal">
				{TABS.map((t) => (
					<button
						key={t.id}
						type="button"
						className={`admin-tab ${tab === t.id ? "active" : ""}`}
						onClick={() => {
							setTab(t.id)
							setActiveSection(SECTIONS_BY_TAB[t.id][0]?.id ?? "")
						}}
					>
						{t.label}
					</button>
				))}
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }} className="admin-knowledge-grid">
				<aside className="admin-panel admin-reveal" style={{ padding: 12 }}>
					<h3 className="admin-toggle-name" style={{ padding: "8px 12px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--on-surface-variant)" }}>
						Sections
					</h3>
					<nav>
						{sections.map((s) => (
							<button
								key={s.id}
								type="button"
								className={`admin-nav-item ${activeSection === s.id ? "active" : ""}`}
								onClick={() => setActiveSection(s.id)}
								style={{ fontSize: 13 }}
							>
								<span className="material-symbols-outlined" aria-hidden="true">{s.icon}</span>
								<span className="admin-nav-item-label">{s.title}</span>
							</button>
						))}
					</nav>
				</aside>

				<section className="admin-panel admin-reveal">
					<div className="admin-panel-header">
						<div>
							<h3 className="admin-panel-title">Knowledge Base Editor</h3>
							<p className="admin-toggle-desc">
								Edit konten yang akan di-inject ke AI prompt. Markdown supported.
							</p>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							{savedAt && (
								<span className="admin-toggle-desc" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
									<span className="material-symbols-outlined" style={{ fontSize: 14, color: "var(--tertiary)" }} aria-hidden="true">check_circle</span>
									Saved
								</span>
							)}
							<button type="button" className="admin-btn secondary" onClick={() => setContent("")}>
								Reset
							</button>
							<button
								type="button"
								className="admin-btn"
								onClick={handleSave}
								disabled={updateSettings.isPending}
							>
								<span className="material-symbols-outlined" aria-hidden="true">save</span>
								{updateSettings.isPending ? "Saving..." : "Save"}
							</button>
						</div>
					</div>
					<textarea
						className="admin-form-textarea"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder="Tulis knowledge base di sini. Markdown didukung."
						style={{ width: "100%", minHeight: 360 }}
					/>
					<p className="admin-form-help" style={{ marginTop: 8 }}>
						{content.length} karakter · {content.split("\n").length} baris
					</p>
				</section>
			</div>

			<section className="admin-panel admin-reveal" style={{ marginTop: 20 }}>
				<div className="admin-panel-header">
					<h3 className="admin-panel-title">Riwayat Versi</h3>
					<button type="button" className="admin-btn secondary">Compare</button>
				</div>
				<div className="admin-usage-grid" style={{ marginTop: 0 }}>
					{VERSIONS.map((v) => (
						<div key={v.version} className="admin-usage-card">
							<div className="admin-usage-card-header">
								<div>
									<h4 className="admin-usage-card-title">
										{v.version}
										{v.isCurrent && (
											<span style={{ marginLeft: 8, fontSize: 10, padding: "2px 6px", background: "var(--tertiary-container)", color: "var(--tertiary)", borderRadius: 9999 }}>
												CURRENT
											</span>
										)}
									</h4>
									<p className="admin-toggle-desc">{v.time}</p>
								</div>
								{v.isCurrent ? (
									<span className="admin-toggle-desc">Aktif</span>
								) : (
									<button type="button" className="admin-btn secondary" style={{ padding: "6px 12px" }}>
										Restore
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}
