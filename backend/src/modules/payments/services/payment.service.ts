import { Types } from "mongoose";

import {
  PaymentStatus,
  IPayment,
} from "../models/payment.model";

import {
  CreatePaymentInput,
  ProcessPaymentInput,
  RefundPaymentInput,
} from "../validators/payment.validator";

import { paymentRepository } from "../repositories/payment.repository";

import { Bill } from "../../billing/models/bill.model";

import {
  NotFoundError,
  BadRequestError,
} from "../../../common/errors";

class PaymentService {
  private generatePaymentNumber(): string {
    const timestamp = Date.now();

    const random = Math.floor(
      1000 + Math.random() * 9000
    );

    return `PAY-${timestamp}-${random}`;
  }

  private async updateBillPayment(
    billId: Types.ObjectId,
    paymentAmount: number
  ) {
    const bill =
      await Bill.findById(billId);

    if (!bill) {
      throw new NotFoundError(
        "Bill not found."
      );
    }

    const newPaidAmount =
      bill.paidAmount + paymentAmount;

    if (newPaidAmount > bill.grandTotal) {
      throw new BadRequestError(
        "Payment exceeds bill amount."
      );
    }

    const dueAmount =
      bill.grandTotal - newPaidAmount;

    let status:
      | "PARTIALLY_PAID"
      | "PAID";

    if (dueAmount === 0) {
      status = "PAID";
    } else {
      status = "PARTIALLY_PAID";
    }

    bill.paidAmount = newPaidAmount;
    bill.dueAmount = dueAmount;
    bill.status = status;

    if (status === "PAID") {
      bill.paidAt = new Date();
    }

    await bill.save();

    return bill;
  }

  async createPayment(
    input: CreatePaymentInput,
    userId: string
  ): Promise<IPayment> {
    const bill =
      await Bill.findById(input.billId);

    if (!bill) {
      throw new NotFoundError(
        "Bill not found."
      );
    }

    if (
      bill.status === "CANCELLED" ||
      bill.status === "REFUNDED"
    ) {
      throw new BadRequestError(
        "Payment cannot be made for this bill."
      );
    }

    if (input.amount > bill.dueAmount) {
      throw new BadRequestError(
        "Payment amount exceeds due amount."
      );
    }

    if (
      input.transactionId
    ) {
      const existing =
        await paymentRepository.findByTransactionId(
          input.transactionId
        );

      if (existing) {
        throw new BadRequestError(
          "Transaction ID already exists."
        );
      }
    }

    const payment =
      await paymentRepository.create({
        paymentNumber:
          this.generatePaymentNumber(),

        restaurantId:
          bill.restaurantId,

        branchId:
          bill.branchId,

        orderId:
          bill.orderId,

        billId:
          bill._id,

        customerId:
          bill.customerId,

        amount:
          input.amount,

        method:
          input.method,

        status:
          input.method === "CASH"
            ? "SUCCESS"
            : "PENDING",

        transactionId:
          input.transactionId,

        gateway:
          input.gateway,

        currency:
          input.currency,

        refundAmount: 0,

        paidAt:
          input.method === "CASH"
            ? new Date()
            : undefined,

        createdBy:
          new Types.ObjectId(userId),
      });

    if (payment.status === "SUCCESS") {
      await this.updateBillPayment(
        bill._id,
        payment.amount
      );
    }

    return payment;
  }

  async getPayment(
    paymentId: string
  ): Promise<IPayment> {
    const payment =
      await paymentRepository.findById(
        paymentId
      );

    if (!payment) {
      throw new NotFoundError(
        "Payment not found."
      );
    }

    return payment;
  }

  async getPaymentsByBill(
    billId: string
  ): Promise<IPayment[]> {
    return paymentRepository.findByBillId(
      billId
    );
  }

  async getPayments(
    restaurantId?: string,
    branchId?: string,
    status?: PaymentStatus
  ): Promise<IPayment[]> {
    const filter: Record<string, unknown> = {};

    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }

    if (branchId) {
      filter.branchId = branchId;
    }

    if (status) {
      filter.status = status;
    }

    return paymentRepository.findAll(
      filter
    );
  }

  async processPayment(
    paymentId: string,
    input: ProcessPaymentInput,
    userId: string
  ): Promise<IPayment> {
    const payment =
      await this.getPayment(paymentId);

    if (
      payment.status !== "PENDING" &&
      payment.status !== "PROCESSING"
    ) {
      throw new BadRequestError(
        "This payment cannot be processed."
      );
    }

    const updated =
      await paymentRepository.updateById(
        paymentId,
        {
          status: "SUCCESS",

          transactionId:
            input.transactionId ??
            payment.transactionId,

          gatewayResponse:
            input.gatewayResponse,

          paidAt: new Date(),

          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError(
        "Payment not found."
      );
    }

    await this.updateBillPayment(
      payment.billId,
      payment.amount
    );

    return updated;
  }

  async failPayment(
    paymentId: string,
    reason: string,
    userId: string
  ): Promise<IPayment> {
    const payment =
      await this.getPayment(paymentId);

    if (
      payment.status === "SUCCESS"
    ) {
      throw new BadRequestError(
        "A successful payment cannot be marked as failed."
      );
    }

    const updated =
      await paymentRepository.updateById(
        paymentId,
        {
          status: "FAILED",

          failureReason: reason,

          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError(
        "Payment not found."
      );
    }

    return updated;
  }

  async refundPayment(
    paymentId: string,
    input: RefundPaymentInput,
    userId: string
  ): Promise<IPayment> {
    const payment =
      await this.getPayment(paymentId);

    if (
      payment.status !== "SUCCESS" &&
      payment.status !== "PARTIALLY_REFUNDED"
    ) {
      throw new BadRequestError(
        "Only successful payments can be refunded."
      );
    }

    const refundableAmount =
      payment.amount -
      payment.refundAmount;

    if (
      input.amount > refundableAmount
    ) {
      throw new BadRequestError(
        "Refund amount exceeds refundable amount."
      );
    }

    const newRefundAmount =
      payment.refundAmount +
      input.amount;

    const fullyRefunded =
      newRefundAmount === payment.amount;

    const updated =
      await paymentRepository.updateById(
        paymentId,
        {
          refundAmount:
            newRefundAmount,

          status:
            fullyRefunded
              ? "REFUNDED"
              : "PARTIALLY_REFUNDED",

          refundedAt:
            fullyRefunded
              ? new Date()
              : payment.refundedAt,

          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError(
        "Payment not found."
      );
    }

    const bill =
      await Bill.findById(
        payment.billId
      );

    if (bill) {
      bill.paidAmount = Math.max(
        0,
        bill.paidAmount -
          input.amount
      );

      bill.dueAmount =
        bill.grandTotal -
        bill.paidAmount;

      bill.status =
        bill.paidAmount === 0
          ? "ISSUED"
          : "PARTIALLY_PAID";

      bill.paidAt = undefined;

      await bill.save();
    }

    return updated;
  }
}

export const paymentService =
  new PaymentService();