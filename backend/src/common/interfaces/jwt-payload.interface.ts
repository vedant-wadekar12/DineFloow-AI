export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
  roleName?: string;
  restaurantId?: string;
  branchId?: string;
  iat?: number;
  exp?: number;
}