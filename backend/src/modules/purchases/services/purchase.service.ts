import { randomUUID } from "crypto";
import { Types } from "mongoose";

import { NotFoundError } from "../../../common/errors";

import { supplierRepository } from "../../suppliers/repositories/supplier.repository";
import { InventoryItem } from "../../inventory/models/inventory-item.model";

import { purchaseRepository } from "../repositories/purchase.repository";

import {
  createPurchaseSchema,
  updatePurchaseSchema,
} from "../validators/purchase.validator";

export class PurchaseService {
  // ============================================================
  // CREATE PURCHASE
  // ============================================================

  async create(
    input: unknown,
    userId?: string
  ) {
    const data = createPurchaseSchema.parse(input);

    // ------------------------------------------------------------
    // Check supplier
    // ------------------------------------------------------------

    const supplier =
      await supplierRepository.findById(
        data.supplierId
      );

    if (!supplier) {
      throw new NotFoundError(
        "Supplier not found"
      );
    }

    // ------------------------------------------------------------
    // Get inventory item IDs
    // ------------------------------------------------------------

    const inventoryIds = data.items.map(
      (item) => item.inventoryItemId
    );

    // ------------------------------------------------------------
    // Check inventory items
    // ------------------------------------------------------------

    const inventoryItems =
      await InventoryItem.find({
        _id: {
          $in: inventoryIds,
        },
        isDeleted: false,
      });

    if (
      inventoryItems.length !==
      new Set(inventoryIds).size
    ) {
      throw new NotFoundError(
        "One or more inventory items were not found"
      );
    }

    // ------------------------------------------------------------
    // Prepare purchase items
    // ------------------------------------------------------------

    const items = data.items.map((item) => {
      const receivedQuantity =
        item.receivedQuantity ?? 0;

      const totalCost =
        item.totalCost ??
        item.quantity * item.unitCost;

      return {
        inventoryItemId:
          new Types.ObjectId(
            item.inventoryItemId
          ),

        quantity: item.quantity,

        receivedQuantity,

        unitCost: item.unitCost,

        totalCost,

        notes: item.notes,
      };
    });

    // ------------------------------------------------------------
    // Calculate subtotal
    // ------------------------------------------------------------

    const subtotal = items.reduce(
      (sum, item) =>
        sum + item.totalCost,
      0
    );

    // ------------------------------------------------------------
    // Amount calculations
    // ------------------------------------------------------------

    const taxAmount =
      data.taxAmount ?? 0;

    const discountAmount =
      data.discountAmount ?? 0;

    const shippingAmount =
      data.shippingAmount ?? 0;

    const totalAmount =
      subtotal +
      taxAmount +
      shippingAmount -
      discountAmount;

    // ------------------------------------------------------------
    // Generate purchase number
    // ------------------------------------------------------------

    const purchaseNumber =
      `PO-${Date.now()}-${randomUUID()
        .slice(0, 6)
        .toUpperCase()}`;

    // ------------------------------------------------------------
    // Create purchase
    // ------------------------------------------------------------

    return purchaseRepository.create({
      restaurantId:
        new Types.ObjectId(
          data.restaurantId
        ),

      branchId: data.branchId
        ? new Types.ObjectId(
            data.branchId
          )
        : undefined,

      supplierId:
        new Types.ObjectId(
          data.supplierId
        ),

      purchaseNumber,

      purchaseDate:
        data.purchaseDate ??
        new Date(),

      expectedDate:
        data.expectedDate,

      status: "DRAFT",

      items,

      subtotal,

      taxAmount,

      discountAmount,

      shippingAmount,

      totalAmount,

      notes: data.notes,

      createdBy: userId
        ? new Types.ObjectId(userId)
        : undefined,

      updatedBy: userId
        ? new Types.ObjectId(userId)
        : undefined,
    });
  }

  // ============================================================
  // GET ALL PURCHASES
  // ============================================================

  async getAll(filters: {
    restaurantId?: string;
    branchId?: string;
    supplierId?: string;
    status?: string;
  }) {
    return purchaseRepository.findAll(
      filters
    );
  }

  // ============================================================
  // GET PURCHASE BY ID
  // ============================================================

  async getById(id: string) {
    const purchase =
      await purchaseRepository.findById(id);

    if (!purchase) {
      throw new NotFoundError(
        "Purchase not found"
      );
    }

    return purchase;
  }

