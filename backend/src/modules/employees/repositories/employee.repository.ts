import { Types } from "mongoose";
import {
  Employee,
  IEmployee,
} from "../models/employee.model";

export class EmployeeRepository {
  async create(
    payload: Partial<IEmployee>
  ): Promise<IEmployee> {
    return await Employee.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IEmployee | null> {
    return await Employee.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("userId")
      .populate("restaurantId")
      .populate("branchId");
  }

  async findByUserId(
    userId: string | Types.ObjectId
  ): Promise<IEmployee | null> {
    return await Employee.findOne({
      userId,
      isDeleted: false,
    });
  }

  async findByEmployeeCode(
    restaurantId: string | Types.ObjectId,
    employeeCode: string
  ): Promise<IEmployee | null> {
    return await Employee.findOne({
      restaurantId,
      employeeCode: employeeCode.toUpperCase(),
      isDeleted: false,
    });
  }

  async findAll(): Promise<IEmployee[]> {
    return await Employee.find({
      isDeleted: false,
    })
      .populate("userId")
      .populate("branchId")
      .sort({
        createdAt: -1,
      });
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ): Promise<IEmployee[]> {
    return await Employee.find({
      restaurantId,
      isDeleted: false,
    })
      .populate("userId")
      .populate("branchId")
      .sort({
        createdAt: -1,
      });
  }

  async findByBranch(
    branchId: string | Types.ObjectId
  ): Promise<IEmployee[]> {
    return await Employee.find({
      branchId,
      isDeleted: false,
    })
      .populate("userId")
      .populate("restaurantId")
      .sort({
        createdAt: -1,
      });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IEmployee>
  ): Promise<IEmployee | null> {
    return await Employee.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: payload,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateStatus(
    id: string | Types.ObjectId,
    status: string,
    isActive: boolean
  ): Promise<IEmployee | null> {
    return await Employee.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          status,
          isActive,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async softDelete(
    id: string | Types.ObjectId
  ): Promise<void> {
    await Employee.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
          status: "TERMINATED",
        },
      }
    );
  }
}

export const employeeRepository =
  new EmployeeRepository();