import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces/authenticated-request.interface";

import {
  createOfferSchema,
  updateOfferSchema,
  offerStatusSchema,
  calculateOfferSchema,
} from "../validators/offer.validator";

import {
  offerService,
} from "../services/offer.service";

class OfferController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        createOfferSchema.parse(
          req.body
        );

      const offer =
        await offerService.createOffer(
          input,
          req.user!.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Offer created successfully.",
        data: offer,
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
          ? String(
              req.query.branchId
            )
          : undefined;

      const offers =
        await offerService.getOffers(
          restaurantId,
          branchId
        );

      res.status(200).json({
        success: true,
        data: offers,
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
      const offer =
        await offerService.getOffer(
          String(req.params.offerId)
        );

      res.status(200).json({
        success: true,
        data: offer,
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
        updateOfferSchema.parse(
          req.body
        );

      const offer =
        await offerService.updateOffer(
          String(req.params.offerId),
          input,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Offer updated successfully.",
        data: offer,
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
        offerStatusSchema.parse(
          req.body
        );

      const offer =
        await offerService.updateStatus(
          String(req.params.offerId),
          input.isActive,
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Offer status updated successfully.",
        data: offer,
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
      const offer =
        await offerService.deleteOffer(
          String(req.params.offerId),
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Offer deleted successfully.",
        data: offer,
      });
    } catch (error) {
      next(error);
    }
  }

  async calculate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input =
        calculateOfferSchema.parse(
          req.body
        );

      const result =
        await offerService.calculateOffer(
          input.offerId,
          input.orderAmount
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

export const offerController =
  new OfferController();