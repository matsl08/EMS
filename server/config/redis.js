// * Redis Configuration
// @ file: Setup and export Redis client

import { createClient } from "redis";

// * Create Redis client instance
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// * Redis event handlers
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis Client Connected Successfully");
});

// * Connect to Redis
export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
};

export default redisClient;
