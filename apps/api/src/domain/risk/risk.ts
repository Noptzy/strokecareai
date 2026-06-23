import type { Profile } from "@api/domain/profile/profile"

export type RiskLevel = "low" | "medium" | "high"

export interface RiskContributor {
	code: string
	label: string
	points: number
	advice: string
}

export interface RiskAssessment {
	score: number
	level: RiskLevel
	contributors: RiskContributor[]
	protective: RiskContributor[]
	avoid: string[]
	recommend: string[]
	summary: string
}

const AGE_65 = 25
const AGE_55 = 18
const AGE_45 = 10
const HYPERTENSION = 20
const DIABETES = 15
const HEART_DISEASE = 15
const FAMILY_HISTORY = 10
const SMOKING_ACTIVE = 15
const SMOKING_FORMER = 7
const BMI_OBESE = 12
const BMI_OVERWEIGHT = 6
const STRESS_HIGH = 8
const STRESS_MED = 4
const EXERCISE_POOR = 8
const EXERCISE_GOOD = -5
const FOOD_BAD = 6
const SLEEP_BAD = 4
const SCORE_CAP = 100
const THRESHOLD_HIGH = 60
const THRESHOLD_MED = 30

function computeBmi(height?: number, weight?: number): number | null {
	if (!height || !weight || height <= 0 || weight <= 0) return null
	const hm = height / 100
	return weight / (hm * hm)
}

function matchesKeyword(text: string | undefined, keywords: string[]): boolean {
	if (!text) return false
	const lower = text.toLowerCase()
	return keywords.some((k) => lower.includes(k))
}