  // ============================================================
  // UPDATE PURCHASE
  // ============================================================

  async update(
  id: string,
  input: unknown,
  userId?: string
) {
  const data =
    updatePurchaseSchema.parse(input);

  const purchase =
    await purchaseRepository.findById(id);

  if (!purchase) {
    throw new NotFoundError(
      "Purchase not found"
    );
  }

  // Only DRAFT purchases can be updated
  if (
    purchase.status !== "DRAFT"
  ) {
    throw new Error(
      "Only draft purchases can be updated"
    );
  }

  const updateData: Record<string, unknown> = {
    ...data,
    updatedBy: userId
      ? new Types.ObjectId(userId)
      : undefined,
  };

  // Convert branchId string -> ObjectId
  if (data.branchId) {
    updateData.branchId =
      new Types.ObjectId(data.branchId);
  }

  // Convert supplierId string -> ObjectId
  if (data.supplierId) {
    const supplier =
      await supplierRepository.findById(
        data.supplierId
      );

    if (!supplier) {
      throw new NotFoundError(
        "Supplier not found"
      );
    }

    updateData.supplierId =
      new Types.ObjectId(
        data.supplierId
      );
  }

  // Convert purchase items inventoryItemId
  if (data.items) {
    updateData.items = data.items.map(
      (item) => ({
        inventoryItemId:
          new Types.ObjectId(
            item.inventoryItemId
          ),

        quantity:
          item.quantity,

        receivedQuantity:
          item.receivedQuantity ?? 0,

        unitCost:
          item.unitCost,

        totalCost:
          item.totalCost ??
          item.quantity * item.unitCost,

        notes:
          item.notes,
      })
    );
  }

  const updated =
    await purchaseRepository.update(
      id,
      updateData
    );

  return updated;
}

  // ============================================================
  // UPDATE PURCHASE STATUS
  // ============================================================

  async updateStatus(
    id: string,
    status:
      | "DRAFT"
      | "ORDERED"
      | "CANCELLED",
    userId?: string
  ) {
    const purchase =
      await purchaseRepository.findById(id);

    if (!purchase) {
      throw new NotFoundError(
        "Purchase not found"
      );
    }

    // ------------------------------------------------------------
    // Draft -> Ordered
    // ------------------------------------------------------------

    if (
      status === "ORDERED" &&
      purchase.status !== "DRAFT"
    ) {
      throw new Error(
        "Only draft purchases can be ordered"
      );
    }

    // ------------------------------------------------------------
    // Cannot cancel received purchase
    // ------------------------------------------------------------

    if (
      status === "CANCELLED" &&
      purchase.status === "RECEIVED"
    ) {
      throw new Error(
        "Received purchase cannot be cancelled"
      );
    }

    // ------------------------------------------------------------
    // Update status
    // ------------------------------------------------------------

    return purchaseRepository.updateStatus(
  id,
  status,
  userId
);
  }

  // ============================================================
  // RECEIVE PURCHASE
  // ============================================================

  async receive(
    id: string,
    userId?: string
  ) {
    const purchase =
      await purchaseRepository.findById(id);

    if (!purchase) {
      throw new NotFoundError(
        "Purchase not found"
      );
    }

    // ------------------------------------------------------------
    // Purchase must be ordered or partially received
    // ------------------------------------------------------------

    if (
      purchase.status !== "ORDERED" &&
      purchase.status !==
        "PARTIALLY_RECEIVED"
    ) {
      throw new Error(
        "Purchase is not ready to be received"
      );
    }

    // ------------------------------------------------------------
    // Update inventory stock
    // ------------------------------------------------------------

    for (const item of purchase.items) {
      const remaining =
        item.quantity -
        item.receivedQuantity;

      if (remaining <= 0) {
        continue;
      }

      await InventoryItem.findByIdAndUpdate(
        item.inventoryItemId,
        {
          $inc: {
            currentStock: remaining,
          },
        }
      );

      item.receivedQuantity =
        item.quantity;
    }

    // ------------------------------------------------------------
    // Mark purchase as received
    // ------------------------------------------------------------

    return purchaseRepository.receive(
  id,
  purchase.items,
  userId
);
  }
}

// ============================================================
// EXPORT SERVICE
// ============================================================

export const purchaseService =
  new PurchaseService();