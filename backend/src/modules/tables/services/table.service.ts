import { Types } from "mongoose";

import {
  ConflictError,
  NotFoundError,
} from "../../../common/errors";

import {
  branchRepository,
} from "../../branches/repositories/branch.repository";

import {
  floorRepository,
} from "../../floors/repositories/floor.repository";

import {
  tableRepository,
} from "../repositories/table.repository";

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
    restaurantId: string
  ) {
   const branch =
  await branchRepository.findByIdAndRestaurant(
    payload.branchId,
    restaurantId
  );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    const floor =
      await floorRepository.findById(
        payload.floorId
      );

    if (!floor) {
      throw new NotFoundError(
        "Floor not found."
      );
    }

    if (
      floor.branchId.toString() !==
      payload.branchId
    ) {
      throw new ConflictError(
        "Floor does not belong to the selected branch."
      );
    }

    const existing =
      await tableRepository.findByNumber(
        payload.floorId,
        payload.tableNumber,
        restaurantId
      );

    if (existing) {
      throw new ConflictError(
        "Table number already exists on this floor."
      );
    }

    return await tableRepository.create({
      ...payload,

      restaurantId:
        new Types.ObjectId(restaurantId),

      branchId:
        new Types.ObjectId(payload.branchId),

      floorId:
        new Types.ObjectId(payload.floorId),

      status: "AVAILABLE",

      isActive: true,

      isDeleted: false,

      createdBy:
        new Types.ObjectId(createdBy),
    });
  }

  async getAll(
    restaurantId: string
  ) {
    return await tableRepository.findAll(
      restaurantId
    );
  }

  async getById(
    id: string,
    restaurantId: string
  ) {
    const table =
      await tableRepository.findById(
        id,
        restaurantId
      );

    if (!table) {
      throw new NotFoundError(
        "Table not found."
      );
    }

    return table;
  }

  async getByFloor(
    floorId: string,
    restaurantId: string
  ) {
    const floor =
      await floorRepository.findById(
        floorId
      );

    if (!floor) {
      throw new NotFoundError(
        "Floor not found."
      );
    }

    return await tableRepository.findByFloor(
      floorId,
      restaurantId
    );
  }

  async getByBranch(
    branchId: string,
    restaurantId: string
  ) {
    const branch =
  await branchRepository.findByIdAndRestaurant(
    branchId,
    restaurantId
  );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    return await tableRepository.findByBranch(
      branchId,
      restaurantId
    );
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
    restaurantId: string
  ) {
    const table =
      await tableRepository.findById(
        id,
        restaurantId
      );

    if (!table) {
      throw new NotFoundError(
        "Table not found."
      );
    }

    if (
      payload.tableNumber &&
      payload.tableNumber !==
        table.tableNumber
    ) {
      const existing =
        await tableRepository.findByNumber(
          table.floorId,
          payload.tableNumber,
          restaurantId
        );

      if (
        existing &&
        existing._id.toString() !== id
      ) {
        throw new ConflictError(
          "Table number already exists on this floor."
        );
      }
    }

    return await tableRepository.update(
      id,
      restaurantId,
      {
        ...payload,

        updatedBy:
          new Types.ObjectId(updatedBy),
      }
    );
  }

  async updateStatus(
    id: string,
    status:
      | "AVAILABLE"
      | "OCCUPIED"
      | "RESERVED"
      | "CLEANING"
      | "OUT_OF_SERVICE",
    restaurantId: string
  ) {
    const table =
      await tableRepository.updateStatus(
        id,
        restaurantId,
        status
      );

    if (!table) {
      throw new NotFoundError(
        "Table not found."
      );
    }

    return table;
  }

  async updateActiveStatus(
    id: string,
    isActive: boolean,
    restaurantId: string
  ) {
    const table =
      await tableRepository.updateActiveStatus(
        id,
        restaurantId,
        isActive
      );

    if (!table) {
      throw new NotFoundError(
        "Table not found."
      );
    }

    return table;
  }

  async delete(
    id: string,
    restaurantId: string
  ) {
    const table =
      await tableRepository.findById(
        id,
        restaurantId
      );

    if (!table) {
      throw new NotFoundError(
        "Table not found."
      );
    }

    await tableRepository.softDelete(
      id,
      restaurantId
    );
  }
}

export const tableService =
  new TableService();