import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";
import { passwordUtil } from "../../../common/utilities";
import { authRepository } from "../../auth/repositories/auth.repository";
import { roleRepository } from "../../roles";
import { userService } from "../services/user.service";

export class UserController {
  /**
   * Get User Profile
   */
  async getProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await authRepository.findById(
        req.user!.userId
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      const role = await roleRepository.findById(user.roleId);
      const userPayload =
        typeof user.toJSON === "function" ? user.toJSON() : user;

      return res.status(200).json({
        success: true,
        message: "User profile retrieved successfully.",
        data: {
          ...userPayload,
          roleName: role?.name ?? req.user!.roleName,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await userService.delete(
      String(req.params.userId),
      req.user!.roleName === "SUPER_ADMIN" ? undefined : req.user!.restaurantId
    );

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

  /**
   * Update User Profile
   */
  async updateProfile(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await authRepository.updateProfile(
        req.user!.userId,
        req.body
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User profile updated successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.updateRole(
      String(req.params.userId),
      req.body.roleId,
      req.user!.roleName === "SUPER_ADMIN" ? undefined : req.user!.restaurantId,
      req.user!.roleName === "SUPER_ADMIN"
    );

    return res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

  async updateStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { isActive } = req.body;

    const user = await userService.updateStatus(
      req.params.userId as string,
      isActive,
      req.user!.roleName === "SUPER_ADMIN" ? undefined : req.user!.restaurantId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User status updated successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

  async deactivateAccount(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await authRepository.deactivateAccount(
      req.user!.userId
    );

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully.",
    });
  } catch (error) {
    next(error);
  }
}
async changePassword(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user =
      await authRepository.findByIdWithPassword(
        req.user!.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isValid =
      await user.comparePassword(currentPassword);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword =
      await passwordUtil.hash(newPassword);

    await authRepository.updatePassword(
      user._id,
      hashedPassword
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
}
async getAllUsers(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await userService.getAll(
      req.user!.roleName === "SUPER_ADMIN" ? undefined : req.user!.restaurantId
    );

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

async getUserById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.getById(
      String(req.params.userId),
      req.user!.roleName === "SUPER_ADMIN" ? undefined : req.user!.restaurantId
    );

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
}

export const userController = new UserController();