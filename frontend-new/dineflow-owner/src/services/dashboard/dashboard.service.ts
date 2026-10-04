function missing(name: string): never {
  throw new Error(`Frontend API contract required: dashboard ${name} endpoint / response`);
}
export async function getDashboardStats(): Promise<never> { return missing("stats"); }
export async function getRevenueData(): Promise<never> { return missing("revenue"); }
export async function getOrderStatusData(): Promise<never> { return missing("order status"); }
export async function getTableStatusData(): Promise<never> { return missing("table status"); }
export async function getRecentOrders(): Promise<never> { return missing("recent orders"); }
export async function getPopularItems(): Promise<never> { return missing("popular items"); }
export async function getKitchenSnapshot(): Promise<never> { return missing("kitchen snapshot"); }
