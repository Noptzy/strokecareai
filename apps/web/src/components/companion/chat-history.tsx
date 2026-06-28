import { useEffect, useRef, useState } from "react"
import { useCompanionSessions } from "@web/hooks/use-companion-sessions"
import { useDeleteSession, useUpdateSessionTitle } from "@web/hooks/use-companion-session-actions"

interface ChatHistoryProps {
	currentSessionId: string | null
	onSelectSession: (sessionId: string) => void
	onNewSession: () => void
}

type SessionItem = {
	id: string
	title: string
	createdAt: string | Date
}

type Group = {
	label: string
	items: SessionItem[]
}

function startOfDay(date: Date): number {
	const d = new Date(date)
	d.setHours(0, 0, 0, 0)
	return d.getTime()
}

function buildGroups(sessions: SessionItem[]): Group[] {
	const now = new Date()
	const todayStart = startOfDay(now)
	const yesterdayStart = todayStart - 24 * 60 * 60 * 1000
	const sevenDaysStart = todayStart - 7 * 24 * 60 * 60 * 1000
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

	const today: SessionItem[] = []
	const yesterday: SessionItem[] = []
	const last7: SessionItem[] = []
	const thisMonth: SessionItem[] = []
	const older: SessionItem[] = []

	for (const s of sessions) {
		const d = new Date(s.createdAt)
		const t = startOfDay(d)
		if (t === todayStart) today.push(s)
		else if (t === yesterdayStart) yesterday.push(s)
		else if (t > sevenDaysStart) last7.push(s)
		else if (t >= monthStart) thisMonth.push(s)
		else older.push(s)
	}

	const result: Group[] = []
	if (today.length) result.push({ label: "Hari ini", items: today })
	if (yesterday.length) result.push({ label: "Kemarin", items: yesterday })
	if (last7.length) result.push({ label: "7 hari terakhir", items: last7 })
	if (thisMonth.length) result.push({ label: "Bulan ini", items: thisMonth })
	if (older.length) result.push({ label: "Lebih lama", items: older })
	return result
}

function formatDateTime(date: Date): string {
	const day = String(date.getDate()).padStart(2, "0")
	const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
	const month = months[date.getMonth()] ?? "Jan"
	const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
	return `${day} ${month} • ${time}`
}

interface SessionRowProps {
	session: SessionItem
	isActive: boolean
	onSelect: () => void
	onRename: (newTitle: string) => void
	onDelete: () => void
}

function SessionRow({ session, isActive, onSelect, onRename, onDelete }: SessionRowProps) {
	const [menuOpen, setMenuOpen] = useState(false)
	const [renaming, setRenaming] = useState(false)
	const [draft, setDraft] = useState(session.title)
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!menuOpen) return
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMenuOpen(false)
			}
		}
		document.addEventListener("mousedown", handler)
		return () => document.removeEventListener("mousedown", handler)
	}, [menuOpen])

	const handleRenameSubmit = () => {
		const trimmed = draft.trim()
		if (trimmed && trimmed !== session.title) {
			onRename(trimmed)
		}
		setRenaming(false)
	}

	const dateText = formatDateTime(new Date(session.createdAt))

	return (
		<div className={`chat-history-item ${isActive ? "active" : ""}`}>
			<button type="button" onClick={onSelect} className="chat-history-row" title={session.title}>
				<span className="chat-history-icon" aria-hidden="true">
					<span className="material-symbols-outlined">chat_bubble</span>
				</span>
				<span className="chat-history-content">
					{renaming ? (
						<input
							autoFocus
							type="text"
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							onClick={(e) => e.stopPropagation()}
							onBlur={handleRenameSubmit}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault()
									handleRenameSubmit()
								} else if (e.key === "Escape") {
									setDraft(session.title)
									setRenaming(false)
								}
							}}
							className="chat-history-rename-input"
						/>
					) : (
						<span className="chat-history-title">{session.title}</span>
					)}
					<span className="chat-history-time">{dateText}</span>
				</span>
			</button>
			<button
				type="button"
				className="chat-history-ellipsis"
				onClick={(e) => {
					e.stopPropagation()
					setMenuOpen((v) => !v)
				}}
				aria-label="Menu percakapan"
				aria-haspopup="true"
				aria-expanded={menuOpen}
			>
				<span className="material-symbols-outlined">more_horiz</span>
			</button>
			{menuOpen && (
				<div ref={menuRef} className="chat-history-menu" role="menu">
					<button
						type="button"
						role="menuitem"
						className="chat-history-menu-item"
						onClick={(e) => {
							e.stopPropagation()
							setMenuOpen(false)
							setRenaming(true)
						}}
					>
						<span className="material-symbols-outlined">edit</span>
						Rename
					</button>
					<button
						type="button"
						role="menuitem"
						className="chat-history-menu-item danger"
						onClick={(e) => {
							e.stopPropagation()
							setMenuOpen(false)
							onDelete()
						}}
					>
						<span className="material-symbols-outlined">delete</span>
						Delete
					</button>
				</div>
			)}
		</div>
	)
}

export function ChatHistory({ currentSessionId, onSelectSession, onNewSession }: ChatHistoryProps) {
	const { data: sessions, isLoading, error } = useCompanionSessions()
	const updateTitle = useUpdateSessionTitle()
	const deleteSession = useDeleteSession()

	const groups = sessions ? buildGroups(sessions as SessionItem[]) : []

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="p-3">
				<button
					type="button"
					onClick={onNewSession}
					className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
				>
					<span className="material-symbols-outlined text-[18px]" aria-hidden="true">add</span>
					Sesi Baru
				</button>
			</div>

			<div className="flex-1 overflow-y-auto px-2 pb-3">
				{isLoading ? (
					<div className="flex flex-col gap-1.5 px-2">
						{[0, 1, 2, 3].map((i) => (
							<div key={i} className="h-12 bg-surface-container-highest rounded-lg animate-pulse" />
						))}
					</div>
				) : error ? (
					<div className="p-3 text-xs text-error">Gagal memuat riwayat</div>
				) : groups.length === 0 ? (
					<div className="chat-history-empty">
						<div className="chat-history-empty-icon" aria-hidden="true">
							<span className="material-symbols-outlined">forum</span>
						</div>
						<p className="chat-history-empty-title">Belum ada percakapan</p>
						<p className="chat-history-empty-subtitle">Mulai percakapan baru dengan StrokeCare AI</p>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{groups.map((group) => (
							<div key={group.label}>
								<h2 className="chat-history-group-label">{group.label}</h2>
								<ul className="flex flex-col gap-0.5">
									{group.items.map((session) => (
										<li key={session.id}>
											<SessionRow
												session={session}
												isActive={session.id === currentSessionId}
												onSelect={() => onSelectSession(session.id)}
												onRename={(newTitle) =>
													updateTitle.mutate({ sessionId: session.id, title: newTitle })
												}
												onDelete={() => {
													if (confirm("Hapus percakapan ini?")) {
														deleteSession.mutate({ sessionId: session.id })
													}
												}}
											/>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
