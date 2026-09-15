import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import { MenuItem } from "../models/menu-item.model";
import { branchRepository } from "../../branches";
import { restaurantRepository } from "../../restaurants";

import {
  CreateMenuComboDto,
  UpdateMenuComboDto,
} from "../dto/menu-combo.dto";

import {
  menuComboRepository,
} from "../repositories/menu-combo.repository";

export class MenuComboService {
  async create(
    data: CreateMenuComboDto,
    userId?: string
  ) {
    if (
      !Types.ObjectId.isValid(
        data.restaurantId
      )
    ) {
      throw new BadRequestError(
        "Invalid restaurant ID."
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

    if (data.branchId) {
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
    }

    const existing =
      await menuComboRepository.findBySlug(
        data.restaurantId,
        data.slug
      );

    if (existing) {
      throw new BadRequestError(
        "Combo slug already exists."
      );
    }

    const itemIds =
      data.items.map(
        (item) => item.menuItemId
      );

    const menuItems =
      await MenuItem.find({
        _id: {
          $in: itemIds,
        },
        restaurantId:
          data.restaurantId,
        isDeleted: false,
      });

    if (
      menuItems.length !==
      new Set(itemIds).size
    ) {
      throw new BadRequestError(
        "One or more combo menu items are invalid."
      );
    }

    const combo =
      await menuComboRepository.create({
        restaurantId:
          new Types.ObjectId(
            data.restaurantId
          ),

        branchId: data.branchId
          ? new Types.ObjectId(data.branchId)
          : undefined,

        name: data.name,
        slug: data.slug.toLowerCase(),
        description: data.description,
        image: data.image,

        price: data.price,
        discountPrice: data.discountPrice,

        sortOrder: data.sortOrder ?? 0,

        createdBy: userId
          ? new Types.ObjectId(userId)
          : undefined,
      });

    try {
      await menuComboRepository.createItems(
        data.items.map((item) => ({
          comboId: combo._id,
          menuItemId:
            new Types.ObjectId(
              item.menuItemId
            ),
          quantity: item.quantity,
        }))
      );
    } catch (error) {
      await menuComboRepository.softDelete(
        combo._id
      );

      throw error;
    }

    return await this.getById(
      combo._id.toString()
    );
  }

  async getById(id: string) {
    const combo =
      await menuComboRepository.findById(id);

    if (!combo) {
      throw new NotFoundError(
        "Combo not found."
      );
    }

    const items =
      await menuComboRepository.findItems(id);

    return {
      ...combo.toObject(),
      items,
    };
  }

  async getByRestaurant(
    restaurantId: string
  ) {
    const combos =
      await menuComboRepository.findByRestaurant(
        restaurantId
      );

    return Promise.all(
      combos.map(async (combo) => ({
        ...combo.toObject(),
        items:
          await menuComboRepository.findItems(
            combo._id
          ),
      }))
    );
  }

  async update(
    id: string,
    data: UpdateMenuComboDto,
    userId?: string
  ) {
    const combo =
      await menuComboRepository.findById(id);

    if (!combo) {
      throw new NotFoundError(
        "Combo not found."
      );
    }

    if (data.branchId) {
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
        combo.restaurantId.toString()
      ) {
        throw new BadRequestError(
          "Branch does not belong to this restaurant."
        );
      }
    }

    if (data.slug) {
      const existing =
        await menuComboRepository.findBySlug(
          combo.restaurantId,
          data.slug
        );

      if (
        existing &&
        existing._id.toString() !== id
      ) {
        throw new BadRequestError(
          "Combo slug already exists."
        );
      }
    }

    if (data.items) {
      const itemIds =
        data.items.map(
          (item) => item.menuItemId
        );

      const menuItems =
        await MenuItem.find({
          _id: {
            $in: itemIds,
          },
          restaurantId:
            combo.restaurantId,
          isDeleted: false,
        });

      if (
        menuItems.length !==
        new Set(itemIds).size
      ) {
        throw new BadRequestError(
          "One or more combo menu items are invalid."
        );
      }
    }

    await menuComboRepository.update(
      id,
      {
        branchId: data.branchId
          ? new Types.ObjectId(data.branchId)
          : undefined,

        name: data.name,
        slug: data.slug?.toLowerCase(),
        description: data.description,
        image: data.image,

        price: data.price,
        discountPrice:
          data.discountPrice,

        sortOrder: data.sortOrder,

        updatedBy: userId
          ? new Types.ObjectId(userId)
          : undefined,
      }
    );

    if (data.items) {
      await menuComboRepository.deleteItems(
        id
      );

      await menuComboRepository.createItems(
        data.items.map((item) => ({
          comboId:
            new Types.ObjectId(id),

          menuItemId:
            new Types.ObjectId(
              item.menuItemId
            ),

          quantity: item.quantity,
        }))
      );
    }

    return await this.getById(id);
  }

  async updateAvailability(
    id: string,
    isAvailable: boolean
  ) {
    const combo =
      await menuComboRepository.updateAvailability(
        id,
        isAvailable
      );

    if (!combo) {
      throw new NotFoundError(
        "Combo not found."
      );
    }

    return combo;
  }

  async delete(id: string) {
    const combo =
      await menuComboRepository.findById(id);

    if (!combo) {
      throw new NotFoundError(
        "Combo not found."
      );
    }

    await menuComboRepository.softDelete(id);

    await menuComboRepository.deleteItems(id);

    return {
      message:
        "Combo deleted successfully.",
    };
  }
}

export const menuComboService =
  new MenuComboService();