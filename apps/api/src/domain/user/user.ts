export interface User {
	id: string
	name: string
	email: string
	role: "admin" | "user"
	banned: boolean
	createdAt: Date
}
