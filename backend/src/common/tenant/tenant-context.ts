import { AsyncLocalStorage } from "node:async_hooks";

export interface TenantContextValue {
  authenticated: boolean;

  userId?: string;

  restaurantId?: string;

  branchId?: string;

  roleId?: string;

  roleName?: string;

  isSuperAdmin: boolean;
}

const storage =
  new AsyncLocalStorage<TenantContextValue>();

export const tenantContext = {
  run<T>(
    context: TenantContextValue,
    callback: () => T
  ): T {
    return storage.run(context, callback);
  },

  get(): TenantContextValue | undefined {
    return storage.getStore();
  },
};