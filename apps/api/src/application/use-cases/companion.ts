import type { AuthedContext } from "@api/application/shared/context"
import { badRequest } from "@api/application/shared/errors"
import type { CompanionRepository } from "@api/domain/companion/companion-repository"
import type { Cache } from "@api/domain/ports/cache"
import type { OpenRouterService } from "@api/domain/ports/openrouter-service"
import type { Profile } from "@api/domain/profile/profile"
import type { ProfileRepository } from "@api/domain/profile/profile-repository"
import { assessRisk } from "@api/domain/risk/risk"
import type { RiskAssessment } from "@api/domain/risk/risk"
import { z } from "zod"

const HISTORY_TURNS = 20
const HISTORY_FETCH = 100
const MESSAGE_PAGE_SIZE = 200

const RED_FLAGS = [
	"wajah turun",
	"muka mencong",
	"wajah mencong",
	"tangan lemah",
	"tangan lemas",
	"kaki lemas",
	"kaki lemah",
	"lumpuh",
	"bicara pelo",
	"susah bicara",
	"ngomong pelo",
	"pingsan",
	"tidak sadar",
	"hilang kesadaran",
	"sakit kepala hebat",
	"sakit kepala berat",
	"sakit kepala sangat berat",
	"mata buram mendadak",
	"buta mendadak",
]

const FALLBACK_MESSAGE =
	"Maaf, aku sedang mengalami gangguan teknis. Jika ini darurat atau kamu merasakan gejala stroke (wajah turun, tangan/kaki lemah, bicara pelo), segera hubungi layanan darurat (119) atau ke IGD terdekat."
const RED_FLAG_MESSAGE =
	"Gejala yang kamu sampaikan termasuk tanda yang perlu penanganan medis segera. Segera hubungi layanan darurat (119) atau pergi ke rumah sakit terdekat."

const TITLE_GENERATION_PROMPT = `Kamu adalah asisten yang membuat judul percakapan ringkas dalam Bahasa Indonesia.
Tugas: Buat judul 3-6 kata yang merangkum topik utama pesan user.
Aturan:
- Maksimal 6 kata
- Bahasa Indonesia natural
- Langsung to the point, tanpa kata "Percakapan" atau "Chat"
- Fokus pada subjek/inti masalah
- Hanya output judulnya saja, tanpa kutip atau penjelasan

Contoh:
User: "Saya sering pusing dan tekanan darah tinggi"
Judul: Tekanan darah tinggi dan pusing

User: "Makanan apa yang baik setelah stroke?"
Judul: Makanan pasca stroke

User: "Latihan ringan untuk tangan setelah stroke"
Judul: Latihan tangan pasca stroke`

const RISK_LEVEL_LABEL: Record<"low" | "medium" | "high", string> = {
	low: "rendah",
	medium: "sedang",
	high: "tinggi",
}

const buildSystemPrompt = (profile: Profile | null, risk: RiskAssessment | null, kb?: string | null) =>
	`
# IDENTITAS
Kamu adalah StrokeCare AI, assistant kesehatan untuk skrining awal stroke dan edukasi. Kamu BUKAN dokter.
Gunakan Bahasa Indonesia yang natural, hangat, kalimat pendek, dan tanyakan SATU hal per pesan. Jangan menakut-nakuti.

# PROFIL PASIEN
Umur: ${profile?.age ?? "-"}
Jenis Kelamin: ${profile?.gender ?? "-"}
Faktor Risiko: ${profile?.riskFactors?.join(", ") || "Tidak ada"}
Pola Makan: ${profile?.dailyFoodPattern ?? "-"}
Olahraga: ${profile?.exercisePattern ?? "-"}
Merokok: ${profile?.smokingStatus ?? "-"}
Riwayat Penyakit: ${profile?.priorIllnesses ?? "-"}
Riwayat Keluarga: ${profile?.familyMedicalHistory ?? "-"}
Catatan: ${profile?.notes ?? "-"}

# HASIL SISTEM PAKAR
${
	risk
		? `Estimasi Risiko: ~${risk.score}% (${RISK_LEVEL_LABEL[risk.level]})
