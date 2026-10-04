import { Types } from "mongoose";
import { Floor, IFloor } from "../models/floor.model";

export class FloorRepository {
  async create(payload: Partial<IFloor>): Promise<IFloor> {
    return Floor.create(payload);
  }

  async findById(id: string | Types.ObjectId, restaurantId?: string | Types.ObjectId) {
    return Floor.findOne({ _id: id, ...(restaurantId ? { restaurantId } : {}), isDeleted: false });
  }

  async findByCode(branchId: string | Types.ObjectId, code: string, restaurantId?: string | Types.ObjectId) {
    return Floor.findOne({ branchId, ...(restaurantId ? { restaurantId } : {}), code, isDeleted: false });
  }

  async findByBranch(branchId: string | Types.ObjectId, restaurantId?: string | Types.ObjectId) {
    return Floor.find({ branchId, ...(restaurantId ? { restaurantId } : {}), isDeleted: false }).sort({ floorNumber: 1 });
  }

  async findAll(restaurantId?: string | Types.ObjectId) {
    return Floor.find({ ...(restaurantId ? { restaurantId } : {}), isDeleted: false }).sort({ floorNumber: 1 });
  }

  async update(id: string | Types.ObjectId, restaurantId: string | Types.ObjectId, payload: Partial<IFloor>) {
    return Floor.findOneAndUpdate({ _id: id, restaurantId, isDeleted: false }, { $set: payload }, { new: true, runValidators: true });
  }

  async updateStatus(id: string | Types.ObjectId, restaurantId: string | Types.ObjectId, isActive: boolean) {
    return Floor.findOneAndUpdate({ _id: id, restaurantId, isDeleted: false }, { $set: { isActive } }, { new: true });
  }

  async softDelete(id: string | Types.ObjectId, restaurantId: string | Types.ObjectId): Promise<void> {
    await Floor.findOneAndUpdate({ _id: id, restaurantId, isDeleted: false }, { $set: { isDeleted: true, isActive: false } });
  }
}

export const floorRepository = new FloorRepository();
