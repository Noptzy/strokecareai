# StrokeCare AI — single-image Dockerfile (per kana multi-stage pattern)
# Stages: base → deps → web-build → api-build → runtime
# Runtime serves both /rpc, /api/auth, /api (Hono) AND the built SPA from WEB_DIST_PATH.

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /repo

# ---------- deps ----------
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json biome.json .moon ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile

# ---------- web-build ----------
FROM deps AS web-build
COPY apps/web apps/web
COPY apps/api/src apps/api/src
COPY apps/api/tsconfig.json apps/api/
COPY apps/api/package.json apps/api/
COPY assets assets
RUN pnpm --filter @strokecare/web build

# ---------- api-build ----------
FROM deps AS api-build
COPY apps/api apps/api
COPY --from=web-build /repo/apps/web/dist /repo/apps/web/dist
RUN pnpm --filter @strokecare/api build

# ---------- runtime ----------
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY --from=api-build /repo/apps/api/dist apps/api/dist
COPY --from=api-build /repo/apps/api/drizzle apps/api/drizzle
COPY --from=api-build /repo/apps/web/dist apps/web/dist

RUN pnpm install --prod --frozen-lockfile --filter @strokecare/api...

RUN chown -R node:node /app
USER node

ENV WEB_DIST_PATH=/app/apps/web/dist
ENV PORT=3001
EXPOSE 3001

# Config is injected via container environment (compose / orchestrator), never baked into the image.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
	CMD node -e "fetch('http://localhost:3001/healthz').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Run migrations as an entrypoint step before starting the server.
CMD ["sh", "-c", "node apps/api/dist/migrate.js && node apps/api/dist/main.js"]

# ---------- dev ----------
FROM base AS dev
WORKDIR /repo
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json biome.json .moon ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile
COPY . .
ENV PORT=3001
ENV NODE_ENV=development
EXPOSE 3001
CMD ["sh", "-c", "pnpm --filter @strokecare/api exec tsx watch src/main.ts"]
