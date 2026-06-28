import type { Profile } from "@api/domain/profile/profile"
import { assessRisk } from "@api/domain/risk/risk"
import { describe, expect, it } from "vitest"

const BASE: Profile = {
	userId: "u1",
	age: null,
	riskFactors: [],
	onboardingCompleted: true,
	createdAt: new Date(),
	updatedAt: new Date(),
}

describe("assessRisk", () => {
	it("returns low for young healthy profile", () => {
		const result = assessRisk({ ...BASE, age: 30 })
		expect(result.level).toBe("low")
		expect(result.score).toBeLessThan(30)
	})

	it("returns medium for profile at threshold", () => {
		const result = assessRisk({ ...BASE, age: 50, riskFactors: ["hypertension"] })
		expect(result.level).toBe("medium")
		expect(result.score).toBeGreaterThanOrEqual(30)
	})

	it("returns high for multiple severe risk factors", () => {
		const result = assessRisk({
			...BASE,
			age: 65,
			riskFactors: ["hypertension", "diabetes", "heart_disease"],
			smokingStatus: "Perokok Aktif",
			stressLevel: "Tinggi",
		})
		expect(result.level).toBe("high")
		expect(result.score).toBeGreaterThanOrEqual(60)
	})

	it("BMI ≥30 scores higher than BMI 25–29", () => {
		const overweight = assessRisk({ ...BASE, height: 170, weight: 78 })
		const obese = assessRisk({ ...BASE, height: 170, weight: 90 })
		expect(obese.score).toBeGreaterThan(overweight.score)
		expect(obese.contributors.some((c: { code: string }) => c.code === "bmi_obese")).toBe(true)
	})
})
