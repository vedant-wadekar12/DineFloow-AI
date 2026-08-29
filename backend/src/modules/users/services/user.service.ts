import { NotFoundError } from "../../../common/errors";

import { userRepository } from "../repositories/user.repository";

export class UserService {
  async getAll() {
    return await userRepository.findAll();
  }

  async getById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return user;
  }

  async updateStatus(
    id: string,
    isActive: boolean
  ) {
    const user = await userRepository.updateStatus(
      id,
      isActive
    );

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return user;
  }

  async updateRole(
    id: string,
    roleId: string
  ) {
    const user = await userRepository.updateRole(
      id,
      roleId
    );

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    return user;
  }

  async delete(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    await userRepository.softDelete(id);
  }
}

export const userService = new UserService();