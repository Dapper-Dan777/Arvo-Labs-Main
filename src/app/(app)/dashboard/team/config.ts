export type Plan = "starter" | "pro" | "enterprise" | "individual";

export type AccountType = "user" | "team";

export interface DashboardContext {
  plan: Plan;
  accountType: AccountType;
}


