import { useGSAP } from "@gsap/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { ChatHistory } from "@web/components/companion/chat-history"
import { useCompanionMessages } from "@web/hooks/use-companion-messages"
import { useCreateSession } from "@web/hooks/use-create-session"
import { useSendMessage } from "@web/hooks/use-send-message"
import { useUIStore } from "@web/hooks/use-ui-store"

import { z } from "zod"
import "./companion.css"

const companionSearchSchema = z.object({
	session: z.string().optional(),
})

export const Route = createFileRoute("/_authenticated/companion")({
	component: Companion,
	validateSearch: companionSearchSchema,
})

const GREETING =
	"Halo. Saya StrokeCare AI Companion. Saya dapat membantu mendiskusikan gejala stroke, faktor risiko, dan perjalanan pemulihan Anda. Ceritakan apa yang ingin Anda tanyakan."

const SUGGESTED_PROMPTS = [
	{ icon: "favorite", text: "Tekanan darah" },
	{ icon: "restaurant", text: "Nutrisi" },
	{ icon: "directions_run", text: "Latihan" },
	{ icon: "warning", text: "Tanda stroke" },
	{ icon: "medication", text: "Obat" },
	{ icon: "bedtime", text: "Tidur" },
] as const

function Companion() {
	const { session: sessionId } = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })
	const { data: messages, error: messagesError } = useCompanionMessages(sessionId ?? null)
	const createSession = useCreateSession()
	const sendMessage = useSendMessage()
	const { isCompanionSidebarOpen: isSidebarOpen, setCompanionSidebarOpen: setIsSidebarOpen } = useUIStore()

	const [draft, setDraft] = useState("")
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const scrollRef = useRef<HTMLDivElement>(null)
	const busy = sendMessage.isPending || createSession.isPending
	const errorMessage = (sendMessage.error as Error | null)?.message ?? (messagesError as Error | null)?.message ?? null
	const bubbles = messages ?? []
	const isEmpty = bubbles.length === 0

	useGSAP(
		() => {
			gsap.from(".chat-bubble", {
				opacity: 0,
				y: 8,
				duration: 0.35,
				ease: "power2.out",
			})
		},
		{ dependencies: [bubbles.length] },
	)

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
		}
	}, [bubbles.length, busy])

	useEffect(() => {
		const ta = textareaRef.current
		if (!ta) return
		ta.style.height = "auto"
		ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`
	}, [draft])

	const handleSend = async (text: string) => {
		const trimmed = text.trim()
		if (!trimmed || busy) return
		setDraft("")
		if (textareaRef.current) textareaRef.current.style.height = "auto"
		let activeSession = sessionId
		if (!activeSession) {
			const created = await createSession.mutateAsync({})
			activeSession = created.id
			await navigate({ search: { session: activeSession } })
		}
		await sendMessage.mutateAsync({ sessionId: activeSession, content: trimmed })
	}

	const startNewSession = async () => {
		const created = await createSession.mutateAsync({ title: "New chat" })
		await navigate({ search: { session: created.id } })
	}

	const handleSubmit = (e?: React.FormEvent) => {
		e?.preventDefault()
		if (draft.trim() && !busy) {
			void handleSend(draft)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			handleSubmit()
		}
	}

	return (
		<div className="companion-layout">
			{isSidebarOpen && (
				<button
					type="button"
					aria-label="Tutup sidebar"
					className="companion-backdrop md:hidden"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			<aside
				className={`companion-sidebar ${isSidebarOpen ? "open" : ""}`}
				aria-label="Riwayat obrolan"
			>
				<div className="companion-sidebar-header">
					<button
						type="button"
						onClick={() => setIsSidebarOpen(false)}
						className="companion-sidebar-close md:hidden"
						aria-label="Tutup menu"
					>
						<span className="material-symbols-outlined" aria-hidden="true">close</span>
					</button>
				</div>
				<ChatHistory
					currentSessionId={sessionId ?? null}
					onSelectSession={(id) => {
						setIsSidebarOpen(false)
						navigate({ search: { session: id } })
					}}
					onNewSession={() => {
						setIsSidebarOpen(false)
						navigate({ search: { session: undefined } })
					}}
				/>
			</aside>

			<main className="companion-main">
				<header className="companion-header">
					<button
						type="button"
						onClick={() => setIsSidebarOpen(true)}
						className="companion-sidebar-toggle md:hidden"
						aria-label="Buka riwayat obrolan"
					>
						<span className="material-symbols-outlined" aria-hidden="true">menu</span>
					</button>
					<div className="companion-header-text">
						<h1 className="companion-title">StrokeCare AI</h1>
						<p className="companion-subtitle">Asisten pemulihan stroke Anda</p>
					</div>
				</header>

				{errorMessage && (
					<div role="alert" className="companion-error">
						<span className="material-symbols-outlined" aria-hidden="true">error</span>
						<span>{errorMessage}</span>
					</div>
				)}

				<div ref={scrollRef} className="companion-messages">
					{isEmpty ? (
						<div className="companion-empty">
							<div className="companion-empty-avatar" aria-hidden="true">
								<span className="material-symbols-outlined">smart_toy</span>
							</div>
							<h2 className="companion-empty-title">Mulai percakapan</h2>
							<p className="companion-empty-subtitle">{GREETING}</p>
						</div>
					) : (
						<div className="companion-bubbles">
							{bubbles.map((b) => (
								<div key={b.id} className={`chat-bubble ${b.role === "user" ? "is-user" : "is-ai"}`}>
									{b.role !== "user" && (
										<div className="companion-bubble-avatar" aria-hidden="true">
											<span className="material-symbols-outlined">smart_toy</span>
										</div>
									)}
									<div className="companion-bubble-body">
										<p className="companion-bubble-text">{b.content}</p>
									</div>
								</div>
							))}
							{busy && (
								<div className="chat-bubble is-ai">
									<div className="companion-bubble-avatar" aria-hidden="true">
										<span className="material-symbols-outlined">smart_toy</span>
									</div>
									<div className="companion-bubble-body">
										<div className="companion-typing" aria-live="polite" aria-label="Companion sedang menjawab">
											<span />
											<span />
											<span />
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				<div className="companion-composer-wrap">
					<div className="companion-suggestions" aria-label="Pertanyaan cepat">
						{SUGGESTED_PROMPTS.map((p) => (
							<button
								key={p.text}
								type="button"
								disabled={busy}
								onClick={() => void handleSend(p.text)}
								className="companion-chip"
								title={`Tanya tentang ${p.text}`}
							>
								<span className="material-symbols-outlined" aria-hidden="true">
									{p.icon}
								</span>
								<span>{p.text}</span>
							</button>
						))}
					</div>

					<form onSubmit={handleSubmit} className="companion-composer">
						<textarea
							ref={textareaRef}
							value={draft}
							onChange={(e) => setDraft(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Ketik pesan Anda..."
							aria-label="Ketik pesan Anda"
							className="composer-input"
							rows={1}
							disabled={busy}
						/>
						<button
							type="submit"
							disabled={busy || !draft.trim()}
							className="composer-send"
							aria-label="Kirim pesan"
						>
							<span className="material-symbols-outlined" aria-hidden="true">send</span>
						</button>
					</form>
				</div>
			</main>
		</div>
	)
}
