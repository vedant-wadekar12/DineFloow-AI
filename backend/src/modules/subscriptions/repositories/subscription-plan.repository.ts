import { Types } from "mongoose";

import {
  SubscriptionPlan,
  ISubscriptionPlan,
} from "../models/subscription-plan.model";

class SubscriptionPlanRepository {
  async create(
    data: Partial<ISubscriptionPlan>
  ) {
    return SubscriptionPlan.create(data);
  }

  async findById(
    id: string | Types.ObjectId
  ) {
    return SubscriptionPlan.findById(id);
  }

  async findByCode(
    code: string
  ) {
    return SubscriptionPlan.findOne({
      code: code.toUpperCase(),
    });
  }

  async findAll() {
    return SubscriptionPlan.find({
      isActive: true,
    }).sort({
      sortOrder: 1,
    });
  }

  async updateById(
    id: string,
    data: Partial<ISubscriptionPlan>
  ) {
    return SubscriptionPlan.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }
}

export const subscriptionPlanRepository =
  new SubscriptionPlanRepository();