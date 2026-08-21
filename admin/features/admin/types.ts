import { Subscription } from "../../types/subscription";

export interface AdminSettings {
  siteName?: string;
  logo?: {
    secure_url: string;
    public_id: string;
  };
  subscriptionPrices?: {
    plus?: number;
    pro?: number;
  };
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  emailVerified: boolean;
  profilePicture?: {
    secure_url: string;
    public_id: string;
  };
  plan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
}

export interface ManagersResponse {
  managers: User[];
  total: number;
}

export interface AdminStats {
  totalEarnings: number;
  totalActiveSubscriptions: number;
  totalCanceledSubscriptions: number;
  totalUsers: number;
  totalManagers: number;
  totalFreeUsers: number;
  totalPlusUsers: number;
  totalProUsers: number;
  subscriptions: Subscription[];
}

export interface SystemLog {
  _id: string;
  level: string;
  message: string;
  meta: any;
  createdAt: string;
}

export interface Pagination {
  page: number;
  totalPages: number;
  limit: number;
}

export interface BaseResponse<T = any> {
  success: boolean | string;
  message?: string;
  data?: T;
  pagination?: Pagination;
}
