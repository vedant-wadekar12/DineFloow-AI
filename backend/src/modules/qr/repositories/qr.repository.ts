import { Types } from "mongoose";
import { IQRCode, QRCode } from "../models/qr.model";

export class QRRepository {
  async create(
    payload: Partial<IQRCode>
  ): Promise<IQRCode> {
    return await QRCode.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IQRCode | null> {
    return await QRCode.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findByTableId(
    tableId: string | Types.ObjectId
  ): Promise<IQRCode | null> {
    return await QRCode.findOne({
      tableId,
      isDeleted: false,
    });
  }

  async findByToken(
    qrToken: string
  ): Promise<IQRCode | null> {
    return await QRCode.findOne({
      qrToken,
      isDeleted: false,
      isActive: true,
    });
  }

  async findByRestaurant(
    restaurantId: string | Types.ObjectId
  ): Promise<IQRCode[]> {
    return await QRCode.find({
      restaurantId,
      isDeleted: false,
    }).sort({
      tableNumber: 1,
    });
  }

  async findByBranch(
    branchId: string | Types.ObjectId
  ): Promise<IQRCode[]> {
    return await QRCode.find({
      branchId,
      isDeleted: false,
    }).sort({
      tableNumber: 1,
    });
  }

  async findAll(): Promise<IQRCode[]> {
    return await QRCode.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  async update(
    id: string | Types.ObjectId,
    payload: Partial<IQRCode>
  ): Promise<IQRCode | null> {
    return await QRCode.findOneAndUpdate(
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
  ): Promise<IQRCode | null> {
    return await QRCode.findOneAndUpdate(
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
        runValidators: true,
      }
    );
  }

  async softDelete(
    id: string | Types.ObjectId
  ): Promise<void> {
    await QRCode.findOneAndUpdate(
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

export const qrRepository = new QRRepository();