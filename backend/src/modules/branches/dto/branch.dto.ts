export interface CreateBranchDto {
  restaurantId: string;
  name: string;
  code: string;
  phone: string;
  email?: string;
  address: string;
}

export interface UpdateBranchDto {
  name?: string;
  code?: string;
  phone?: string;
  email?: string;
  address?: string;
}