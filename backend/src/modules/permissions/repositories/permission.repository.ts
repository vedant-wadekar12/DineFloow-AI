import { Types } from "mongoose";

import {
  IPermission,
  Permission,
} from "../models/permission.model";

export class PermissionRepository {
  async create(
    payload: Partial<IPermission>
  ): Promise<IPermission> {
    return await Permission.create(payload);
  }

  async findByName(
    name: string
  ): Promise<IPermission | null> {
    return await Permission.findOne({
      name,
      isActive: true,
    });
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IPermission | null> {
    return await Permission.findById(id);
  }

  async getAll(): Promise<IPermission[]> {
    return await Permission.find({
      isActive: true,
    }).sort({
      module: 1,
      name: 1,
    });
  }
}

export const permissionRepository =
  new PermissionRepository();