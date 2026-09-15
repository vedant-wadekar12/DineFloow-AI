import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AuthenticatedRequest } from "../../../common/interfaces";

import {
  createCustomerSchema,
  updateCustomerSchema,
  updateCustomerStatusSchema,
} from "../validators/customer.validator";

import {
  customerService,
} from "../services/customer.service";

export class CustomerController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data =
        createCustomerSchema.parse(
          req.body
        );

      const customer =
        await customerService.createCustomer(
          data,
          req.user?.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Customer created successfully.",
        data: customer,
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
      const customers =
        await customerService.getAllCustomers();

      res.status(200).json({
        success: true,
        data: customers,
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
      const customer =
        await customerService.getCustomer(
          String(req.params.customerId)
        );

      res.status(200).json({
        success: true,
        data: customer,
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
      const customers =
        await customerService.getCustomersByRestaurant(
          String(req.params.restaurantId)
        );

      res.status(200).json({
        success: true,
        data: customers,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByPhone(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const customer =
        await customerService.getCustomerByPhone(
          String(req.params.restaurantId),
          String(req.params.phone)
        );

      res.status(200).json({
        success: true,
        data: customer,
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
        updateCustomerSchema.parse(
          req.body
        );

      const customer =
        await customerService.updateCustomer(
          String(req.params.customerId),
          data,
          req.user?.userId
        );

      res.status(200).json({
        success: true,
        message:
          "Customer updated successfully.",
        data: customer,
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
        updateCustomerStatusSchema.parse(
          req.body
        );

      const customer =
        await customerService.updateStatus(
          String(req.params.customerId),
          data.status
        );

      res.status(200).json({
        success: true,
        message:
          "Customer status updated successfully.",
        data: customer,
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
        await customerService.deleteCustomer(
          String(req.params.customerId)
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

export const customerController =
  new CustomerController();