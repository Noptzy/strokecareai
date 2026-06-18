import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "./infrastructure/config/env.ts";
import { createDb } from "./infrastructure/db/client.ts";
import { buildAuth } from "./infrastructure/auth/better-auth.ts";
import { createRedisCache } from "./infrastructure/cache/redis.ts";
import { buildUseCases } from "./application/use-cases.ts";
import { buildRouter } from "./presentation/routers/index.ts";
import { RPCHandler } from "@orpc/server/hono";
import { cors } from "hono/cors";

async function main() {
  const db = createDb(env.DATABASE_URL);
  const cache = createRedisCache(env.REDIS_URL);
  
  const auth = buildAuth({ 
    db, 
    secret: env.BETTER_AUTH_SECRET, 
    url: env.BETTER_AUTH_URL 
  });

  const authService = {
    async banUser(userId: string, banReason?: string, ctx?: { headers: Headers }) {
      await auth.api.banUser({ body: { userId, banReason }, headers: ctx?.headers });
    }
  };

  const useCases = buildUseCases({ auth: authService, cache, userRepo: {} as any }); // mock userRepo for now
  const appRouter = buildRouter(useCases);

  const app = new Hono();
  
  app.use("*", cors({ origin: env.WEB_ORIGIN, credentials: true }));
  
  app.get("/healthz", (c) => c.text("ok"));

  app.all("/api/auth/*", (c) => auth.handler(c.req.raw));

  const rpcHandler = new RPCHandler(appRouter);
  app.all("/rpc/*", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    return rpcHandler.fetch(c.req.raw, {
      context: {
        headers: c.req.raw.headers,
        session: session ? { ...session.session, user: session.user as any } : null,
        useCases
      }
    });
  });

  serve({
    fetch: app.fetch,
    port: env.PORT,
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  });
}

main().catch(console.error);
