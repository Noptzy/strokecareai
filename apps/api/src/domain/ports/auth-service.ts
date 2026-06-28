export interface AuthService {
	createUser(input: {
		name: string
		email: string
		password: string
	}): Promise<{ id: string }>
	banUser(userId: string, banReason?: string, ctx?: { headers: Headers }): Promise<void>
}
