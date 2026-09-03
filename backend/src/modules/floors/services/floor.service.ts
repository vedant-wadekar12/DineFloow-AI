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
} from "../repositories/floor.repository";

export class FloorService {
  async create(
  payload: {
    branchId: string;
    name: string;
    code: string;
    description?: string;
    floorNumber: number;
  },
  createdBy: string
) {
  const branch =
    await branchRepository.findById(
      payload.branchId
    );

  if (!branch) {
    throw new NotFoundError(
      "Branch not found."
    );
  }

  const existing =
    await floorRepository.findByCode(
      payload.branchId,
      payload.code.toUpperCase()
    );

  if (existing) {
    throw new ConflictError(
      "Floor code already exists in this branch."
    );
  }

    return await floorRepository.create({
      ...payload,
      branchId: new Types.ObjectId(payload.branchId),
      code: payload.code.toUpperCase(),
      createdBy: new Types.ObjectId(createdBy),
      isActive: true,
      isDeleted: false,
    });
  }

  async getAll() {
    return await floorRepository.findAll();
  }

  async getById(id: string) {
    const floor =
      await floorRepository.findById(id);

    if (!floor) {
      throw new NotFoundError(
        "Floor not found."
      );
    }

    return floor;
  }

  async getByBranch(branchId: string) {
    const branch =
      await branchRepository.findById(
        branchId
      );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    return await floorRepository.findByBranch(
      branchId
    );
  }

  async update(
    id: string,
    payload: {
      name?: string;
      code?: string;
      description?: string;
      floorNumber?: number;
    },
    updatedBy: string
  ) {
    const floor =
      await floorRepository.findById(id);

    if (!floor) {
      throw new NotFoundError(
        "Floor not found."
      );
    }

    if (payload.code) {
      const code =
        payload.code.toUpperCase();

      const existing =
        await floorRepository.findByCode(
          floor.branchId,
          code
        );

      if (
        existing &&
        existing._id.toString() !== id
      ) {
        throw new ConflictError(
          "Floor code already exists."
        );
      }

      payload.code = code;
    }

    return await floorRepository.update(
      id,
      {
        ...payload,
        updatedBy: new Types.ObjectId(updatedBy),
      }
    );
  }

  async updateStatus(
    id: string,
    isActive: boolean
  ) {
    const floor =
      await floorRepository.updateStatus(
        id,
        isActive
      );

    if (!floor) {
      throw new NotFoundError(
        "Floor not found."
      );
    }

    return floor;
  }

  async delete(id: string) {
    const floor =
      await floorRepository.findById(id);

    if (!floor) {
      throw new NotFoundError(
        "Floor not found."
      );
    }

    await floorRepository.softDelete(id);
  }
}

export const floorService =
  new FloorService();