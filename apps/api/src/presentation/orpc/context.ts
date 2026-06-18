import type { Session } from "../../domain/session/session.ts";
import type { UseCases } from "../../application/use-cases.ts";

export interface ORPCContext {
  headers: Headers;
  session: Session | null;
  useCases: UseCases;
}
