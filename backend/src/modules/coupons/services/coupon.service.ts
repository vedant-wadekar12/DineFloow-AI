import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import {
  ICoupon,
} from "../models/coupon.model";

import {
  CreateCouponInput,
  UpdateCouponInput,
  ValidateCouponInput,
} from "../validators/coupon.validator";

import {
  couponRepository,
} from "../repositories/coupon.repository";

class CouponService {
  async createCoupon(
    input: CreateCouponInput,
    userId: string
  ): Promise<ICoupon> {
    if (
      input.validUntil <=
      input.validFrom
    ) {
      throw new BadRequestError(
        "validUntil must be after validFrom."
      );
    }

    if (
      input.discountType ===
        "PERCENTAGE" &&
      input.discountValue > 100
    ) {
      throw new BadRequestError(
        "Percentage discount cannot exceed 100."
      );
    }

    const existing =
      await couponRepository.findByCode(
        input.restaurantId,
        input.code
      );

    if (existing) {
      throw new BadRequestError(
        "Coupon code already exists."
      );
    }

    const coupon =
      await couponRepository.create({
        restaurantId:
          new Types.ObjectId(
            input.restaurantId
          ),

        branchId:
          input.branchId
            ? new Types.ObjectId(
                input.branchId
              )
            : undefined,

        code:
          input.code.toUpperCase(),

        name: input.name,

        description:
          input.description,

        discountType:
          input.discountType,

        discountValue:
          input.discountValue,

        minimumOrderAmount:
          input.minimumOrderAmount,

        maximumDiscountAmount:
          input.maximumDiscountAmount,

        usageLimit:
          input.usageLimit,

        perCustomerLimit:
          input.perCustomerLimit,

        validFrom:
          input.validFrom,

        validUntil:
          input.validUntil,

        applicableMenuItemIds:
          input.applicableMenuItemIds.map(
            (id) =>
              new Types.ObjectId(id)
          ),

        applicableCategoryIds:
          input.applicableCategoryIds.map(
            (id) =>
              new Types.ObjectId(id)
          ),

        createdBy:
          new Types.ObjectId(userId),
      });

    return coupon;
  }

  async getCoupon(
    couponId: string
  ): Promise<ICoupon> {
    const coupon =
      await couponRepository.findById(
        couponId
      );

    if (!coupon || coupon.isDeleted) {
      throw new NotFoundError(
        "Coupon not found."
      );
    }

    return coupon;
  }

  async getCoupons(
    restaurantId?: string,
    branchId?: string
  ): Promise<ICoupon[]> {
    const filter: Record<string, unknown> = {
      isDeleted: false,
    };

    if (restaurantId) {
      filter.restaurantId =
        restaurantId;
    }

    if (branchId) {
      filter.branchId = branchId;
    }

    return couponRepository.findAll(
      filter
    );
  }

  async updateCoupon(
    couponId: string,
    input: UpdateCouponInput,
    userId: string
  ): Promise<ICoupon> {
    const coupon =
      await this.getCoupon(couponId);

    const validFrom =
      input.validFrom ??
      coupon.validFrom;

    const validUntil =
      input.validUntil ??
      coupon.validUntil;

    if (validUntil <= validFrom) {
      throw new BadRequestError(
        "validUntil must be after validFrom."
      );
    }

    const discountType =
      input.discountType ??
      coupon.discountType;

    const discountValue =
      input.discountValue ??
      coupon.discountValue;

    if (
      discountType === "PERCENTAGE" &&
      discountValue > 100
    ) {
      throw new BadRequestError(
        "Percentage discount cannot exceed 100."
      );
    }

    const updated =
      await couponRepository.updateById(
        couponId,
        {
          ...input,

          validFrom,

          validUntil,

          discountType,

          discountValue,

          applicableMenuItemIds:
            input.applicableMenuItemIds
              ? input.applicableMenuItemIds.map(
                  (id) =>
                    new Types.ObjectId(id)
                )
              : undefined,

          applicableCategoryIds:
            input.applicableCategoryIds
              ? input.applicableCategoryIds.map(
                  (id) =>
                    new Types.ObjectId(id)
                )
              : undefined,

          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError(
        "Coupon not found."
      );
    }

    return updated;
  }

  async updateStatus(
    couponId: string,
    isActive: boolean,
    userId: string
  ): Promise<ICoupon> {
    const updated =
      await couponRepository.updateById(
        couponId,
        {
          isActive,
          status:
            isActive
              ? "ACTIVE"
              : "INACTIVE",
          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError(
        "Coupon not found."
      );
    }

    return updated;
  }

  async deleteCoupon(
    couponId: string,
    userId: string
  ): Promise<ICoupon> {
    const updated =
      await couponRepository.updateById(
        couponId,
        {
          isDeleted: true,
          isActive: false,
          status: "INACTIVE",
          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError(
        "Coupon not found."
      );
    }

    return updated;
  }

  async validateCoupon(
    input: ValidateCouponInput
  ) {
    const coupon =
      await couponRepository.findByCode(
        input.restaurantId,
        input.code
      );

    if (!coupon) {
      throw new NotFoundError(
        "Coupon not found."
      );
    }

    const now = new Date();

    if (!coupon.isActive) {
      throw new BadRequestError(
        "Coupon is inactive."
      );
    }

    if (coupon.status !== "ACTIVE") {
      throw new BadRequestError(
        "Coupon is not active."
      );
    }

    if (
      now < coupon.validFrom ||
      now > coupon.validUntil
    ) {
      throw new BadRequestError(
        "Coupon is expired or not yet valid."
      );
    }

    if (
      coupon.usageLimit !== undefined &&
      coupon.usageCount >=
        coupon.usageLimit
    ) {
      throw new BadRequestError(
        "Coupon usage limit reached."
      );
    }

    if (
      input.orderAmount <
      coupon.minimumOrderAmount
    ) {
      throw new BadRequestError(
        `Minimum order amount is ${coupon.minimumOrderAmount}.`
      );
    }

    let discountAmount = 0;

    if (
      coupon.discountType ===
      "PERCENTAGE"
    ) {
      discountAmount =
        (input.orderAmount *
          coupon.discountValue) /
        100;
    } else {
      discountAmount =
        coupon.discountValue;
    }

    if (
      coupon.maximumDiscountAmount !==
        undefined &&
      discountAmount >
        coupon.maximumDiscountAmount
    ) {
      discountAmount =
        coupon.maximumDiscountAmount;
    }

    discountAmount = Math.min(
      discountAmount,
      input.orderAmount
    );

    return {
      valid: true,

      couponId: coupon._id,

      code: coupon.code,

      discountType:
        coupon.discountType,

      discountValue:
        coupon.discountValue,

      discountAmount,

      finalAmount:
        input.orderAmount -
        discountAmount,
    };
  }
}

export const couponService =
  new CouponService();