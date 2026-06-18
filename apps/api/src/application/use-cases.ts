import type { AuthService } from "../domain/ports/auth-service.ts";
import type { Cache } from "../domain/ports/cache.ts";
import type { UserRepository } from "../domain/user/user-repository.ts";

export interface Dependencies {
  auth: AuthService;
  cache: Cache;
  userRepo: UserRepository;
}

export function buildUseCases(deps: Dependencies) {
  return {
    // Add use cases here as they are developed
  };
}

export type UseCases = ReturnType<typeof buildUseCases>;
