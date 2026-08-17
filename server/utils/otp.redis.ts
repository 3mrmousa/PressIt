import redis from "../config/redis.js";

export const setOtpSession = async (
  key: string,
  data: object,
  ttlSeconds: number,
) => {
  await redis.set(`otp:${key}`, JSON.stringify(data), "EX", ttlSeconds);
};

export const getOtpSession = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(`otp:${key}`);
  return data ? (JSON.parse(data) as T) : null;
};

export const delOtpSession = async (key: string) => {
  await redis.del(`otp:${key}`);
};
