export const CUSTOMER_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
] as const;

export type CustomerStatus =
  (typeof CUSTOMER_STATUSES)[number];

export interface CustomerAddress {
  _id?: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface Customer {
  _id: string;

  restaurantId: string;

  firstName: string;
  lastName?: string;

  email?: string;
  phone: string;

  profileImage?: string;

  addresses: CustomerAddress[];

  dateOfBirth?: string;

  status: CustomerStatus;

  totalOrders: number;
  totalSpent: number;

  lastOrderAt?: string;

  notes?: string;

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: string;
  updatedBy?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerData {
  restaurantId: string;

  firstName: string;
  lastName?: string;

  email?: string;
  phone: string;

  profileImage?: string;

  addresses?: CustomerAddress[];

  dateOfBirth?: string;

  notes?: string;
}

export interface UpdateCustomerData {
  firstName?: string;
  lastName?: string;

  email?: string;
  phone?: string;

  profileImage?: string;

  addresses?: CustomerAddress[];

  dateOfBirth?: string;

  notes?: string;
}

export interface UpdateCustomerStatusData {
  status: CustomerStatus;
}

export interface CustomerApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CustomerDeleteResponse {
  success: boolean;
  message?: string;
}

export interface CustomerStatsData {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  blockedCustomers: number;
  totalOrders: number;
  totalRevenue: number;
}