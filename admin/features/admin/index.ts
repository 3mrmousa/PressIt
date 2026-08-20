import { client } from "../../lib/client";
import { AdminSettings, AdminStats, BaseResponse, SystemLog, User, UsersResponse } from "./types";

export async function createManager(data: { email: string; password: string; firstName: string; lastName: string }) {
  return client<BaseResponse>("/admin/manager", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteManager(id: string) {
  return client<BaseResponse>(`/admin/manager/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminStats(page: number = 1) {
  return client<BaseResponse<AdminStats>>(`/admin/stats?page=${page}`);
}

export async function getAdminSettings() {
  return client<BaseResponse<AdminSettings>>("/admin/settings");
}

export async function updateAdminSettings(data: FormData) {
  
  return client<BaseResponse<AdminSettings>>("/admin/settings", {
    method: "PATCH",
    body: data,
  });
}

export async function getSystemLogs(page: number = 1, limit: number = 20) {
  return client<BaseResponse<SystemLog[]>>(`/admin/system/logs?page=${page}&limit=${limit}`);
}

export async function getAllUsers(page: number = 1, limit: number = 20) {
  return client<BaseResponse<UsersResponse>>(`/admin/all-users?page=${page}&limit=${limit}`);
}

export async function getUserById(id: string) {
  return client<BaseResponse<User>>(`/admin/user/${id}`);
}
