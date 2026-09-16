import { Types } from "mongoose";

import {
  Payment,
  IPayment,
  PaymentStatus,
} from "../models/payment.model";

class PaymentRepository {
  async create(
    data: Partial<IPayment>
  ): Promise<IPayment> {
    return Payment.create(data);
  }

  async findById(
    paymentId: string | Types.ObjectId
  ): Promise<IPayment | null> {
    return Payment.findById(paymentId);
  }

  async findByTransactionId(
    transactionId: string
  ): Promise<IPayment | null> {
    return Payment.findOne({
      transactionId,
    });
  }

  async findByBillId(
    billId: string | Types.ObjectId
  ): Promise<IPayment[]> {
    return Payment.find({
      billId,
    }).sort({
      createdAt: -1,
    });
  }

  async findAll(
    filter: Record<string, unknown>
  ): Promise<IPayment[]> {
    return Payment.find(filter).sort({
      createdAt: -1,
    });
  }

  async updateById(
    paymentId: string,
    data: Partial<IPayment>
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(
      paymentId,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }
}

export const paymentRepository =
  new PaymentRepository();