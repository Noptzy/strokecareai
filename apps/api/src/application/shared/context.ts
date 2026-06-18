import type { Session } from "../../domain/session/session.ts";

export interface OptionalAuthContext {
  headers: Headers;
  session: Session | null;
}

export interface AuthedContext {
  headers: Headers;
  session: Session;
}
