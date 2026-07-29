import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL?.trim();
const redisHost = process.env.REDIS_HOST?.trim();
const redisPort = Number(process.env.REDIS_PORT || 6379);
const redisUser = process.env.REDIS_USER?.trim() || "default";

export const isRedisConfigured = Boolean(redisUrl || redisHost);

let hasConnectedOnce = false;

const reconnectStrategy = (retries) => {
  if (!hasConnectedOnce) {
    // If it fails on initial startup, do not retry so the server boots immediately
    return false;
  }
  if (retries > 5) {
    console.error("Redis reconnection failed after 5 retries.");
    return new Error("Redis reconnection failed");
  }
  // Exponential backoff up to 3 seconds
  return Math.min(retries * 1000, 3000);
};

const redisOptions = redisUrl
  ? {
      url: redisUrl,
      socket: {
        keepAlive: true,
        keepAliveInitialDelay: 10000,
        reconnectStrategy: reconnectStrategy,
      },
    }
  : {
      username: redisUser,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: redisHost,
        port: redisPort,
        keepAlive: true,
        keepAliveInitialDelay: 10000,
        reconnectStrategy: reconnectStrategy,
      },
    };

const redisClient = createClient({
  ...redisOptions,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
  hasConnectedOnce = true;
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err?.message || err);
});

redisClient.on("end", () => {
  console.warn("Redis connection closed");
});

export default redisClient;
