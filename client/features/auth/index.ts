import type { MeResponse, User } from "@/lib/types/types";
import { client } from "@/lib/client";

export async function login(email: string, password: string): Promise<User> {
  return client<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function googleLogin(token: string) {
  return client("/auth/google", {
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
  return client<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
}

export async function verifyOtp(email: string, otp: string): Promise<User> {
  return client<User>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export async function logout(): Promise<void> {
  return client<void>("/auth/logout", {
    method: "POST",
  });
}

export async function forgotPassword(email: string) {
  return client("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function forgotPasswordOtp(email: string, otp: string) {
  return client("/auth/password/forgot/otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export async function resetPassword(email: string, newPassword: string) {
  return client("/auth/password/reset", {
    method: "PATCH",
    body: JSON.stringify({ email, newPassword }),
  });
}

export async function getMe() {
  return client<MeResponse>("/auth/me");
}
