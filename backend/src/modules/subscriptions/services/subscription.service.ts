import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import {
  subscriptionPlanRepository,
} from "../repositories/subscription-plan.repository";

import {
  subscriptionRepository,
} from "../repositories/subscription.repository";

import {
  CreatePlanInput,
  CreateSubscriptionInput,
  ChangePlanInput,
} from "../validators/subscription.validator";

class SubscriptionService {
  private calculatePeriodEnd(
    startDate: Date,
    cycle: "MONTHLY" | "YEARLY"
  ) {
    const end = new Date(startDate);

    if (cycle === "MONTHLY") {
      end.setMonth(end.getMonth() + 1);
    } else {
      end.setFullYear(
        end.getFullYear() + 1
      );
    }

    return end;
  }

  async createPlan(
    input: CreatePlanInput,
    userId: string
  ) {
    const existing =
      await subscriptionPlanRepository.findByCode(
        input.code
      );

    if (existing) {
      throw new BadRequestError(
        "Subscription plan code already exists."
      );
    }

    return subscriptionPlanRepository.create({
      ...input,

      code:
        input.code.toUpperCase(),
    });
  }

  async getPlans() {
    return subscriptionPlanRepository.findAll();
  }

  async getPlan(
    planId: string
  ) {
    const plan =
      await subscriptionPlanRepository.findById(
        planId
      );

    if (!plan) {
      throw new NotFoundError(
        "Subscription plan not found."
      );
    }

    return plan;
  }

  async createSubscription(
    input: CreateSubscriptionInput,
    userId: string
  ) {
    const existing =
      await subscriptionRepository.findByRestaurant(
        input.restaurantId
      );

    if (existing) {
      throw new BadRequestError(
        "Restaurant already has a subscription."
      );
    }

    const plan =
      await this.getPlan(
        input.planId
      );

    if (!plan.isActive) {
      throw new BadRequestError(
        "Subscription plan is inactive."
      );
    }

    const startDate =
      new Date();

    let currentPeriodStart =
      startDate;

    let currentPeriodEnd =
      this.calculatePeriodEnd(
        startDate,
        input.billingCycle
      );

    let status:
      | "TRIAL"
      | "ACTIVE" = "ACTIVE";

    let trialEndsAt:
      | Date
      | undefined;

    if (input.trialDays > 0) {
      status = "TRIAL";

      trialEndsAt =
        new Date(startDate);

      trialEndsAt.setDate(
        trialEndsAt.getDate() +
          input.trialDays
      );

      currentPeriodEnd =
        trialEndsAt;
    }

    return subscriptionRepository.create({
      restaurantId:
        new Types.ObjectId(
          input.restaurantId
        ),

      planId:
        new Types.ObjectId(
          input.planId
        ),

      status,

      billingCycle:
        input.billingCycle,

      startDate,

      currentPeriodStart,

      currentPeriodEnd,

      trialEndsAt,

      cancelAtPeriodEnd: false,

      createdBy:
        new Types.ObjectId(userId),
    });
  }

  async getSubscription(
    restaurantId: string
  ) {
    const subscription =
      await subscriptionRepository.findByRestaurant(
        restaurantId
      );

    if (!subscription) {
      throw new NotFoundError(
        "Subscription not found."
      );
    }

    return subscription;
  }

  async changePlan(
    restaurantId: string,
    input: ChangePlanInput,
    userId: string
  ) {
    const subscription =
      await this.getSubscription(
        restaurantId
      );

    const plan =
      await this.getPlan(
        input.planId
      );

    if (!plan.isActive) {
      throw new BadRequestError(
        "Subscription plan is inactive."
      );
    }

    if (
      subscription.status ===
        "CANCELLED" ||
      subscription.status ===
        "EXPIRED"
    ) {
      throw new BadRequestError(
        "Cannot change plan for an inactive subscription."
      );
    }

    const updated =
      await subscriptionRepository.updateById(
        subscription._id.toString(),
        {
          planId:
            plan._id,

          billingCycle:
            input.billingCycle,

          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    return updated;
  }

  async cancelSubscription(
    restaurantId: string,
    immediately: boolean,
    userId: string
  ) {
    const subscription =
      await this.getSubscription(
        restaurantId
      );

    if (
      subscription.status ===
      "CANCELLED"
    ) {
      throw new BadRequestError(
        "Subscription is already cancelled."
      );
    }

    if (immediately) {
      return subscriptionRepository.updateById(
        subscription._id.toString(),
        {
          status: "CANCELLED",

          cancelledAt:
            new Date(),

          cancelAtPeriodEnd:
            false,

          updatedBy:
            new Types.ObjectId(userId),
        }
      );
    }

    return subscriptionRepository.updateById(
      subscription._id.toString(),
      {
        cancelAtPeriodEnd: true,

        updatedBy:
          new Types.ObjectId(userId),
      }
    );
  }

  async renewSubscription(
    restaurantId: string,
    userId: string
  ) {
    const subscription =
      await this.getSubscription(
        restaurantId
      );

    if (
      subscription.status ===
      "CANCELLED"
    ) {
      throw new BadRequestError(
        "Cancelled subscription cannot be renewed."
      );
    }

    const currentStart =
      new Date();

    const currentEnd =
      this.calculatePeriodEnd(
        currentStart,
        subscription.billingCycle
      );

    return subscriptionRepository.updateById(
      subscription._id.toString(),
      {
        status: "ACTIVE",

        currentPeriodStart:
          currentStart,

        currentPeriodEnd:
          currentEnd,

        cancelAtPeriodEnd:
          false,

        cancelledAt:
          undefined,

        updatedBy:
          new Types.ObjectId(userId),
      }
    );
  }

  async checkStatus(
    restaurantId: string
  ) {
    const subscription =
      await this.getSubscription(
        restaurantId
      );

    const now =
      new Date();

    if (
      subscription.currentPeriodEnd <
      now
    ) {
      if (
        subscription.cancelAtPeriodEnd
      ) {
        return subscriptionRepository.updateById(
          subscription._id.toString(),
          {
            status: "EXPIRED",
          }
        );
      }

      return subscriptionRepository.updateById(
        subscription._id.toString(),
        {
          status: "PAST_DUE",
        }
      );
    }

    if (
      subscription.status ===
        "TRIAL" &&
      subscription.trialEndsAt &&
      subscription.trialEndsAt < now
    ) {
      return subscriptionRepository.updateById(
        subscription._id.toString(),
        {
          status: "PAST_DUE",
        }
      );
    }

    return subscription;
  }
}

export const subscriptionService =
  new SubscriptionService();