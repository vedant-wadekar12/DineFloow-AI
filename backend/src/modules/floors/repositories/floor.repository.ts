import { Types } from "mongoose";

import {
  Floor,
  IFloor,
} from "../models/floor.model";

export class FloorRepository {
  async create(
    payload: Partial<IFloor>
  ): Promise<IFloor> {
    return await Floor.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IFloor | null> {
    return await Floor.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findByCode(
    branchId: string | Types.ObjectId,
    code: string
  ): Promise<IFloor | null> {
    return await Floor.findOne({
      branchId,
      code,
      isDeleted: false,
    });
  }

  async findByBranch(
    branchId: string | Types.ObjectId
  ): Promise<IFloor[]> {
    return await Floor.find({
      branchId,
      isDeleted: false,
    }).sort({
      floorNumber: 1,
    });
  }

  async findAll(): Promise<IFloor[]> {
    return await Floor.find({
      isDeleted: false,
    }).sort({
      floorNumber: 1,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IFloor>
  ): Promise<IFloor | null> {
    return await Floor.findOneAndUpdate(
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
    isActive: boolean
  ): Promise<IFloor | null> {
    return await Floor.findOneAndUpdate(
      {
        _id: id,
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
    id: string | Types.ObjectId
  ): Promise<void> {
    await Floor.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          isActive: false,
        },
      }
    );
  }
}

export const floorRepository =
  new FloorRepository();