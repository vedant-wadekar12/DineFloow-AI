export interface SocketUser {
  userId: string;
  email: string;
  roleId: string;
  restaurantId?: string;
  branchId?: string;
}

export interface SocketAuth {
  token?: string;
}