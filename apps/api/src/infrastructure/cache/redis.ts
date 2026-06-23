import type { Cache } from "@api/domain/ports/cache"
import Redis from "ioredis"

const memoryStore = new Map<string, { value: string; expiresAt: number | null }>()

function memGet<T>(key: string): T | null {
	const entry = memoryStore.get(key)
	if (!entry) return null
	if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
		memoryStore.delete(key)
		return null
	}
	return JSON.parse(entry.value) as T
}

function memSet(key: string, value: unknown, ttlSeconds: number): void {
	memoryStore.set(key, {
		value: JSON.stringify(value),
		expiresAt: ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null,
	})
}

function memDel(...keys: string[]): void {
	for (const k of keys) memoryStore.delete(k)
}

function memDelPattern(pattern: string): void {
	const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`)
	for (const k of memoryStore.keys()) {
		if (regex.test(k)) memoryStore.delete(k)
	}
}

export function createRedisCache(url: string): Cache {
	const redis = new Redis(url, {
		lazyConnect: true,
		maxRetriesPerRequest: 1,
		enableOfflineQueue: false,
		retryStrategy: () => null,
	})

	let connected = false
	redis
		.connect()
		.then(() => {
			connected = true
			console.log("[cache] connected to redis")
		})
		.catch((err: Error) => {
			console.warn(`[cache] redis unreachable (${err.message}); falling back to in-memory cache`)
		})

	redis.on("error", () => {
		if (connected) {
			connected = false
			console.warn("[cache] redis disconnected; using in-memory fallback")
		}
	})

	return {
		async get<T>(key: string): Promise<T | null> {
			if (!connected) return memGet<T>(key)
			try {
				const val = await redis.get(key)
				return val ? (JSON.parse(val) as T) : null
			} catch {
				return memGet<T>(key)
			}
		},
		async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
			if (!connected) {
				memSet(key, value, ttlSeconds)
				return
			}
			try {
				await redis.set(key, JSON.stringify(value), "EX", ttlSeconds)
			} catch {
				memSet(key, value, ttlSeconds)
			}
		},
		async del(...keys: string[]): Promise<void> {
			if (keys.length === 0) return
			if (!connected) {
				memDel(...keys)
				return
			}
			try {
				await redis.del(...keys)
			} catch {
				memDel(...keys)
			}
		},
		async delPattern(pattern: string): Promise<void> {
			if (!connected) {
				memDelPattern(pattern)
				return
			}
			try {
				let cursor = "0"
				do {
					const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", "100")
					cursor = nextCursor
					if (keys.length > 0) {
						await redis.del(...keys)
					}
				} while (cursor !== "0")
			} catch {
				memDelPattern(pattern)
			}
		},
		async ping(): Promise<boolean> {
			if (!connected) return true
			try {
				const res = await redis.ping()
				return res === "PONG"
			} catch {
				return true
			}
		},
	}
}
