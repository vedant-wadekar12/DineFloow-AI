import { NotFoundError } from "../../../common/errors";
import { Types } from "mongoose";
import { permissionRepository } from "../../permissions/repositories/permission.repository";
import { roleRepository } from "../../roles/repositories/role.repository";

import {
  rolePermissionRepository,
} from "../repositories/role-permission.repository";

export class RolePermissionService {
  async assignPermission(
    roleId: string,
    permissionId: string
  ) {
    const role = await roleRepository.findById(roleId);

    if (!role || !role.isActive) {
      throw new NotFoundError("Role not found.");
    }

    const permission =
      await permissionRepository.findById(permissionId);

    if (!permission || !permission.isActive) {
      throw new NotFoundError("Permission not found.");
    }

    const existing =
      await rolePermissionRepository.hasPermission(
        roleId,
        permissionId
      );

    if (existing) {
      return;
    }

    return await rolePermissionRepository.create({
      roleId: new Types.ObjectId(roleId),
      permissionId: new Types.ObjectId(permissionId),
    });
  }

  async getRolePermissions(roleId: string) {
    const role = await roleRepository.findById(roleId);

    if (!role || !role.isActive) {
      throw new NotFoundError("Role not found.");
    }

    return await rolePermissionRepository.getRolePermissions(
      roleId
    );
  }
}

export const rolePermissionService =
  new RolePermissionService();