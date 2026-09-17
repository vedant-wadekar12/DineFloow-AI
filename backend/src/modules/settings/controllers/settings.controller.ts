import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../common/interfaces";

import { SettingsService } from "../services/settings.service";
import { updateSettingsSchema } from "../validators/settings.validator";

export class SettingsController {
  constructor(
    private readonly service = new SettingsService()
  ) {}

  getSettings = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId =
        String(req.params.restaurantId);

      const settings =
        await this.service.getSettings(
          restaurantId
        );

      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const restaurantId =
        String(req.params.restaurantId);

      const data =
        updateSettingsSchema.parse(req.body);

      const settings =
        await this.service.updateSettings(
          restaurantId,
          data,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };
}