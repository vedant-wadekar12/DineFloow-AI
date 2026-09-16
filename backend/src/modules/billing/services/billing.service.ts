import { Types } from "mongoose";
import { billRepository } from "../repositories/bill.repository";
import {
  CreateBillInput,
  UpdateBillInput,
} from "../validators/billing.validator";

import { BillStatus, IBill } from "../models/bill.model";

import { NotFoundError, BadRequestError } from "../../../common/errors";

import { Order } from "../../orders/models/order.model";

class BillingService {
  private generateBillNumber(): string {
    const timestamp = Date.now();

    const random = Math.floor(
      1000 + Math.random() * 9000
    );

    return `BILL-${timestamp}-${random}`;
  }

  private calculateGrandTotal(
    subtotal: number,
    discount: number,
    tax: number,
    serviceCharge: number
  ): number {
    return Math.max(
      0,
      subtotal -
        discount +
        tax +
        serviceCharge
    );
  }

  async createBill(
    input: CreateBillInput,
    userId: string
  ): Promise<IBill> {
    const order = await Order.findById(input.orderId);

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    const existingBill =
      await billRepository.findByOrderId(order._id);

    if (existingBill) {
      throw new BadRequestError(
        "A bill already exists for this order."
      );
    }

    if (!order.items || order.items.length === 0) {
      throw new BadRequestError(
        "Cannot create a bill for an empty order."
      );
    }

    const items = order.items.map((item: any) => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(
        item.price ?? item.unitPrice ?? 0
      );

      return {
        orderItemId: item._id,
        menuItemId: item.menuItemId,
        name: item.name,
        variantName: item.variantName,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
      };
    });

    const subtotal = items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    const discount = input.discount ?? 0;
    const tax = input.tax ?? 0;
    const serviceCharge =
      input.serviceCharge ?? 0;

    if (discount > subtotal) {
      throw new BadRequestError(
        "Discount cannot be greater than subtotal."
      );
    }

    const grandTotal =
      this.calculateGrandTotal(
        subtotal,
        discount,
        tax,
        serviceCharge
      );

    const bill = await billRepository.create({
      billNumber: this.generateBillNumber(),

      restaurantId: order.restaurantId,

      branchId: order.branchId,

      orderId: order._id,

      tableId: order.tableId,

      customerId: (order as any).customerId,

      items,

      subtotal,

      discount,

      tax,

      serviceCharge,

      grandTotal,

      paidAmount: 0,

      dueAmount: grandTotal,

      status: "ISSUED",

      notes: input.notes,

      issuedAt: new Date(),

      createdBy: new Types.ObjectId(userId),
    });

    return bill;
  }

  async getBill(
    billId: string
  ): Promise<IBill> {
    const bill =
      await billRepository.findById(billId);

    if (!bill) {
      throw new NotFoundError("Bill not found.");
    }

    return bill;
  }

  async getBillByOrder(
    orderId: string
  ): Promise<IBill> {
    const bill =
      await billRepository.findByOrderId(orderId);

    if (!bill) {
      throw new NotFoundError(
        "Bill not found for this order."
      );
    }

    return bill;
  }

  async getBills(
    restaurantId?: string,
    branchId?: string,
    status?: BillStatus
  ): Promise<IBill[]> {
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

    return billRepository.findAll(filter);
  }

  async updateBill(
    billId: string,
    input: UpdateBillInput,
    userId: string
  ): Promise<IBill> {
    const bill = await this.getBill(billId);

    if (
      bill.status === "PAID" ||
      bill.status === "CANCELLED" ||
      bill.status === "REFUNDED"
    ) {
      throw new BadRequestError(
        "This bill cannot be modified."
      );
    }

    const discount =
      input.discount ?? bill.discount;

    const tax =
      input.tax ?? bill.tax;

    const serviceCharge =
      input.serviceCharge ??
      bill.serviceCharge;

    if (discount > bill.subtotal) {
      throw new BadRequestError(
        "Discount cannot be greater than subtotal."
      );
    }

    const grandTotal =
      this.calculateGrandTotal(
        bill.subtotal,
        discount,
        tax,
        serviceCharge
      );

    if (grandTotal < bill.paidAmount) {
      throw new BadRequestError(
        "Grand total cannot be less than paid amount."
      );
    }

    const updated =
      await billRepository.updateById(
        billId,
        {
          discount,
          tax,
          serviceCharge,
          grandTotal,
          dueAmount:
            grandTotal - bill.paidAmount,
          notes: input.notes,
          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError("Bill not found.");
    }

    return updated;
  }

  async cancelBill(
    billId: string,
    userId: string
  ): Promise<IBill> {
    const bill = await this.getBill(billId);

    if (bill.paidAmount > 0) {
      throw new BadRequestError(
        "A bill with payments cannot be cancelled."
      );
    }

    if (bill.status === "CANCELLED") {
      throw new BadRequestError(
        "Bill is already cancelled."
      );
    }

    const updated =
      await billRepository.updateById(
        billId,
        {
          status: "CANCELLED",
          cancelledAt: new Date(),
          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError("Bill not found.");
    }

    return updated;
  }
}

export const billingService =
  new BillingService();