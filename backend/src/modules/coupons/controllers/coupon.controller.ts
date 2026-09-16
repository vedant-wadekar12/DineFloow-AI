import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces/authenticated-request.interface";

import {
  createCouponSchema,
  updateCouponSchema,
  couponStatusSchema,
  validateCouponSchema,
} from "../validators/coupon.validator";

import {
  couponService,
} from "../services/coupon.service";

class CouponController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        createCouponSchema.parse(
          req.body
        );

      const coupon =
        await couponService.createCoupon(
          input,
          req.user!.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Coupon created successfully.",
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const restaurantId =
        req.query.restaurantId
          ? String(
              req.query.restaurantId
            )
          : undefined;

      const branchId =
        req.query.branchId
          ? String(req.query.branchId)
          : undefined;

      const coupons =
        await couponService.getCoupons(
          restaurantId,
          branchId
        );

      res.status(200).json({
        success: true,
        data: coupons,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const coupon =
        await couponService.getCoupon(
          String(req.params.couponId)
        );

      res.status(200).json({
        success: true,
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        updateCouponSchema.parse(
          req.body
        );

      const coupon =
        await couponService.updateCoupon(
          String(req.params.couponId),
          input,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Coupon updated successfully.",
        data: coupon,
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
      const input =
        couponStatusSchema.parse(
          req.body
        );

      const coupon =
        await couponService.updateStatus(
          String(req.params.couponId),
          input.isActive,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Coupon status updated successfully.",
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const coupon =
        await couponService.deleteCoupon(
          String(req.params.couponId),
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Coupon deleted successfully.",
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  }

  async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        validateCouponSchema.parse(
          req.body
        );

      const result =
        await couponService.validateCoupon(
          input
        );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const couponController =
  new CouponController();