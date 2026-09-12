export type BranchStatus = "ACTIVE" | "INACTIVE";

export interface BranchAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Branch {
  id: string;
  restaurantId: string;

  name: string;
  code?: string;

  phone?: string;
  email?: string;

  address: BranchAddress;

  status: BranchStatus;

  managerId?: string;
  managerName?: string;

  timezone?: string;
  currency?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBranchData {
  restaurantId: string;
  name: string;
  code?: string;
  phone?: string;
  email?: string;

  address: BranchAddress;

  timezone?: string;
  currency?: string;
}

export interface UpdateBranchData {
  name?: string;
  code?: string;
  phone?: string;
  email?: string;

  address?: BranchAddress;

  timezone?: string;
  currency?: string;

  status?: BranchStatus;
}

export interface BranchStats {
  total: number;
  active: number;
  inactive: number;
}