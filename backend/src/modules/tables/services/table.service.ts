import { Types } from "mongoose";
import { ConflictError, NotFoundError } from "../../../common/errors";

import { branchRepository } from "../../branches/repositories/branch.repository";

import { floorRepository } from "../../floors/repositories/floor.repository";

import { tableRepository } from "../repositories/table.repository";

export class TableService {
  async create(
    payload: {
      branchId: string;
      floorId: string;
      name: string;
      tableNumber: number;
      capacity: number;
      position?: {
        x: number;
        y: number;
      };
    },
    createdBy: string,
  ) {
    const branch = await branchRepository.findById(payload.branchId);

    if (!branch) {
      throw new NotFoundError("Branch not found.");
    }

    const floor = await floorRepository.findById(payload.floorId);

    if (!floor) {
      throw new NotFoundError("Floor not found.");
    }

    if (floor.branchId.toString() !== payload.branchId) {
      throw new ConflictError("Floor does not belong to the selected branch.");
    }

    const existing = await tableRepository.findByNumber(
      payload.floorId,
      payload.tableNumber,
    );

    if (existing) {
      throw new ConflictError("Table number already exists on this floor.");
    }

    return await tableRepository.create({
      ...payload,
      branchId: new Types.ObjectId(payload.branchId),
      floorId: new Types.ObjectId(payload.floorId),
      status: "AVAILABLE",
      isActive: true,
      isDeleted: false,
      createdBy: new Types.ObjectId(createdBy),
    });
  }

  async getAll() {
    return await tableRepository.findAll();
  }

  async getById(id: string) {
    const table = await tableRepository.findById(id);

    if (!table) {
      throw new NotFoundError("Table not found.");
    }

    return table;
  }

  async getByFloor(floorId: string) {
    const floor = await floorRepository.findById(floorId);

    if (!floor) {
      throw new NotFoundError("Floor not found.");
    }

    return await tableRepository.findByFloor(floorId);
  }

  async getByBranch(branchId: string) {
    const branch = await branchRepository.findById(branchId);

    if (!branch) {
      throw new NotFoundError("Branch not found.");
    }

    return await tableRepository.findByBranch(branchId);
  }

  async update(
    id: string,
    payload: {
      name?: string;
      tableNumber?: number;
      capacity?: number;
      position?: {
        x: number;
        y: number;
      };
    },
    updatedBy: string,
  ) {
    const table = await tableRepository.findById(id);

    if (!table) {
      throw new NotFoundError("Table not found.");
    }

    if (payload.tableNumber && payload.tableNumber !== table.tableNumber) {
      const existing = await tableRepository.findByNumber(
        table.floorId,
        payload.tableNumber,
      );

      if (existing && existing._id.toString() !== id) {
        throw new ConflictError("Table number already exists on this floor.");
      }
    }

    return await tableRepository.update(id, {
      ...payload,
      updatedBy: new Types.ObjectId(updatedBy),
    });
  }

  async updateStatus(
    id: string,
    status:
      | "AVAILABLE"
      | "OCCUPIED"
      | "RESERVED"
      | "CLEANING"
      | "OUT_OF_SERVICE",
  ) {
    const table = await tableRepository.updateStatus(id, status);

    if (!table) {
      throw new NotFoundError("Table not found.");
    }

    return table;
  }

  async updateActiveStatus(id: string, isActive: boolean) {
    const table = await tableRepository.updateActiveStatus(id, isActive);

    if (!table) {
      throw new NotFoundError("Table not found.");
    }

    return table;
  }

  async delete(id: string) {
    const table = await tableRepository.findById(id);

    if (!table) {
      throw new NotFoundError("Table not found.");
    }

    await tableRepository.softDelete(id);
  }
}

export const tableService = new TableService();
