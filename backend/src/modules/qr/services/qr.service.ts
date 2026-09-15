import crypto from "crypto";
import QRCodeGenerator from "qrcode";
import { Types } from "mongoose";

import { BadRequestError, NotFoundError } from "../../../common/errors";

import { restaurantRepository } from "../../restaurants";
import { branchRepository } from "../../branches";
import { floorRepository } from "../../floors";
import { tableRepository } from "../../tables";

import { qrRepository } from "../repositories/qr.repository";
import { CreateQRDto } from "../dto/qr.dto";

export class QRService {
  private getFrontendBaseUrl(): string {
    return (
      process.env.FRONTEND_URL ||
      "http://localhost:5173"
    ).replace(/\/$/, "");
  }

  private generateToken(): string {
    return crypto.randomBytes(24).toString("hex");
  }

  async createQR(
    data: CreateQRDto,
    userId?: string
  ) {
    if (
      !Types.ObjectId.isValid(data.restaurantId) ||
      !Types.ObjectId.isValid(data.branchId) ||
      !Types.ObjectId.isValid(data.floorId) ||
      !Types.ObjectId.isValid(data.tableId)
    ) {
      throw new BadRequestError(
        "Invalid restaurant, branch, floor or table ID."
      );
    }

    const restaurant =
      await restaurantRepository.findById(
        data.restaurantId
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    const branch =
      await branchRepository.findById(
        data.branchId
      );

    if (!branch) {
      throw new NotFoundError(
        "Branch not found."
      );
    }

    if (
      branch.restaurantId.toString() !==
      data.restaurantId
    ) {
      throw new BadRequestError(
        "Branch does not belong to this restaurant."
      );
    }

    const floor =
      await floorRepository.findById(
        data.floorId
      );

    if (!floor) {
      throw new NotFoundError(
        "Floor not found."
      );
    }

    if (
      floor.branchId.toString() !==
      data.branchId
    ) {
      throw new BadRequestError(
        "Floor does not belong to this branch."
      );
    }

    const table =
      await tableRepository.findById(
        data.tableId
      );

    if (!table) {
      throw new NotFoundError(
        "Table not found."
      );
    }

    if (
      table.floorId.toString() !==
      data.floorId
    ) {
      throw new BadRequestError(
        "Table does not belong to this floor."
      );
    }

    const existing =
      await qrRepository.findByTableId(
        data.tableId
      );

    if (existing) {
      return existing;
    }

    const qrToken = this.generateToken();

    const tableNumber = String(
      table.tableNumber
    );

    const redirectUrl =
      `${this.getFrontendBaseUrl()}/r/` +
      `${data.restaurantId}/table/${encodeURIComponent(
        tableNumber
      )}`;

    const qrImage =
      await QRCodeGenerator.toDataURL(
        redirectUrl,
        {
          width: 500,
          margin: 2,
          errorCorrectionLevel: "H",
        }
      );

    return await qrRepository.create({
      restaurantId:
        new Types.ObjectId(data.restaurantId),

      branchId:
        new Types.ObjectId(data.branchId),

      floorId:
        new Types.ObjectId(data.floorId),

      tableId:
        new Types.ObjectId(data.tableId),

      tableNumber,

      type: "TABLE",

      qrToken,

      redirectUrl,

      qrImage,

      isActive: true,

      isDeleted: false,

      createdBy: userId
        ? new Types.ObjectId(userId)
        : undefined,
    });
  }

  async regenerateQR(
    tableId: string,
    userId?: string
  ) {
    const qr =
      await qrRepository.findByTableId(
        tableId
      );

    if (!qr) {
      throw new NotFoundError(
        "QR code not found for this table."
      );
    }

    const qrToken = this.generateToken();

    const redirectUrl =
      `${this.getFrontendBaseUrl()}/r/` +
      `${qr.restaurantId}/table/${encodeURIComponent(
        qr.tableNumber
      )}`;

    const qrImage =
      await QRCodeGenerator.toDataURL(
        redirectUrl,
        {
          width: 500,
          margin: 2,
          errorCorrectionLevel: "H",
        }
      );

    return await qrRepository.update(
      qr._id,
      {
        qrToken,
        redirectUrl,
        qrImage,
        updatedBy: userId
          ? new Types.ObjectId(userId)
          : undefined,
      }
    );
  }

  async getQRById(id: string) {
    const qr =
      await qrRepository.findById(id);

    if (!qr) {
      throw new NotFoundError(
        "QR code not found."
      );
    }

    return qr;
  }

  async getQRByTableId(tableId: string) {
    const qr =
      await qrRepository.findByTableId(
        tableId
      );

    if (!qr) {
      throw new NotFoundError(
        "QR code not found for this table."
      );
    }

    return qr;
  }

  async getQRByToken(token: string) {
    const qr =
      await qrRepository.findByToken(token);

    if (!qr) {
      throw new NotFoundError(
        "QR code is invalid or inactive."
      );
    }

    return {
      restaurantId: qr.restaurantId,
      branchId: qr.branchId,
      floorId: qr.floorId,
      tableId: qr.tableId,
      tableNumber: qr.tableNumber,
      redirectUrl: qr.redirectUrl,
    };
  }

  async getAllQRs() {
    return await qrRepository.findAll();
  }

  async getQRsByRestaurant(
    restaurantId: string
  ) {
    return await qrRepository.findByRestaurant(
      restaurantId
    );
  }

  async getQRsByBranch(
    branchId: string
  ) {
    return await qrRepository.findByBranch(
      branchId
    );
  }

  async updateStatus(
    id: string,
    isActive: boolean
  ) {
    const qr =
      await qrRepository.updateStatus(
        id,
        isActive
      );

    if (!qr) {
      throw new NotFoundError(
        "QR code not found."
      );
    }

    return qr;
  }

  async deleteQR(id: string) {
    const qr =
      await qrRepository.findById(id);

    if (!qr) {
      throw new NotFoundError(
        "QR code not found."
      );
    }

    await qrRepository.softDelete(id);

    return {
      message: "QR code deleted successfully.",
    };
  }
}

export const qrService = new QRService();