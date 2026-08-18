import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";

export class AuthController {
  /**
   * Register a new user
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await authService.register(req.body);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await authService.login(req.body);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();