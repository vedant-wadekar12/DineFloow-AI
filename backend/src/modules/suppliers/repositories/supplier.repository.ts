import { Types } from "mongoose";
import { Supplier, ISupplier } from "../models/supplier.model";

export class SupplierRepository {
  async create(data: Partial<ISupplier>) {
    return Supplier.create(data);
  }

  async findById(id: string) {
    return Supplier.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findAll(filters: {
    restaurantId?: string;
    branchId?: string;
    isActive?: boolean;
  }) {
    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (filters.restaurantId) {
      query.restaurantId = new Types.ObjectId(filters.restaurantId);
    }

    if (filters.branchId) {
      query.branchId = new Types.ObjectId(filters.branchId);
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    return Supplier.find(query).sort({
      createdAt: -1,
    });
  }

  async update(id: string, data: Partial<ISupplier>) {
    return Supplier.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async softDelete(id: string, userId?: string) {
    return Supplier.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          updatedBy: userId
            ? new Types.ObjectId(userId)
            : undefined,
        },
      },
      {
        new: true,
      }
    );
  }

  async updateStatus(
    id: string,
    isActive: boolean,
    userId?: string
  ) {
    return Supplier.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isActive,
          updatedBy: userId
            ? new Types.ObjectId(userId)
            : undefined,
        },
      },
      {
        new: true,
      }
    );
  }
}

export const supplierRepository = new SupplierRepository();