export function assessRisk(profile: Profile): RiskAssessment {
	const contributors: RiskContributor[] = []
	const protective: RiskContributor[] = []
	let raw = 0

	const age = profile.age ?? 0
	if (age >= 65) {
		contributors.push({ code: "age_65", label: "Usia ≥65 tahun", points: AGE_65, advice: "Pemeriksaan berkala lebih sering diperlukan." })
		raw += AGE_65
	} else if (age >= 55) {
		contributors.push({ code: "age_55", label: "Usia 55–64 tahun", points: AGE_55, advice: "Pantau tekanan darah dan gula darah rutin." })
		raw += AGE_55
	} else if (age >= 45) {
		contributors.push({ code: "age_45", label: "Usia 45–54 tahun", points: AGE_45, advice: "Mulai perhatikan gaya hidup sehat." })
		raw += AGE_45
	}

	if (profile.riskFactors.includes("hypertension")) {
		contributors.push({ code: "hypertension", label: "Hipertensi", points: HYPERTENSION, advice: "Kontrol tekanan darah dengan obat dan diet rendah garam." })
		raw += HYPERTENSION
	}

	if (profile.riskFactors.includes("diabetes")) {
		contributors.push({ code: "diabetes", label: "Diabetes", points: DIABETES, advice: "Jaga kadar gula darah dalam batas normal." })
		raw += DIABETES
	}

	if (profile.riskFactors.includes("heart_disease")) {
		contributors.push({ code: "heart_disease", label: "Penyakit Jantung", points: HEART_DISEASE, advice: "Ikuti terapi jantung dan hindari stres berat." })
		raw += HEART_DISEASE
	}

	if (profile.riskFactors.includes("family_history")) {
		contributors.push({ code: "family_history", label: "Riwayat Keluarga", points: FAMILY_HISTORY, advice: "Skrining rutin karena faktor genetik tidak bisa diubah." })
		raw += FAMILY_HISTORY
	}

	if (profile.smokingStatus === "Perokok Aktif" || profile.riskFactors.includes("smoking")) {
		contributors.push({ code: "smoking_active", label: "Perokok Aktif", points: SMOKING_ACTIVE, advice: "Berhenti merokok adalah langkah terpenting yang bisa Anda lakukan." })
		raw += SMOKING_ACTIVE
	} else if (profile.smokingStatus === "Pernah Merokok") {
		contributors.push({ code: "smoking_former", label: "Mantan Perokok", points: SMOKING_FORMER, advice: "Risiko masih ada; pertahankan hidup tanpa rokok." })
		raw += SMOKING_FORMER
	} else if (profile.smokingStatus === "Tidak Merokok") {
		protective.push({ code: "no_smoking", label: "Tidak Merokok", points: 0, advice: "Pertahankan kebiasaan tidak merokok." })
	}

	const bmiValue = computeBmi(profile.height, profile.weight)
	if (bmiValue !== null && bmiValue >= 30) {
		contributors.push({ code: "bmi_obese", label: `Obesitas (BMI ${bmiValue.toFixed(1)})`, points: BMI_OBESE, advice: "Turunkan berat badan secara bertahap dengan diet dan olahraga." })
		raw += BMI_OBESE
	} else if (bmiValue !== null && bmiValue >= 25) {
		contributors.push({ code: "bmi_overweight", label: `Kelebihan Berat (BMI ${bmiValue.toFixed(1)})`, points: BMI_OVERWEIGHT, advice: "Jaga pola makan dan tingkatkan aktivitas fisik." })
		raw += BMI_OVERWEIGHT
	} else if (profile.riskFactors.includes("obesity")) {
		contributors.push({ code: "obesity_factor", label: "Obesitas (dari profil)", points: BMI_OBESE, advice: "Turunkan berat badan secara bertahap." })
		raw += BMI_OBESE
	} else if (bmiValue !== null && bmiValue < 25) {
		protective.push({ code: "bmi_normal", label: `BMI Normal (${bmiValue.toFixed(1)})`, points: 0, advice: "Pertahankan berat badan ideal." })
	}

	if (profile.stressLevel === "Tinggi") {
		contributors.push({ code: "stress_high", label: "Stres Tinggi", points: STRESS_HIGH, advice: "Latihan relaksasi dan manajemen stres sangat disarankan." })
		raw += STRESS_HIGH
	} else if (profile.stressLevel === "Sedang") {
		contributors.push({ code: "stress_med", label: "Stres Sedang", points: STRESS_MED, advice: "Coba teknik pernapasan atau meditasi singkat." })
		raw += STRESS_MED
	} else if (profile.stressLevel === "Rendah") {
		protective.push({ code: "stress_low", label: "Stres Rendah", points: 0, advice: "Pertahankan keseimbangan emosional." })
	}

	if (matchesKeyword(profile.exercisePattern, ["rutin", "setiap", "rajin", "teratur"])) {
		protective.push({ code: "exercise_good", label: "Olahraga Rutin", points: 0, advice: "Lanjutkan rutinitas olahraga." })
		raw += EXERCISE_GOOD
	} else if (matchesKeyword(profile.exercisePattern, ["jarang", "tidak", "malas", "none"])) {
		contributors.push({ code: "exercise_poor", label: "Kurang Olahraga", points: EXERCISE_POOR, advice: "Mulai dengan 30 menit berjalan kaki 3x seminggu." })
		raw += EXERCISE_POOR
	}

	if (matchesKeyword(profile.dailyFoodPattern, ["gorengan", "asin", "manis"])) {
		contributors.push({ code: "food_bad", label: "Pola Makan Tidak Sehat", points: FOOD_BAD, advice: "Kurangi makanan asin, berminyak, dan tinggi gula." })
		raw += FOOD_BAD
	}

	if (matchesKeyword(profile.sleepPattern, ["kurang", "buruk", "susah", "insomnia"])) {
		contributors.push({ code: "sleep_bad", label: "Tidur Tidak Berkualitas", points: SLEEP_BAD, advice: "Usahakan tidur 7–8 jam per malam secara teratur." })
		raw += SLEEP_BAD
	}

	const score = Math.min(SCORE_CAP, Math.max(0, raw))
	const level: RiskLevel = score >= THRESHOLD_HIGH ? "high" : score >= THRESHOLD_MED ? "medium" : "low"

	const top3 = [...contributors].sort((a, b) => b.points - a.points).slice(0, 3)
	const avoid = top3.map((c) => c.advice)
	const recommend =
		protective.length > 0
			? protective.map((p) => p.advice)
			: ["Aktif bergerak minimal 30 menit/hari.", "Konsumsi buah dan sayuran setiap hari.", "Periksakan tekanan darah setiap 3 bulan."]

	const levelLabel = level === "high" ? "tinggi" : level === "medium" ? "sedang" : "rendah"
	const topLabels = top3.map((c) => c.label).join(", ")
	const summary = `Estimasi risiko stroke Anda ${score}% (${levelLabel}).${topLabels ? ` Faktor utama: ${topLabels}.` : " Profil risiko Anda relatif baik."}`

	return { score, level, contributors, protective, avoid, recommend, summary }
}
