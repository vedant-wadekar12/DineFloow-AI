import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../common/interfaces";

import { kitchenService } from "../services/kitchen.service";

export class KitchenController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ticket =
        await kitchenService.createFromOrder(
          req.body
        );

      res.status(201).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tickets =
        await kitchenService.getAll({
          restaurantId:
            typeof req.query.restaurantId ===
            "string"
              ? req.query.restaurantId
              : undefined,

          branchId:
            typeof req.query.branchId ===
            "string"
              ? req.query.branchId
              : undefined,

          status:
            typeof req.query.status ===
            "string"
              ? req.query.status
              : undefined,
        });

      res.json({
        success: true,
        data: tickets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ticket =
        await kitchenService.getById(
          String(req.params.ticketId)
        );

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async assignChef(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ticket =
        await kitchenService.assignChef(
          String(req.params.ticketId),
          req.body
        );

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async accept(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ticket =
        await kitchenService.accept(
          String(req.params.ticketId),
          req.user!.userId
        );

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async startPreparing(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ticket =
        await kitchenService.startPreparing(
          String(req.params.ticketId),
          req.user!.userId
        );

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async markReady(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ticket =
        await kitchenService.markReady(
          String(req.params.ticketId)
        );

      res.json({
        success: true,
        data: ticket,
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
      const ticket =
        await kitchenService.cancel(
          String(req.params.ticketId),
          req.body
        );

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePriority(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ticket =
        await kitchenService.updatePriority(
          String(req.params.ticketId),
          req.body
        );

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const kitchenController =
  new KitchenController();