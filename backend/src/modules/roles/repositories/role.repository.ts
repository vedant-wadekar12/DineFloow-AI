import { Types } from "mongoose";

import { IRole, Role } from "../models/role.model";

export class RoleRepository {
  async create(
    payload: Partial<IRole>
  ): Promise<IRole> {
    return await Role.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IRole | null> {
    return await Role.findById(id);
  }

  async findByName(
    name: string
  ): Promise<IRole | null> {
    return await Role.findOne({
      name,
      isActive: true,
    });
  }

  async getAll(): Promise<IRole[]> {
    return await Role.find({
      isActive: true,
    }).sort({
      name: 1,
    });
  }
}

export const roleRepository = new RoleRepository();