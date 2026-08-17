export interface User {
  _id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  plan: "free" | "plus" | "pro";
  role: string;
  paddleCustomerId: string | null;
  compressionsToday: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface MeResponse {
  success: boolean;
  data: User | null;
}

export type SettingsTab =
  | "mainScreen"
  | "changeProfile"
  | "changeEmail"
  | "verifyCurrentEmail"
  | "verifyNewEmail"
  | "changePassword";
