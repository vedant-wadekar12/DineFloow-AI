import { Types } from "mongoose";
import { ConflictError, NotFoundError } from "../../../common/errors";
import { branchRepository } from "../../branches/repositories/branch.repository";
import { floorRepository } from "../repositories/floor.repository";

export class FloorService {
  async create(payload: { branchId: string; name: string; code: string; description?: string; floorNumber: number }, createdBy: string, restaurantId: string) {
    const branch = await branchRepository.findByIdAndRestaurant(payload.branchId, restaurantId);
    if (!branch) throw new NotFoundError("Branch not found.");
    const code = payload.code.toUpperCase();
    if (await floorRepository.findByCode(payload.branchId, code, restaurantId)) throw new ConflictError("Floor code already exists in this branch.");
    return floorRepository.create({ ...payload, restaurantId: new Types.ObjectId(restaurantId), branchId: new Types.ObjectId(payload.branchId), code, createdBy: new Types.ObjectId(createdBy), isActive: true, isDeleted: false });
  }

  getAll(restaurantId: string) { return floorRepository.findAll(restaurantId); }

  async getById(id: string, restaurantId: string) {
    const floor = await floorRepository.findById(id, restaurantId);
    if (!floor) throw new NotFoundError("Floor not found.");
    return floor;
  }

  async getByBranch(branchId: string, restaurantId: string) {
    if (!await branchRepository.findByIdAndRestaurant(branchId, restaurantId)) throw new NotFoundError("Branch not found.");
    return floorRepository.findByBranch(branchId, restaurantId);
  }

  async update(id: string, payload: { name?: string; code?: string; description?: string; floorNumber?: number }, updatedBy: string, restaurantId: string) {
    const floor = await floorRepository.findById(id, restaurantId);
    if (!floor) throw new NotFoundError("Floor not found.");
    if (payload.code) {
      const code = payload.code.toUpperCase();
      const existing = await floorRepository.findByCode(floor.branchId, code, restaurantId);
      if (existing && existing._id.toString() !== id) throw new ConflictError("Floor code already exists.");
      payload.code = code;
    }
    const updated = await floorRepository.update(id, restaurantId, { ...payload, updatedBy: new Types.ObjectId(updatedBy) });
    if (!updated) throw new NotFoundError("Floor not found.");
    return updated;
  }

  async updateStatus(id: string, isActive: boolean, restaurantId: string) {
    const floor = await floorRepository.updateStatus(id, restaurantId, isActive);
    if (!floor) throw new NotFoundError("Floor not found.");
    return floor;
  }

  async delete(id: string, restaurantId: string) {
    if (!await floorRepository.findById(id, restaurantId)) throw new NotFoundError("Floor not found.");
    await floorRepository.softDelete(id, restaurantId);
  }
}

export const floorService = new FloorService();
