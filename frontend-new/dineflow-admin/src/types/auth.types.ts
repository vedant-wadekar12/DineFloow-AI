export type UserRole =
  | "SUPER_ADMIN"
  | "RESTAURANT_OWNER"
  | "BRANCH_MANAGER"
  | "CASHIER"
  | "WAITER"
  | "CHEF"
  | "KITCHEN_STAFF"
  | "CUSTOMER";

export interface User {
  id: string;
  _id?: string;

  email: string;

  firstName?: string;
  lastName?: string;
  name?: string;

  role?: UserRole;
  roleName?: UserRole;
  roleId?: string;
  roles?: UserRole[];

  permissions?: string[];

  emailVerified?: boolean;
  isVerified?: boolean;

  restaurantId?: string;
  branchId?: string;

  avatar?: string;

  isActive?: boolean;
  isDeleted?: boolean;

  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    credentials: LoginCredentials,
  ) => Promise<User>;

  register: (
    data: RegisterData,
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}