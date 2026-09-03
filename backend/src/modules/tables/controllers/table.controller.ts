import {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../../../common/interfaces";

import {
  tableService,
} from "../services/table.service";

export class TableController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const table =
        await tableService.create(
          req.body,
          String(req.user!.userId)
        );

      return res.status(201).json({
        success: true,
        message: "Table created successfully.",
        data: table,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tables =
        await tableService.getAll();

      return res.status(200).json({
        success: true,
        message: "Tables retrieved successfully.",
        data: tables,
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
      const table =
        await tableService.getById(
          String(req.params.tableId)
        );

      return res.status(200).json({
        success: true,
        message: "Table retrieved successfully.",
        data: table,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByFloor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tables =
        await tableService.getByFloor(
          String(req.params.floorId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Floor tables retrieved successfully.",
        data: tables,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByBranch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tables =
        await tableService.getByBranch(
          String(req.params.branchId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Branch tables retrieved successfully.",
        data: tables,
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
      const table =
        await tableService.update(
          String(req.params.tableId),
          req.body,
          String(req.user!.userId)
        );

      return res.status(200).json({
        success: true,
        message: "Table updated successfully.",
        data: table,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const table =
        await tableService.updateStatus(
          String(req.params.tableId),
          req.body.status
        );

      return res.status(200).json({
        success: true,
        message:
          "Table status updated successfully.",
        data: table,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateActiveStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const table =
        await tableService.updateActiveStatus(
          String(req.params.tableId),
          req.body.isActive
        );

      return res.status(200).json({
        success: true,
        message:
          "Table active status updated successfully.",
        data: table,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await tableService.delete(
        String(req.params.tableId)
      );

      return res.status(200).json({
        success: true,
        message: "Table deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const tableController =
  new TableController();