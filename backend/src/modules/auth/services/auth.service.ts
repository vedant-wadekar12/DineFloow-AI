import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../../common/errors";

import {
  tokenUtil,
  passwordUtil,
} from "../../../common/utilities";

import { authRepository } from "../repositories/auth.repository";
import { roleRepository } from "../../roles";
import { restaurantService } from "../../restaurants/services/restaurant.service";
import { refreshTokenRepository } from "../../refresh-tokens";

import { RegisterDto, LoginDto } from "../dto/auth.dto";

export class AuthService {
  /**
   * Register User + Restaurant
   */
  async register(payload: RegisterDto) {
    /*
     * 1. Check whether email already exists.
     */
    const existingUser = await authRepository.findByEmail(
      payload.email
    );

    if (existingUser) {
      throw new ConflictError("Email already exists.");
    }

    /*
     * 2. Public registration gets RESTAURANT_OWNER role.
     */
    const role = await roleRepository.findByName(
      "RESTAURANT_OWNER"
    );

    if (!role) {
      throw new NotFoundError(
        "Default registration role is not configured."
      );
    }

    /*
     * 3. Create owner user.
     *
     * restaurantId is intentionally not supplied here.
     * The restaurant is created immediately after the user.
     */
    const user = await authRepository.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      roleId: role._id,
    });

    /*
     * 4. Generate unique restaurant slug.
     */
    const baseSlug = `${payload.firstName}-${payload.lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const slug = `${baseSlug || "restaurant"}-${user._id
      .toString()
      .slice(-6)}`;

    /*
     * 5. Create the owner's first restaurant.
     */
    const restaurant = await restaurantService.create(
      {
        name: `${payload.firstName}'s Restaurant`,
        slug,
        phone: payload.phone,
        email: payload.email,
        address: "Please update your restaurant address",
      },
      user._id.toString()
    );

    /*
     * 6. Assign the newly-created restaurant to the user.
     */
    const updatedUser = await authRepository.assignRestaurant(
      user._id,
      restaurant._id
    );

    if (!updatedUser) {
      throw new UnauthorizedError(
        "Unable to assign restaurant to user."
      );
    }

    /*
     * Registration does NOT automatically log in.
     * User must login separately.
     */
    return updatedUser;
  }

  /**
   * Login User
   */
  async login(payload: LoginDto) {
    /*
     * 1. Find user.
     */
    const user = await authRepository.findByEmail(
      payload.email
    );

    if (!user) {
      throw new UnauthorizedError(
        "Invalid email or password."
      );
    }

    /*
     * Temporary diagnostic log.
     *
     * Keep this for now so we can verify that the
     * restaurantId exists in the database during login.
     */
    console.log("LOGIN USER:", {
      id: user._id.toString(),
      email: user.email,
      restaurantId: user.restaurantId?.toString(),
      branchId: user.branchId?.toString(),
    });

    /*
     * 2. Verify password.
     */
    const isPasswordValid = await passwordUtil.compare(
      payload.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError(
        "Invalid email or password."
      );
    }

    /*
     * 3. Create JWT payload.
     *
     * restaurantId is included so the authenticated request
     * can be tenant-scoped.
     */
    const jwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      roleId: user.roleId.toString(),
      restaurantId: user.restaurantId?.toString(),
      branchId: user.branchId?.toString(),
    };

    /*
     * 4. Generate access token.
     */
    const accessToken =
      tokenUtil.generateAccessToken(jwtPayload);

    /*
     * 5. Generate refresh token.
     */
    const refreshToken =
      tokenUtil.generateRefreshToken(jwtPayload);

    /*
     * 6. Store refresh token.
     */
    await refreshTokenRepository.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    /*
     * 7. Update last login.
     */
    await authRepository.updateLastLogin(user._id);

    /*
     * 8. Resolve role for client apps (role gate UX).
     */
    const role = await roleRepository.findById(user.roleId);

    const userPayload =
      typeof user.toJSON === "function"
        ? user.toJSON()
        : user;

    /*
     * 9. Return login result.
     */
    return {
      user: {
        ...userPayload,
        roleName: role?.name,
      },
      accessToken,
      refreshToken,
    };
  }
}

export const authService = new AuthService();