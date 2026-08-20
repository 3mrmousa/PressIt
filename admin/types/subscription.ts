export interface SubscriptionUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Subscription {
  _id: string;
  user: SubscriptionUser;
  amount: number;
  createdAt: string;
  currentPeriodEnd: string;
  currentPeriodStart: string;
  fakeSubscriptionId: string;
  plan: string;
  status: string;
  updatedAt: string;
}
