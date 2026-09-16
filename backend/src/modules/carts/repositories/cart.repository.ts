import { Types } from "mongoose";
import {
  Cart,
  ICart,
} from "../models/cart.model";

export class CartRepository {
  async create(data: Partial<ICart>) {
    return Cart.create(data);
  }

  async findById(id: string) {
    return Cart.findOne({
      _id: id,
      isActive: true,
    })
      .populate("items.menuItemId")
      .populate("items.variantId")
      .populate("items.selectedAddons.addonId");
  }

  async findActiveBySession(
    sessionId: string,
    restaurantId: string,
    branchId?: string
  ) {
    const query: Record<string, unknown> = {
      sessionId,
      restaurantId: new Types.ObjectId(
        restaurantId
      ),
      isActive: true,
    };

    if (branchId) {
      query.branchId = new Types.ObjectId(
        branchId
      );
    }

    return Cart.findOne(query);
  }

  async update(
    id: string,
    data: Partial<ICart>
  ) {
    return Cart.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
      },
      {
        $set: data,
      },
      {
        new: true,
      }
    );
  }

  async deactivate(id: string) {
    return Cart.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
      },
      {
        $set: {
          isActive: false,
        },
      },
      {
        new: true,
      }
    );
  }
}

export const cartRepository =
  new CartRepository();