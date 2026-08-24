import { Types } from "mongoose";

import {
  IRolePermission,
  RolePermission,
} from "../models/role-permission.model";

export class RolePermissionRepository {
  async create(
    payload: Partial<IRolePermission>
  ): Promise<IRolePermission> {
    return await RolePermission.create(payload);
  }

  async hasPermission(
    roleId: string | Types.ObjectId,
    permissionId: string | Types.ObjectId
  ): Promise<boolean> {
    const rolePermission =
      await RolePermission.exists({
        roleId,
        permissionId,
      });

    return !!rolePermission;
  }

  async getRolePermissions(
    roleId: string | Types.ObjectId
  ): Promise<IRolePermission[]> {
    return await RolePermission.find({
      roleId,
    });
  }
}

export const rolePermissionRepository =
  new RolePermissionRepository();