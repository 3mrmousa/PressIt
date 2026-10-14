export interface User {
  _id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  profilePicture: { secure_url: string; public_id: string } | null;
  plan: "free" | "plus" | "pro";
  role: string;
  history: boolean;

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
  data: (User & {
    usage: {
      count: number;
      limit: number;
    };
  }) | null;
}

export type SettingsTab =
  | "mainScreen"
  | "changeProfile"
  | "changeEmail"
  | "verifyCurrentEmail"
  | "verifyNewEmail"
  | "changePassword";
