import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  waiterService,
} from "../services/waiter.service";

export class WaiterController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const task =
        await waiterService.createFromOrder(
          req.body
        );

      res.status(201).json({
        success: true,
        data: task,
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
      const tasks =
        await waiterService.getAll({
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

          waiterId:
            typeof req.query.waiterId ===
            "string"
              ? req.query.waiterId
              : undefined,

          status:
            typeof req.query.status ===
            "string"
              ? req.query.status
              : undefined,
        });

      res.json({
        success: true,
        data: tasks,
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
      const task =
        await waiterService.getById(
          String(req.params.taskId)
        );

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async assignWaiter(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const task =
        await waiterService.assignWaiter(
          String(req.params.taskId),
          req.body
        );

      res.json({
        success: true,
        data: task,
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
      const task =
        await waiterService.accept(
          String(req.params.taskId),
          req.user!.userId
        );

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async startServing(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const task =
        await waiterService.startServing(
          String(req.params.taskId),
          req.user!.userId
        );

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async markServed(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const task =
        await waiterService.markServed(
          String(req.params.taskId)
        );

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async complete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const task =
        await waiterService.completeOrder(
          String(req.params.taskId)
        );

      res.json({
        success: true,
        data: task,
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
      const task =
        await waiterService.cancel(
          String(req.params.taskId),
          req.body
        );

      res.json({
        success: true,
        data: task,
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
      const task =
        await waiterService.updatePriority(
          String(req.params.taskId),
          req.body
        );

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const waiterController =
  new WaiterController();