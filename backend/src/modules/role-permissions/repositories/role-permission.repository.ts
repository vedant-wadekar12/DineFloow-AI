import { Types } from "mongoose";

import {
  IRolePermission,
  RolePermission,
} from "../models/role-permission.model";

export class RolePermissionRepository {
  async assignPermission(
    roleId: Types.ObjectId,
    permissionId: Types.ObjectId
  ): Promise<IRolePermission> {
    return await RolePermission.create({
      roleId,
      permissionId,
    });
  }

  async getPermissionsByRole(
    roleId: Types.ObjectId
  ): Promise<IRolePermission[]> {
    return await RolePermission.find({
      roleId,
    }).populate("permissionId");
  }

  async removePermission(
    roleId: Types.ObjectId,
    permissionId: Types.ObjectId
  ): Promise<void> {
    await RolePermission.deleteOne({
      roleId,
      permissionId,
    });
  }

  async removeAllPermissions(
    roleId: Types.ObjectId
  ): Promise<void> {
    await RolePermission.deleteMany({
      roleId,
    });
  }
}

export const rolePermissionRepository =
  new RolePermissionRepository();