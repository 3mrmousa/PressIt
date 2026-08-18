const fs = require('fs');
const path = require('path');

// 1. fake-subscription
const fakeSubTypeText = `export interface SubscriptionData {
  _id?: string;
  user: string;
  plan: "plus" | "pro" | "free";
  status: "active" | "canceled" | "past_due" | "paused";
  fakeSubscriptionId: string;
  amount: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

export interface SubscriptionStatusResponse {
  success: boolean;
  data: SubscriptionData;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: { transactionId: string };
}

export interface CancelResponse {
  success: boolean;
  message: string;
}`;

let fakeSubIndex = fs.readFileSync('features/fake-subscription/index.ts', 'utf8');
fakeSubIndex = fakeSubIndex.replace(`export interface SubscriptionData {
  _id?: string;
  user: string;
  plan: "plus" | "pro" | "free";
  status: "active" | "canceled" | "past_due" | "paused";
  fakeSubscriptionId: string;
  amount: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}`, '');
fakeSubIndex = fakeSubIndex.replace(`export interface SubscriptionStatusResponse {
  success: boolean;
  data: SubscriptionData;
}`, '');
fakeSubIndex = fakeSubIndex.replace(`export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: { transactionId: string };
}`, '');
fakeSubIndex = fakeSubIndex.replace(`export interface CancelResponse {
  success: boolean;
  message: string;
}`, '');
fs.writeFileSync('features/fake-subscription/types.ts', fakeSubTypeText);
fs.writeFileSync('features/fake-subscription/index.ts', `import type { SubscriptionData, SubscriptionStatusResponse, CheckoutResponse, CancelResponse } from "./types";\n` + fakeSubIndex);


// 2. subscription
const subTypeText = `export interface SubscriptionData {
  _id?: string;
  plan: "plus" | "pro" | "free";
  status: "active" | "canceled" | "past_due" | "paused" | "trialing";

  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionStatusResponse {
  success: boolean;
  data: SubscriptionData;
}

export interface PortalResponse {
  success: boolean;
  data: { portalUrl: string };
}

export interface CheckoutResponse {
  success: boolean;
  data: { transactionId: string };
}`;

let subIndex = fs.readFileSync('features/subscription/index.ts', 'utf8');
subIndex = subIndex.replace(`export interface SubscriptionData {
  _id?: string;
  plan: "plus" | "pro" | "free";
  status: "active" | "canceled" | "past_due" | "paused" | "trialing";

  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}`, '');
subIndex = subIndex.replace(`export interface SubscriptionStatusResponse {
  success: boolean;
  data: SubscriptionData;
}`, '');
subIndex = subIndex.replace(`export interface PortalResponse {
  success: boolean;
  data: { portalUrl: string };
}`, '');
subIndex = subIndex.replace(`export interface CheckoutResponse {
  success: boolean;
  data: { transactionId: string };
}`, '');
fs.writeFileSync('features/subscription/types.ts', subTypeText);
fs.writeFileSync('features/subscription/index.ts', `import type { SubscriptionData, SubscriptionStatusResponse, PortalResponse, CheckoutResponse } from "./types";\n` + subIndex);


// 3. user
const userTypes = `export interface User {
  _id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  plan: "free" | "plus" | "pro";
  role: string;

  compressionsToday: number;
  createdAt: string;
  updatedAt: string;
}`;
fs.writeFileSync('features/user/types.ts', userTypes);

// 4. compress
const compressTypes = `export interface CompressParams {
  image: File;
  percent: number;
}

export interface HistoryParams {
  page: number;
  limit: number;
}`;
fs.writeFileSync('features/compress/types.ts', compressTypes);
let compressIndex = fs.readFileSync('features/compress/index.ts', 'utf8');
compressIndex = compressIndex.replace(`{
  image,
  percent,
}: {
  image: File;
  percent: number;
}`, '{ image, percent }: CompressParams');
compressIndex = compressIndex.replace(`{
  page,
  limit,
}: {
  page: number;
  limit: number;
}`, '{ page, limit }: HistoryParams');
fs.writeFileSync('features/compress/index.ts', `import type { CompressParams, HistoryParams } from "./types";\n` + compressIndex);


// 5. auth
const authTypes = `import type { User } from "../user/types";\n\nexport interface MeResponse {
  success: boolean;
  data: User | null;
}`;
fs.writeFileSync('features/auth/types.ts', authTypes);
let authIndex = fs.readFileSync('features/auth/index.ts', 'utf8');
authIndex = authIndex.replace('import type { MeResponse, User } from "@/lib/types/types";', 'import type { User } from "../user/types";\nimport type { MeResponse } from "./types";');
fs.writeFileSync('features/auth/index.ts', authIndex);

// 6. Update hooks/useMe.ts
let useMe = fs.readFileSync('hooks/useMe.ts', 'utf8');
useMe = useMe.replace('import type { MeResponse } from "@/lib/types/types";', 'import type { MeResponse } from "@/features/auth/types";');
fs.writeFileSync('hooks/useMe.ts', useMe);


// 7. Remove User and MeResponse from lib/types/types.ts
let libTypes = fs.readFileSync('lib/types/types.ts', 'utf8');
libTypes = libTypes.replace(`export interface User {
  _id: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  plan: "free" | "plus" | "pro";
  role: string;

  compressionsToday: number;
  createdAt: string;
  updatedAt: string;
}

`, '');
libTypes = libTypes.replace(`export interface MeResponse {
  success: boolean;
  data: User | null;
}

`, '');
fs.writeFileSync('lib/types/types.ts', libTypes);

console.log("Success!");
