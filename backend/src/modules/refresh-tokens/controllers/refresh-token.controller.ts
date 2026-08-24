import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../../common/responses";
import { refreshTokenService } from "../services/refresh-token.service";

export class RefreshTokenController {
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { refreshToken } = req.body;

      const result =
        await refreshTokenService.refresh(refreshToken);

      return res.status(200).json(
        new ApiResponse(
          true,
          "Access token refreshed successfully",
          result
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

export const refreshTokenController =
  new RefreshTokenController();