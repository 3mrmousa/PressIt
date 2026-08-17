export type ChangeEmailOtpSession = {
  userId: string;
  newEmail: string;
  step1Verified: boolean;
  otpCurrentEmailHash: string;
  otpNewEmailHash: string | null;
};