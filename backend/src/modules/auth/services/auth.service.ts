import { Types } from "mongoose";

import {
  ConflictError,
  UnauthorizedError,
} from "../../../common/errors";

import {
  tokenUtil,
  passwordUtil,
} from "../../../common/utilities";

import { authRepository } from "../repositories/auth.repository";
import { roleRepository } from "../../roles";
import { refreshTokenRepository } from "../../refresh-tokens";

import { RegisterDto, LoginDto } from "../dto/auth.dto";

export class AuthService {
/**
 * Register User
 */
async register(payload: RegisterDto) {
  const existingUser = await authRepository.findByEmail(
    payload.email
  );

  if (existingUser) {
    throw new ConflictError("Email already exists.");
  }

  // Public registrations are automatically assigned
  // the RESTAURANT_OWNER role.
  const role = await roleRepository.findByName(
    "RESTAURANT_OWNER"
  );

  if (!role) {
    throw new UnauthorizedError(
      "Default registration role is not configured."
    );
  }

  const user = await authRepository.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,

    // Password will be hashed by the User model pre-save hook
    password: payload.password,

    roleId: role._id,
  });

  return user;
}

  /**
   * Login User
   */
  async login(payload: LoginDto) {
    const user = await authRepository.findByEmail(
      payload.email
    );

    if (!user) {
      throw new UnauthorizedError(
        "Invalid email or password."
      );
    }

    const isPasswordValid = await passwordUtil.compare(
      payload.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError(
        "Invalid email or password."
      );
    }

    const jwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      roleId: user.roleId.toString(),
      restaurantId: user.restaurantId?.toString(),
      branchId: user.branchId?.toString(),
    };

    const accessToken =
      tokenUtil.generateAccessToken(jwtPayload);

    const refreshToken =
      tokenUtil.generateRefreshToken(jwtPayload);

    await refreshTokenRepository.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    await authRepository.updateLastLogin(user._id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

export const authService = new AuthService();