export interface User {
  _id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  profilePicture: { secure_url: string, public_id: string } | null;
  plan: "free" | "plus" | "pro";
  role: "admin" | "manager" | "user";
  history: boolean;

  compressionsToday: number;
  createdAt: string;
  updatedAt: string;
}

export interface MeResponse {
  message: string;
  data: User ;
}

export interface LoginResponse {
  message: string;
  data: User;
}
