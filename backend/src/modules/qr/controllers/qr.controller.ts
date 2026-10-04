import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  createQRSchema,
  updateQRStatusSchema,
} from "../validators/qr.validator";

import { qrService } from "../services/qr.service";
import { AuthenticatedRequest } from "../../../common/interfaces";

export class QRController {
  async createQR(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createQRSchema.parse(req.body);

      const qr =
        await qrService.createQR(
          data,
          req.user?.userId,
          String(req.user!.restaurantId)
        );

      res.status(201).json({
        success: true,
        message:
          "QR code created successfully.",
        data: qr,
      });
    } catch (error) {
      next(error);
    }
  }

  async regenerateQR(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tableId =
        String(req.params.tableId);

      const qr =
        await qrService.regenerateQR(
          tableId,
          req.user?.userId,
          String(req.user!.restaurantId)
        );

      res.status(200).json({
        success: true,
        message:
          "QR code regenerated successfully.",
        data: qr,
      });
    } catch (error) {
      next(error);
    }
  }

  async getQRById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const qr =
        await qrService.getQRById(
          String(req.params.qrId),
          String(req.user!.restaurantId)
        );

      res.status(200).json({
        success: true,
        data: qr,
      });
    } catch (error) {
      next(error);
    }
  }

  async getQRByTableId(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const qr =
        await qrService.getQRByTableId(
          String(req.params.tableId),
          String(req.user!.restaurantId)
        );

      res.status(200).json({
        success: true,
        data: qr,
      });
    } catch (error) {
      next(error);
    }
  }

  async getQRByToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        await qrService.getQRByToken(
          String(req.params.token)
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllQRs(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const qrs =
        await qrService.getAllQRs(
          String(req.user!.restaurantId)
        );

      res.status(200).json({
        success: true,
        data: qrs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getQRsByRestaurant(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      /*
       * Ignore restaurantId from the URL.
       * Always use the authenticated tenant.
       */
      const qrs =
        await qrService.getQRsByRestaurant(
          String(req.user!.restaurantId)
        );

      res.status(200).json({
        success: true,
        data: qrs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getQRsByBranch(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const qrs =
        await qrService.getQRsByBranch(
          String(req.params.branchId),
          String(req.user!.restaurantId)
        );

      res.status(200).json({
        success: true,
        data: qrs,
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
      const data =
        updateQRStatusSchema.parse(req.body);

      const qr =
        await qrService.updateStatus(
          String(req.params.qrId),
          data.isActive,
          String(req.user!.restaurantId)
        );

      res.status(200).json({
        success: true,
        message:
          "QR code status updated successfully.",
        data: qr,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteQR(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await qrService.deleteQR(
          String(req.params.qrId),
          String(req.user!.restaurantId)
        );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const qrController =
  new QRController();