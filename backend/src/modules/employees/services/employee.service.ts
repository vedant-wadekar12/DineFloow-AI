import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import { User } from "../../auth/models/user.model";
import { restaurantRepository } from "../../restaurants";
import { branchRepository } from "../../branches";

import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../dto/employee.dto";

import {
  employeeRepository,
} from "../repositories/employee.repository";

export class EmployeeService {
  async createEmployee(
    data: CreateEmployeeDto,
    createdBy?: string,
    currentRestaurantId?: string
  ) {
    if (
      !Types.ObjectId.isValid(data.userId) ||
      !Types.ObjectId.isValid(data.restaurantId)
    ) {
      throw new BadRequestError(
        "Invalid user or restaurant ID."
      );
    }

    if (currentRestaurantId && data.restaurantId !== currentRestaurantId) {
      throw new BadRequestError("Restaurant does not match the authenticated tenant.");
    }

    if (
      data.branchId &&
      !Types.ObjectId.isValid(data.branchId)
    ) {
      throw new BadRequestError(
        "Invalid branch ID."
      );
    }

    const user = await User.findOne({
      _id: data.userId,
      isDeleted: false,
      ...(currentRestaurantId ? { restaurantId: currentRestaurantId } : {}),
    });

    if (!user) {
      throw new NotFoundError(
        "User not found."
      );
    }

    const restaurant =
      await restaurantRepository.findById(
        data.restaurantId
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    if (data.branchId) {
      const branch =
        await branchRepository.findById(
          data.branchId
        );

      if (!branch) {
        throw new NotFoundError(
          "Branch not found."
        );
      }

      if (
        branch.restaurantId.toString() !==
        data.restaurantId
      ) {
        throw new BadRequestError(
          "Branch does not belong to this restaurant."
        );
      }
    }

    const existingUser =
      await employeeRepository.findByUserId(
        data.userId,
        data.restaurantId
      );

    if (existingUser) {
      throw new BadRequestError(
        "This user is already registered as an employee."
      );
    }

    const existingCode =
      await employeeRepository.findByEmployeeCode(
        data.restaurantId,
        data.employeeCode
      );

    if (existingCode) {
      throw new BadRequestError(
        "Employee code already exists."
      );
    }

    return await employeeRepository.create({
      ...data,

      employeeCode:
        data.employeeCode.toUpperCase(),

      restaurantId:
        new Types.ObjectId(data.restaurantId),

      branchId: data.branchId
        ? new Types.ObjectId(data.branchId)
        : undefined,

      userId:
        new Types.ObjectId(data.userId),

      createdBy: createdBy
        ? new Types.ObjectId(createdBy)
        : undefined,
    });
  }

  async getEmployee(
    id: string,
    restaurantId: string
  ) {
    const employee =
      await employeeRepository.findById(
        id,
        restaurantId
      );

    if (!employee) {
      throw new NotFoundError(
        "Employee not found."
      );
    }

    return employee;
  }

  async getAllEmployees(
    restaurantId: string
  ) {
    return await employeeRepository.findAll(
      restaurantId
    );
  }

  async getEmployeesByRestaurant(
    restaurantId: string
  ) {
    if (!Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestError(
        "Invalid restaurant ID."
      );
    }

    return await employeeRepository.findByRestaurant(
      restaurantId
    );
  }

  async getEmployeesByBranch(
    branchId: string,
    restaurantId?: string
  ) {
    if (!Types.ObjectId.isValid(branchId)) {
      throw new BadRequestError(
        "Invalid branch ID."
      );
    }

    return await employeeRepository.findByBranch(
      branchId,
      restaurantId
    );
  }

  async updateEmployee(
    id: string,
    data: UpdateEmployeeDto,
    updatedBy?: string,
    restaurantId?: string
  ) {
    if (!restaurantId) {
      throw new BadRequestError(
        "Restaurant context is required."
      );
    }

    const employee =
      await employeeRepository.findById(
        id,
        restaurantId
      );

    if (!employee) {
      throw new NotFoundError(
        "Employee not found."
      );
    }

    if (
      data.branchId &&
      !Types.ObjectId.isValid(data.branchId)
    ) {
      throw new BadRequestError(
        "Invalid branch ID."
      );
    }

    if (data.branchId) {
      const branch =
        await branchRepository.findById(
          data.branchId
        );

      if (!branch) {
        throw new NotFoundError(
          "Branch not found."
        );
      }

      if (
        branch.restaurantId.toString() !==
        employee.restaurantId.toString()
      ) {
        throw new BadRequestError(
          "Branch does not belong to this restaurant."
        );
      }
    }

    if (data.employeeCode) {
      const existing =
        await employeeRepository.findByEmployeeCode(
          employee.restaurantId,
          data.employeeCode
        );

      if (
        existing &&
        existing._id.toString() !== id
      ) {
        throw new BadRequestError(
          "Employee code already exists."
        );
      }
    }

    return await employeeRepository.update(
      id,
      restaurantId,
      {
        ...data,
        employeeCode:
          data.employeeCode?.toUpperCase(),
        branchId: data.branchId
          ? new Types.ObjectId(data.branchId)
          : undefined,
        updatedBy: updatedBy
          ? new Types.ObjectId(updatedBy)
          : undefined,
      }
    );
  }

  async updateStatus(
    id: string,
    status:
      | "ACTIVE"
      | "INACTIVE"
      | "SUSPENDED"
      | "TERMINATED",
    restaurantId: string
  ) {
    const isActive =
      status === "ACTIVE";

    const employee =
      await employeeRepository.updateStatus(
        id,
        restaurantId,
        status,
        isActive
      );

    if (!employee) {
      throw new NotFoundError(
        "Employee not found."
      );
    }

    return employee;
  }

  async deleteEmployee(
    id: string,
    restaurantId: string
  ) {
    const employee =
      await employeeRepository.findById(
        id,
        restaurantId
      );

    if (!employee) {
      throw new NotFoundError(
        "Employee not found."
      );
    }

    await employeeRepository.softDelete(
      id,
      restaurantId
    );

    return {
      message:
        "Employee deleted successfully.",
    };
  }
}

export const employeeService =
  new EmployeeService();