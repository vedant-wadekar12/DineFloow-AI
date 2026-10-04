import { Types } from "mongoose";

import {
  ITable,
  Table,
  TableStatus,
} from "../models/table.model";

export class TableRepository {
  async create(
    payload: Partial<ITable>
  ): Promise<ITable> {
    return await Table.create(payload);
  }

  async findById(
    id: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId
  ): Promise<ITable | null> {
    return await Table.findOne({
      _id: id,
      restaurantId,
      isDeleted: false,
    });
  }

  async findByNumber(
    floorId: string | Types.ObjectId,
    tableNumber: number,
    restaurantId: string | Types.ObjectId
  ): Promise<ITable | null> {
    return await Table.findOne({
      floorId,
      tableNumber,
      restaurantId,
      isDeleted: false,
    });
  }

  async findByFloor(
    floorId: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId
  ): Promise<ITable[]> {
    return await Table.find({
      floorId,
      restaurantId,
      isDeleted: false,
    }).sort({
      tableNumber: 1,
    });
  }

  async findByBranch(
    branchId: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId
  ): Promise<ITable[]> {
    return await Table.find({
      branchId,
      restaurantId,
      isDeleted: false,
    }).sort({
      tableNumber: 1,
    });
  }

  async findAll(
    restaurantId: string | Types.ObjectId
  ): Promise<ITable[]> {
    return await Table.find({
      restaurantId,
      isDeleted: false,
    }).sort({
      tableNumber: 1,
    });
  }

  async update(
    id: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId,
    payload: Partial<ITable>
  ): Promise<ITable | null> {
    return await Table.findOneAndUpdate(
      {
        _id: id,
        restaurantId,
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
    restaurantId: string | Types.ObjectId,
    status: TableStatus
  ): Promise<ITable | null> {
    return await Table.findOneAndUpdate(
      {
        _id: id,
        restaurantId,
        isDeleted: false,
      },
      {
        $set: {
          status,
        },
      },
      {
        new: true,
      }
    );
  }

  async updateActiveStatus(
    id: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId,
    isActive: boolean
  ): Promise<ITable | null> {
    return await Table.findOneAndUpdate(
      {
        _id: id,
        restaurantId,
        isDeleted: false,
      },
      {
        $set: {
          isActive,
        },
      },
      {
        new: true,
      }
    );
  }

  async softDelete(
    id: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId
  ): Promise<void> {
    await Table.findOneAndUpdate(
      {
        _id: id,
        restaurantId,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
          status: "OUT_OF_SERVICE",
        },
      }
    );
  }
}

export const tableRepository =
  new TableRepository();