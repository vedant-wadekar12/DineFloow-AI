
import apiClient from "@/services/api/api-client";

export interface Permission {
  _id: string;
  name: string;
  description: string;
  module: string;
  isActive: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface RolePermissionRecord {
  _id?: string;
  roleId: string | { _id: string };
  permissionId: string | Permission | { _id: string };
}

function extractId(value: string | { _id: string }): string {
  return typeof value === "string" ? value : value._id;
}

export async function getPermissions(): Promise<Permission[]> {
  const response = await apiClient.get<ApiResponse<Permission[]>>(
    "/permissions",
  );

  if (!Array.isArray(response.data?.data)) {
    throw new Error("Unexpected permissions API response.");
  }

  return response.data.data;
}

export async function getRolePermissions(
  roleId: string,
): Promise<Permission[]> {
  const id = roleId.trim();

  if (!id) {
    throw new Error("Enter a role ID.");
  }

  const response = await apiClient.get<
    ApiResponse<RolePermissionRecord[]>
  >(`/role-permissions/${encodeURIComponent(id)}/permissions`);

  if (!Array.isArray(response.data?.data)) {
    throw new Error("Unexpected role-permissions API response.");
  }

  return response.data.data.map((record) => {
    const permission = record.permissionId;

    if (typeof permission === "object" && "name" in permission) {
      return permission as Permission;
    }

    return {
      _id: extractId(permission as string | { _id: string }),
      name: extractId(permission as string | { _id: string }),
      description: "Permission details were not populated by the API.",
      module: "Unknown",
      isActive: true,
    };
  });
}

export async function assignPermissionToRole(
  roleId: string,
  permissionId: string,
): Promise<void> {
  const id = roleId.trim();
  const permission = permissionId.trim();

  if (!id) throw new Error("Enter a role ID.");
  if (!permission) throw new Error("Select a permission.");

  await apiClient.post(
    `/role-permissions/${encodeURIComponent(id)}/permissions`,
    { permissionId: permission },
  );
}