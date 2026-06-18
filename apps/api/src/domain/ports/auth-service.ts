export interface AuthService {
  banUser(userId: string, banReason?: string, ctx?: { headers: Headers }): Promise<void>;
}
