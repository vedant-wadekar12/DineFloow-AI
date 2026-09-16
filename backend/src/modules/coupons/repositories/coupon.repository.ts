import { Types } from "mongoose";

import {
  Coupon,
  ICoupon,
} from "../models/coupon.model";

class CouponRepository {
  async create(
    data: Partial<ICoupon>
  ): Promise<ICoupon> {
    return Coupon.create(data);
  }

  async findById(
    couponId: string | Types.ObjectId
  ): Promise<ICoupon | null> {
    return Coupon.findById(couponId);
  }

  async findByCode(
    restaurantId: string,
    code: string
  ): Promise<ICoupon | null> {
    return Coupon.findOne({
      restaurantId,
      code: code.toUpperCase(),
      isDeleted: false,
    });
  }

  async findAll(
    filter: Record<string, unknown>
  ): Promise<ICoupon[]> {
    return Coupon.find(filter).sort({
      createdAt: -1,
    });
  }

  async updateById(
    couponId: string,
    data: Partial<ICoupon>
  ): Promise<ICoupon | null> {
    return Coupon.findByIdAndUpdate(
      couponId,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async incrementUsage(
    couponId: string
  ): Promise<ICoupon | null> {
    return Coupon.findByIdAndUpdate(
      couponId,
      {
        $inc: {
          usageCount: 1,
        },
      },
      {
        new: true,
      }
    );
  }
}

export const couponRepository =
  new CouponRepository();