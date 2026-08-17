import { randomInt, createHash } from "crypto";

export const generateEmailVerificationOTP = () => {
  const otp = randomInt(100000, 999999).toString();

  const hashedOtp = createHash("sha256").update(otp).digest("hex");

  return { otp, hashedOtp };
};