Faktor Utama: ${risk.contributors.slice(0, 3).map((c) => c.label).join(", ") || "tidak ada"}
Instruksi: Sebutkan estimasi risiko ~${risk.score}% ini saat relevan, jelaskan faktor utamanya, tanya SATU hal lanjutan, dan beri satu tips edukasi. Jangan menakut-nakuti.`
		: "Profil risiko belum tersedia; fokus pada edukasi umum."
}

# GUARDRAILS
- DILARANG memberikan diagnosis medis final atau resep obat.
- JIKA pengguna menyebut gejala darurat (FAST), hentikan pertanyaan dan suruh ke IGD.
- JIKA ditanya apakah kamu dokter, jawab bahwa kamu AI assistant skrining awal.

${kb ? `# SUMBER INFORMASI / KNOWLEDGE BASE\n${kb}` : ""}
`.trim()

export const createSessionInput = z.object({
	title: z.string().min(1).max(120).optional(),
})

export const sendMessageInput = z.object({
	sessionId: z.string().min(1),
	content: z.string().min(1).max(4000),
})

export const listMessagesInput = z.object({
	sessionId: z.string().min(1),
})

export const updateSessionTitleInput = z.object({
	sessionId: z.string().min(1),
	title: z.string().min(1).max(120),
})

export const deleteSessionInput = z.object({
	sessionId: z.string().min(1),
})

export type CreateSessionInput = z.infer<typeof createSessionInput>
export type SendMessageInput = z.infer<typeof sendMessageInput>
export type ListMessagesInput = z.infer<typeof listMessagesInput>
export type UpdateSessionTitleInput = z.infer<typeof updateSessionTitleInput>
export type DeleteSessionInput = z.infer<typeof deleteSessionInput>

function buildFallbackTitle(date: Date): string {
	const day = String(date.getDate()).padStart(2, "0")
	const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
	const month = months[date.getMonth()] ?? "Jan"
	const hours = String(date.getHours()).padStart(2, "0")
	const minutes = String(date.getMinutes()).padStart(2, "0")
	return `Percakapan ${day} ${month}, ${hours}:${minutes}`
}

function sanitizeTitle(raw: string): string | null {
	const cleaned = raw
		.replace(/^["'`]+|["'`]+$/g, "")
		.replace(/^(judul|title|percakapan|chat)\s*[:：-]\s*/i, "")
		.replace(/^["'`]+|["'`]+$/g, "")
		.replace(/\s+/g, " ")
		.trim()
	if (!cleaned) return null
	const banned = ["new chat", "percakapan baru", "chat baru", "percakapan", "obrolan baru"]
	if (banned.includes(cleaned.toLowerCase())) return null
	const words = cleaned.split(/\s+/).slice(0, 6).join(" ")
	if (words.length < 2) return null
	return words
}

export interface CompanionUseCases {
	listSessions(ctx: AuthedContext): Promise<Awaited<ReturnType<CompanionRepository["listByUserId"]>>>
	createSession(
		input: CreateSessionInput,
		ctx: AuthedContext,
	): Promise<Awaited<ReturnType<CompanionRepository["createSession"]>>>
	listMessages(
		input: ListMessagesInput,
		ctx: AuthedContext,
	): Promise<Awaited<ReturnType<CompanionRepository["getMessages"]>>>
	sendMessage(
		input: SendMessageInput,
		ctx: AuthedContext,
	): Promise<{
		userMessage: Awaited<ReturnType<CompanionRepository["addMessage"]>>
		assistantMessage: Awaited<ReturnType<CompanionRepository["addMessage"]>>
	}>
	updateSessionTitle(
		input: UpdateSessionTitleInput,
		ctx: AuthedContext,
	): Promise<Awaited<ReturnType<CompanionRepository["updateTitle"]>>>
	deleteSession(input: DeleteSessionInput, ctx: AuthedContext): Promise<void>
}

export function makeCompanion(deps: {
	repo: CompanionRepository
	profileRepo: ProfileRepository
	settingsRepo: import("@api/domain/settings/settings-repository").SettingsRepository
	openRouter: OpenRouterService
	cache: Cache
}): CompanionUseCases {
	const { repo, profileRepo, settingsRepo, openRouter, cache: _cache } = deps
	return {
		async listSessions(ctx) {
			return repo.listByUserId(ctx.session.userId, 50)
		},
		async createSession(input, ctx) {
			const title = input.title?.trim() || "Percakapan baru"
			return repo.createSession(ctx.session.userId, title)
		},
		async listMessages(input, ctx) {
			await repo.requireOwned(input.sessionId, ctx.session.userId)
			return repo.getMessages(input.sessionId, MESSAGE_PAGE_SIZE)
		},
		async updateSessionTitle(input, ctx) {
			return repo.updateTitle(input.sessionId, ctx.session.userId, input.title.trim())
		},
		async deleteSession(input, ctx) {
			await repo.deleteSession(input.sessionId, ctx.session.userId)
		},
		async sendMessage(input, ctx) {
			const session = await repo.requireOwned(input.sessionId, ctx.session.userId)
			if (input.content.length > 4000) throw badRequest("message too long")

			const userMessage = await repo.addMessage(session.id, "user", input.content)

			if (session.title === "Percakapan baru") {
				try {
					const settings = await settingsRepo.getSettings()
					const generated = await openRouter.chat({
						messages: [
							{ role: "system", content: TITLE_GENERATION_PROMPT },
							{ role: "user", content: input.content },
						],
						apiKey: settings.openrouterApiKey ?? undefined,
						model: settings.modelId,
					})
					const sanitized = sanitizeTitle(generated)
					const finalTitle = sanitized ?? buildFallbackTitle(session.createdAt)
					await repo.updateTitle(session.id, ctx.session.userId, finalTitle)
				} catch (e) {
					console.error("Title generation error:", e)
					await repo.updateTitle(
						session.id,
						ctx.session.userId,
						buildFallbackTitle(session.createdAt),
					)
				}
			}

			const contentLower = input.content.toLowerCase()
			const isRedFlag = RED_FLAGS.some((flag) => contentLower.includes(flag))

			if (isRedFlag) {
				const assistantMessage = await repo.addMessage(session.id, "assistant", RED_FLAG_MESSAGE)
				return { userMessage, assistantMessage }
			}

			const settings = await settingsRepo.getSettings()
			const profile = await profileRepo.findByUserId(ctx.session.userId)
			const risk = profile ? assessRisk(profile) : null
			const systemPrompt = settings.systemPromptOverride || buildSystemPrompt(profile, risk, settings.knowledgeBase)

			const history = await repo.getMessages(session.id, HISTORY_FETCH)
			const recent = history.slice(-HISTORY_TURNS)
			const messages = [
				{ role: "system" as const, content: systemPrompt },
				...recent.map((m) => ({
					role: m.role as "user" | "assistant",
					content: m.content,
				})),
				{ role: "user" as const, content: input.content },
			]

			let reply: string
			try {
				reply = await openRouter.chat({
					messages,
					apiKey: settings.openrouterApiKey ?? undefined,
					model: settings.modelId,
				})
			} catch (e) {
				console.error("OpenRouter error:", e)
				reply = FALLBACK_MESSAGE
			}

			const assistantMessage = await repo.addMessage(session.id, "assistant", reply)
			return { userMessage, assistantMessage }
		},
	}
}
