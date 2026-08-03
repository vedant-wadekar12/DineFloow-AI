export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
  restaurantId?: string;
  branchId?: string;
}