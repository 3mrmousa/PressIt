import { Redis } from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err.message));

export default redis;
