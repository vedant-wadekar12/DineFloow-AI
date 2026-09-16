import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces/authenticated-request.interface";

import {
  createPlanSchema,
  createSubscriptionSchema,
  changePlanSchema,
  cancelSubscriptionSchema,
} from "../validators/subscription.validator";

import {
  subscriptionService,
} from "../services/subscription.service";

class SubscriptionController {
  async createPlan(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        createPlanSchema.parse(
          req.body
        );

      const plan =
        await subscriptionService.createPlan(
          input,
          req.user!.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Subscription plan created successfully.",
        data: plan,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlans(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const plans =
        await subscriptionService.getPlans();

      res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const plan =
        await subscriptionService.getPlan(
          String(req.params.planId)
        );

      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      next(error);
    }
  }

  async createSubscription(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        createSubscriptionSchema.parse(
          req.body
        );

      const subscription =
        await subscriptionService.createSubscription(
          input,
          req.user!.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Subscription created successfully.",
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const subscription =
        await subscriptionService.getSubscription(
          String(req.params.restaurantId)
        );

      res.status(200).json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePlan(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        changePlanSchema.parse(
          req.body
        );

      const subscription =
        await subscriptionService.changePlan(
          String(
            req.params.restaurantId
          ),
          input,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Subscription plan changed successfully.",
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        cancelSubscriptionSchema.parse(
          req.body
        );

      const subscription =
        await subscriptionService.cancelSubscription(
          String(
            req.params.restaurantId
          ),
          input.cancelImmediately,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Subscription cancelled successfully.",
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }

  async renew(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const subscription =
        await subscriptionService.renewSubscription(
          String(
            req.params.restaurantId
          ),
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Subscription renewed successfully.",
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const subscription =
        await subscriptionService.checkStatus(
          String(
            req.params.restaurantId
          )
        );

      res.status(200).json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const subscriptionController =
  new SubscriptionController();