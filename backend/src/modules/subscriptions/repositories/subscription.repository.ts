import { Types } from "mongoose";

import {
  Subscription,
  ISubscription,
} from "../models/subscription.model";

class SubscriptionRepository {
  async create(
    data: Partial<ISubscription>
  ) {
    return Subscription.create(data);
  }

  async findById(
    id: string | Types.ObjectId
  ) {
    return Subscription.findById(id)
      .populate("planId");
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ) {
    return Subscription.findOne({
      restaurantId,
    }).populate("planId");
  }

  async updateById(
    id: string,
    data: Partial<ISubscription>
  ) {
    return Subscription.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    ).populate("planId");
  }
}

export const subscriptionRepository =
  new SubscriptionRepository();