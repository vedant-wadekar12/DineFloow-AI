import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateEmployeeStatusSchema,
} from "../validators/employee.validator";

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
      const data =
        createEmployeeSchema.parse(req.body);

      const employee =
        await employeeService.createEmployee(
          data,
          req.user?.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Employee created successfully.",
        data: employee,
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
      const employees =
        await employeeService.getAllEmployees();

      res.status(200).json({
        success: true,
        data: employees,
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
      const employee =
        await employeeService.getEmployee(
          String(req.params.employeeId)
        );

      res.status(200).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByRestaurant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const employees =
        await employeeService.getEmployeesByRestaurant(
          String(req.params.restaurantId)
        );

      res.status(200).json({
        success: true,
        data: employees,
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
      const employees =
        await employeeService.getEmployeesByBranch(
          String(req.params.branchId)
        );

      res.status(200).json({
        success: true,
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
      const data =
        updateEmployeeSchema.parse(req.body);

      const employee =
        await employeeService.updateEmployee(
          String(req.params.employeeId),
          data,
          req.user?.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Employee updated successfully.",
        data: employee,
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
      const data =
        updateEmployeeStatusSchema.parse(
          req.body
        );

      const employee =
        await employeeService.updateStatus(
          String(req.params.employeeId),
          data.status
        );

      res.status(200).json({
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
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result =
        await employeeService.deleteEmployee(
          String(req.params.employeeId)
        );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const employeeController =
  new EmployeeController();