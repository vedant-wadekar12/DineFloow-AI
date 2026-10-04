import type { User, UserRole } from "@/types/auth.types";

interface BackendUser {
  _id?: string;
  id?: string;
  email: string;

  firstName?: string;
  lastName?: string;
  name?: string;

  roleId?: string;
  roleName?: UserRole;
  role?: UserRole;
  roles?: UserRole[];

  permissions?: string[];

  restaurantId?: string;
  branchId?: string;

  isVerified?: boolean;
  emailVerified?: boolean;

  isActive?: boolean;
  isDeleted?: boolean;

  avatar?: string;

  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

interface BackendUserResponse {
  data?: BackendUser;
}

function isBackendUserResponse(
  value: BackendUser | BackendUserResponse,
): value is BackendUserResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value
  );
}

export function normalizeUser(
  response: BackendUser | BackendUserResponse,
): User {
  const backendUser = isBackendUserResponse(response)
    ? response.data
    : response;

  if (!backendUser) {
    throw new Error("Authenticated user data was not returned.");
  }

  const role =
    backendUser.roleName ??
    backendUser.role ??
    backendUser.roles?.[0];

  const id = backendUser.id ?? backendUser._id;

  if (!id) {
    throw new Error(
      "Authenticated user ID was not returned by the backend.",
    );
  }

  if (!backendUser.email) {
    throw new Error(
      "Authenticated user email was not returned by the backend.",
    );
  }

  if (!role) {
    throw new Error(
      "Authenticated user role was not returned by the backend.",
    );
  }

  return {
    id,

    _id: backendUser._id,

    email: backendUser.email,

    firstName: backendUser.firstName,
    lastName: backendUser.lastName,

    name:
      backendUser.name ??
      [backendUser.firstName, backendUser.lastName]
        .filter(Boolean)
        .join(" "),

    role,

    roleName: backendUser.roleName,

    roleId: backendUser.roleId,

    roles:
      backendUser.roles?.length
        ? backendUser.roles
        : [role],

    permissions: backendUser.permissions ?? [],

    restaurantId: backendUser.restaurantId,
    branchId: backendUser.branchId,

    emailVerified:
      backendUser.emailVerified ??
      backendUser.isVerified,

    isVerified: backendUser.isVerified,

    isActive: backendUser.isActive,
    isDeleted: backendUser.isDeleted,

    avatar: backendUser.avatar,

    createdAt: backendUser.createdAt,
    updatedAt: backendUser.updatedAt,
    lastLogin: backendUser.lastLogin,
  };
}