export interface Supplier {
  id: string;
  restaurantId: string;
  branchId?: string;

  name: string;
  companyName?: string;

  email?: string;
  phone: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  gstNumber?: string;
  contactPerson?: string;
  notes?: string;

  isActive: boolean;
  isDeleted: boolean;

  createdBy?: string;
  updatedBy?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierData {
  restaurantId: string;
  branchId?: string;

  name: string;
  companyName?: string;

  email?: string;
  phone: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  gstNumber?: string;
  contactPerson?: string;
  notes?: string;
}

export interface UpdateSupplierData {
  branchId?: string;

  name?: string;
  companyName?: string;

  email?: string;
  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  gstNumber?: string;
  contactPerson?: string;
  notes?: string;
}

export interface SupplierFilters {
  restaurantId?: string;
  branchId?: string;
  isActive?: boolean;
}