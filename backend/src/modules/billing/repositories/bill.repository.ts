import { Types } from "mongoose";
import { Bill, IBill, BillStatus } from "../models/bill.model";

class BillRepository {
  async create(data: Partial<IBill>): Promise<IBill> {
    return Bill.create(data);
  }

  async findById(
    billId: string | Types.ObjectId
  ): Promise<IBill | null> {
    return Bill.findById(billId);
  }

  async findByOrderId(
    orderId: string | Types.ObjectId
  ): Promise<IBill | null> {
    return Bill.findOne({ orderId });
  }

  async findByBillNumber(
    billNumber: string
  ): Promise<IBill | null> {
    return Bill.findOne({ billNumber });
  }

  async findAll(filter: Record<string, unknown>): Promise<IBill[]> {
    return Bill.find(filter).sort({ createdAt: -1 });
  }

  async updateById(
    billId: string,
    data: Partial<IBill>
  ): Promise<IBill | null> {
    return Bill.findByIdAndUpdate(
      billId,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updatePayment(
    billId: string,
    paidAmount: number,
    status: BillStatus,
    paidAt?: Date
  ): Promise<IBill | null> {
    const update: Partial<IBill> = {
      paidAmount,
      status,
    };

    if (paidAt) {
      update.paidAt = paidAt;
    }

    return Bill.findByIdAndUpdate(
      billId,
      update,
      {
        new: true,
        runValidators: true,
      }
    );
  }
}

export const billRepository = new BillRepository();