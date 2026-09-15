export interface CustomerAddressDto {
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface CreateCustomerDto {
  restaurantId: string;

  firstName: string;
  lastName?: string;

  email?: string;
  phone: string;

  profileImage?: string;

  addresses?: CustomerAddressDto[];

  dateOfBirth?: Date;

  notes?: string;
}

export interface UpdateCustomerDto {
  firstName?: string;
  lastName?: string;

  email?: string;
  phone?: string;

  profileImage?: string;

  addresses?: CustomerAddressDto[];

  dateOfBirth?: Date;

  notes?: string;
}

export interface UpdateCustomerStatusDto {
  status:
    | "ACTIVE"
    | "INACTIVE"
    | "BLOCKED";
}