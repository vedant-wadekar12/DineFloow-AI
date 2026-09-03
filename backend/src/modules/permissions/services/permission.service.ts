import { NotFoundError } from "../../../common/errors";

import {
  permissionRepository,
} from "../repositories/permission.repository";

export class PermissionService {
  async getAll() {
    return await permissionRepository.getAll();
  }

  async getById(id: string) {
    const permission =
      await permissionRepository.findById(id);

    if (!permission || !permission.isActive) {
      throw new NotFoundError(
        "Permission not found."
      );
    }

    return permission;
  }
}

export const permissionService =
  new PermissionService();