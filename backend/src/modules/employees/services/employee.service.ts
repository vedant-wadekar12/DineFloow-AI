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
    createdBy?: string
  ) {
    if (
      !Types.ObjectId.isValid(data.userId) ||
      !Types.ObjectId.isValid(data.restaurantId)
    ) {
      throw new BadRequestError(
        "Invalid user or restaurant ID."
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

    const user = await User.findOne({
      _id: data.userId,
      isDeleted: false,
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
        data.userId
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

  async getEmployee(id: string) {
    const employee =
      await employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundError(
        "Employee not found."
      );
    }

    return employee;
  }

  async getAllEmployees() {
    return await employeeRepository.findAll();
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
    branchId: string
  ) {
    if (!Types.ObjectId.isValid(branchId)) {
      throw new BadRequestError(
        "Invalid branch ID."
      );
    }

    return await employeeRepository.findByBranch(
      branchId
    );
  }

  async updateEmployee(
    id: string,
    data: UpdateEmployeeDto,
    updatedBy?: string
  ) {
    const employee =
      await employeeRepository.findById(id);

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
      | "TERMINATED"
  ) {
    const isActive =
      status === "ACTIVE";

    const employee =
      await employeeRepository.updateStatus(
        id,
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

  async deleteEmployee(id: string) {
    const employee =
      await employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundError(
        "Employee not found."
      );
    }

    await employeeRepository.softDelete(id);

    return {
      message:
        "Employee deleted successfully.",
    };
  }
}

export const employeeService =
  new EmployeeService();