import { client } from "@/lib/client";

export async function updateProfile(firstName: string, lastName: string) {
  return client("/users/update-profile", {
    method: "PATCH",
    body: JSON.stringify({ firstName, lastName }),
  });
}

export async function updateEmail(newEmail: string) {
  return client("/users/change-email", {
    method: "PATCH",
    body: JSON.stringify({ newEmail }),
  });
}

export async function verifyCurrentEmailOTP(otp: string) {
  return client("/users/change-email/verify-current-otp", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
}

export async function verifyNewEmailOTP(otp: string) {
  return client("/users/change-email/verify-new-otp", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  return client("/users/change-password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
