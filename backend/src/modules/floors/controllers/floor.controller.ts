import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../../../common/interfaces";
import { floorService } from "../services/floor.service";

export class FloorController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { const floor = await floorService.create(req.body, String(req.user!.userId), String(req.user!.restaurantId)); return res.status(201).json({ success: true, message: "Floor created successfully.", data: floor }); } catch (error) { next(error); }
  }
  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { const floors = await floorService.getAll(String(req.user!.restaurantId)); return res.status(200).json({ success: true, message: "Floors retrieved successfully.", data: floors }); } catch (error) { next(error); }
  }
  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { const floor = await floorService.getById(String(req.params.floorId), String(req.user!.restaurantId)); return res.status(200).json({ success: true, message: "Floor retrieved successfully.", data: floor }); } catch (error) { next(error); }
  }
  async getByBranch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { const floors = await floorService.getByBranch(String(req.params.branchId), String(req.user!.restaurantId)); return res.status(200).json({ success: true, message: "Branch floors retrieved successfully.", data: floors }); } catch (error) { next(error); }
  }
  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { const floor = await floorService.update(String(req.params.floorId), req.body, String(req.user!.userId), String(req.user!.restaurantId)); return res.status(200).json({ success: true, message: "Floor updated successfully.", data: floor }); } catch (error) { next(error); }
  }
  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { const floor = await floorService.updateStatus(String(req.params.floorId), req.body.isActive, String(req.user!.restaurantId)); return res.status(200).json({ success: true, message: "Floor status updated successfully.", data: floor }); } catch (error) { next(error); }
  }
  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { await floorService.delete(String(req.params.floorId), String(req.user!.restaurantId)); return res.status(200).json({ success: true, message: "Floor deleted successfully." }); } catch (error) { next(error); }
  }
}
export const floorController = new FloorController();
