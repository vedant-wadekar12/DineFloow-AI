import {
  NextFunction,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  employeeService,
} from "../services/employee.service";

export class EmployeeController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const employee =
        await employeeService.createEmployee(
          req.body,
          String(req.user!.userId),
          String(req.user!.restaurantId)
        );

      return res.status(201).json({
        success: true,
        message: "Employee created successfully.",
        data: employee,
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
      const restaurantId =
        String(req.user!.restaurantId);

      const employees =
        await employeeService.getAllEmployees(
          restaurantId
        );

      return res.status(200).json({
        success: true,
        message: "Employees retrieved successfully.",
        data: employees,
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
      const employee =
        await employeeService.getEmployee(
          String(req.params.employeeId),
          String(req.user!.restaurantId)
        );

      return res.status(200).json({
        success: true,
        message: "Employee retrieved successfully.",
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByRestaurant(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const employee =
        await employeeService.getEmployeesByRestaurant(
          String(req.params.restaurantId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Restaurant employees retrieved successfully.",
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByBranch(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const employees =
        await employeeService.getEmployeesByBranch(
          String(req.params.branchId),
          String(req.user!.restaurantId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Branch employees retrieved successfully.",
        data: employees,
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
      const employee =
        await employeeService.updateEmployee(
          String(req.params.employeeId),
          req.body,
          String(req.user!.userId),
          String(req.user!.restaurantId)
        );

      return res.status(200).json({
        success: true,
        message: "Employee updated successfully.",
        data: employee,
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
      const employee =
        await employeeService.updateStatus(
          String(req.params.employeeId),
          req.body.status,
          String(req.user!.restaurantId)
        );

      return res.status(200).json({
        success: true,
        message:
          "Employee status updated successfully.",
        data: employee,
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
      await employeeService.deleteEmployee(
        String(req.params.employeeId),
        String(req.user!.restaurantId)
      );

      return res.status(200).json({
        success: true,
        message:
          "Employee deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const employeeController =
  new EmployeeController();