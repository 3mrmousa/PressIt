import { client } from "../../lib/client";
import { LoginResponse, MeResponse, User } from "./types";

export async function login(email: string, password: string) {
  return client<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function googleLogin(token: string) {
  return client<User>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function logout() {
  return client<void>("/auth/logout", {
    method: "POST",
  });
}

export async function forgotPassword(email: string) {
    return client<void>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
    })
}

export async function resetPassword(token: string, password: string) {
    return client<void>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
    })
}

export async function getMe(){
    return client<MeResponse>("/auth/me")
}