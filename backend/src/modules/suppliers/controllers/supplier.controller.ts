import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../common/interfaces";
import { supplierService } from "../services/supplier.service";

export class SupplierController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "Authentication required.",
  });
}

const userId = req.user.userId;

const supplier = await supplierService.create(
  req.body,
  userId
);

      res.status(201).json({
        success: true,
        data: supplier,
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
      const suppliers = await supplierService.getAll({
        restaurantId:
          typeof req.query.restaurantId === "string"
            ? req.query.restaurantId
            : undefined,

        branchId:
          typeof req.query.branchId === "string"
            ? req.query.branchId
            : undefined,

        isActive:
          typeof req.query.isActive === "string"
            ? req.query.isActive === "true"
            : undefined,
      });

      res.json({
        success: true,
        data: suppliers,
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
      const supplier = await supplierService.getById(
        String(req.params.supplierId)
      );

      res.json({
        success: true,
        data: supplier,
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
      if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "Authentication required.",
  });
}

const supplier = await supplierService.update(
  String(req.params.supplierId),
  req.body,
  req.user.userId
);

      res.json({
        success: true,
        data: supplier,
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
      if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "Authentication required.",
  });
}

const supplier = await supplierService.updateStatus(
  String(req.params.supplierId),
  req.body.isActive,
  req.user.userId
);

      res.json({
        success: true,
        data: supplier,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "Authentication required.",
  });
}

const supplier = await supplierService.delete(
  String(req.params.supplierId),
  req.user.userId
);

      res.json({
        success: true,
        data: supplier,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const supplierController =
  new SupplierController();