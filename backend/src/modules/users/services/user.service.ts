import { ForbiddenError, NotFoundError } from "../../../common/errors";
import { userRepository } from "../repositories/user.repository";
import { roleRepository } from "../../roles/repositories/role.repository";

export class UserService {
  async getAll(restaurantId?: string) {
    return userRepository.findAll(restaurantId);
  }

  async getById(id: string, restaurantId?: string) {
    const user = await userRepository.findById(id, restaurantId);
    if (!user) throw new NotFoundError("User not found.");
    return user;
  }

  async updateStatus(id: string, isActive: boolean, restaurantId?: string) {
    const user = await userRepository.updateStatus(id, isActive, restaurantId);
    if (!user) throw new NotFoundError("User not found.");
    return user;
  }

  async updateRole(
    id: string,
    roleId: string,
    restaurantId?: string,
    actorIsSuperAdmin = false,
  ) {
    const user = await userRepository.findById(id, restaurantId);
    if (!user) throw new NotFoundError("User not found.");

    const role = await roleRepository.findById(roleId);
    if (!role || !role.isActive) throw new NotFoundError("Role not found.");

    if (role.name === "SUPER_ADMIN" && !actorIsSuperAdmin) {
      throw new ForbiddenError("Only a super administrator can assign the SUPER_ADMIN role.");
    }

    const updated = await userRepository.updateRole(id, roleId, restaurantId);
    if (!updated) throw new NotFoundError("User not found.");
    return updated;
  }

  async delete(id: string, restaurantId?: string) {
    const user = await userRepository.findById(id, restaurantId);
    if (!user) throw new NotFoundError("User not found.");
    await userRepository.softDelete(id, restaurantId);
  }
}

export const userService = new UserService();
