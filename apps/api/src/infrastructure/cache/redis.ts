import Redis from "ioredis";
import type { Cache } from "../../domain/ports/cache.ts";

export function createRedisCache(url: string): Cache {
  const redis = new Redis(url);

  return {
    async get<T>(key: string): Promise<T | null> {
      const val = await redis.get(key);
      return val ? (JSON.parse(val) as T) : null;
    },
    async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
      await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    },
    async del(...keys: string[]): Promise<void> {
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    },
    async delPattern(pattern: string): Promise<void> {
      let cursor = "0";
      do {
        const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", "100");
        cursor = nextCursor;
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== "0");
    },
    async ping(): Promise<boolean> {
      const res = await redis.ping();
      return res === "PONG";
    },
  };
}
