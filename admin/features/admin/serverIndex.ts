import { server } from "../../lib/server";
import { AdminSettings, AdminStats, BaseResponse, ManagersResponse, SystemLog, User, UsersResponse } from "./types";

export async function getAdminStats(page: number = 1, limit: number = 10) {
  return server<BaseResponse<AdminStats>>(`/admin/stats?page=${page}&limit=${limit}`);
}

export async function getAdminSettings() {
  return server<BaseResponse<AdminSettings>>("/admin/settings");
}

export async function getSystemLogs(page: number = 1, limit: number = 20) {
  return server<BaseResponse<SystemLog[]>>(`/admin/system/logs?page=${page}&limit=${limit}`);
}

export async function getAllUsers(page: number = 1, limit: number = 10) {
  return server<BaseResponse<UsersResponse>>(`/admin/users?page=${page}&limit=${limit}`);
}

export async function getUserById(id: string) {
  return server<BaseResponse<User>>(`/admin/users/${id}`);
}

export async function getAllManagers(page: number = 1, limit: number = 20) {
  return server<BaseResponse<ManagersResponse>>(`/admin/managers?page=${page}&limit=${limit}`);
}