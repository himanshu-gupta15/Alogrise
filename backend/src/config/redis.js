import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL?.trim();
const redisHost = process.env.REDIS_HOST?.trim();
const redisPort = Number(process.env.REDIS_PORT || 6379);
const redisUser = process.env.REDIS_USER?.trim() || "default";

export const isRedisConfigured = Boolean(redisUrl || redisHost);

const redisOptions = redisUrl
  ? {
      url: redisUrl,
      socket: {
        reconnectStrategy: () => false,
      },
    }
  : {
      username: redisUser,
      password: process.env.REDIS_PASS,
      socket: {
        host: redisHost,
        port: redisPort,
        reconnectStrategy: () => false,
      },
    };

const redisClient = createClient({
  ...redisOptions,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err?.message || err);
});

redisClient.on("end", () => {
  console.warn("Redis connection closed");
});

export default redisClient;
