import type { MeResponse, User } from "./types/types";
import { api } from "./api";

export async function login(email: string, password: string): Promise<User> {
  return api<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function googleLogin(token: string) {
  return api("/auth/google", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function signup(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<User> {
  return api<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
}

export async function verifyOtp(email: string, otp: string): Promise<User> {
  return api<User>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export async function logout(): Promise<void> {
  return api<void>("/auth/logout", {
    method: "POST",
  });
}

export async function forgotPassword(email: string) {
  return api("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function forgotPasswordOtp(email: string, otp: string) {
  return api("/auth/password/forgot/otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export async function resetPassword(email: string, newPassword: string) {
  return api("/auth/password/reset", {
    method: "PATCH",
    body: JSON.stringify({ email, newPassword }),
  });
}

export async function getMe(): Promise<MeResponse> {
  return api<MeResponse>("/auth/me");
}
