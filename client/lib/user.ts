import { api } from "./api";

export async function updateProfile(firstName: string, lastName: string) {
  return api("/users/update-profile", {
    method: "PATCH",
    body: JSON.stringify({ firstName, lastName }),
  });
}

export async function updateEmail(newEmail: string) {
  return api("/users/change-email", {
    method: "PATCH",
    body: JSON.stringify({ newEmail }),
  });
}

export async function verifyCurrentEmailOTP(otp: string) {
  return api("/users/change-email/verify-current-otp", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
}

export async function verifyNewEmailOTP(otp: string) {
  return api("/users/change-email/verify-new-otp", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  return api("/users/change-password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
