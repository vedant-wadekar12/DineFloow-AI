import { Types } from "mongoose";
import {
  ConflictError,
  NotFoundError,
} from "../../../common/errors";
import { restaurantRepository } from "../../restaurants/repositories/restaurant.repository";
import { branchRepository } from "../../branches/repositories/branch.repository";
import { supplierRepository } from "../repositories/supplier.repository";

export class SupplierService {
  async create(
    payload: {
      restaurantId: string;
      branchId?: string;
      name: string;
      companyName?: string;
      email?: string;
      phone: string;
      address?: string;
      city?: string;
      state?: string;
      pincode?: string;
      gstNumber?: string;
      contactPerson?: string;
      notes?: string;
    },
    createdBy: string
  ) {
    const restaurant =
      await restaurantRepository.findById(
        payload.restaurantId
      );

    if (!restaurant) {
      throw new NotFoundError("Restaurant not found.");
    }

    if (payload.branchId) {
      const branch =
        await branchRepository.findById(
          payload.branchId
        );

      if (!branch) {
        throw new NotFoundError("Branch not found.");
      }

      if (
        branch.restaurantId.toString() !==
        payload.restaurantId
      ) {
        throw new ConflictError(
          "Branch does not belong to the selected restaurant."
        );
      }
    }

    return supplierRepository.create({
      ...payload,
      restaurantId: new Types.ObjectId(
        payload.restaurantId
      ),
      branchId: payload.branchId
        ? new Types.ObjectId(payload.branchId)
        : undefined,
      createdBy: new Types.ObjectId(createdBy),
      isActive: true,
      isDeleted: false,
    });
  }

  async getAll(filters: {
    restaurantId?: string;
    branchId?: string;
    isActive?: boolean;
  }) {
    return supplierRepository.findAll(filters);
  }

  async getById(id: string) {
    const supplier =
      await supplierRepository.findById(id);

    if (!supplier) {
      throw new NotFoundError("Supplier not found.");
    }

    return supplier;
  }

  async update(
    id: string,
    payload: Partial<{
      branchId: string;
      name: string;
      companyName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      gstNumber: string;
      contactPerson: string;
      notes: string;
    }>,
    updatedBy: string
  ) {
    const supplier =
      await supplierRepository.findById(id);

    if (!supplier) {
      throw new NotFoundError("Supplier not found.");
    }

    const updateData: Record<string, unknown> = {
      ...payload,
      updatedBy: new Types.ObjectId(updatedBy),
    };

    if (payload.branchId) {
      const branch =
        await branchRepository.findById(
          payload.branchId
        );

      if (!branch) {
        throw new NotFoundError("Branch not found.");
      }

      if (
        branch.restaurantId.toString() !==
        supplier.restaurantId.toString()
      ) {
        throw new ConflictError(
          "Branch does not belong to the supplier's restaurant."
        );
      }

      updateData.branchId = new Types.ObjectId(
        payload.branchId
      );
    }

    return supplierRepository.update(
      id,
      updateData
    );
  }

  async updateStatus(
    id: string,
    isActive: boolean,
    updatedBy: string
  ) {
    const supplier =
      await supplierRepository.updateStatus(
        id,
        isActive,
        updatedBy
      );

    if (!supplier) {
      throw new NotFoundError("Supplier not found.");
    }

    return supplier;
  }

  async delete(id: string, deletedBy: string) {
    const supplier =
      await supplierRepository.softDelete(
        id,
        deletedBy
      );

    if (!supplier) {
      throw new NotFoundError("Supplier not found.");
    }

    return supplier;
  }
}

export const supplierService =
  new SupplierService();