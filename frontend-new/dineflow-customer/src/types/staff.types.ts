import type { UserRole } from "@/types/auth.types";

export interface StaffMember {
  id: string;

  restaurantId: string;
  branchId?: string;

  firstName: string;
  lastName: string;

  email: string;
  phone?: string;

  role: UserRole;

  permissions?: string[];

  avatar?: string;

  isActive: boolean;
  isVerified?: boolean;

  lastLogin?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffData {
  restaurantId: string;

  firstName: string;
  lastName: string;

  email: string;
  phone?: string;

  password: string;
  confirmPassword: string;

  role: UserRole;

  branchId?: string;

  isActive: boolean;
}

export interface UpdateStaffData {
  firstName?: string;
  lastName?: string;

  email?: string;
  phone?: string;

  role?: UserRole;

  branchId?: string;

  isActive?: boolean;
}

export interface StaffStats {
  totalStaff: number;

  activeStaff: number;

  inactiveStaff: number;

  owners: number;

  managers: number;

  cashiers: number;

  waiters: number;

  chefs: number;

  kitchenStaff: number;
}