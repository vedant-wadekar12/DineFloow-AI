import { Types } from "mongoose";

import {
  ConflictError,
  NotFoundError,
} from "../../../common/errors";

import {
  restaurantRepository,
} from "../repositories/restaurant.repository";

export class RestaurantService {
  /**
   * =========================================================
   * CREATE RESTAURANT
   * =========================================================
   */
  async create(
    payload: {
      name: string;
      slug: string;
      description?: string;
      phone: string;
      email: string;
      address: string;
    },
    ownerId: string
  ) {
    if (!Types.ObjectId.isValid(ownerId)) {
      throw new NotFoundError(
        "Invalid owner ID."
      );
    }

    const existing =
      await restaurantRepository.findBySlug(
        payload.slug
      );

    if (existing) {
      throw new ConflictError(
        "Restaurant slug already exists."
      );
    }

    return await restaurantRepository.create({
      ...payload,

      ownerId:
        new Types.ObjectId(ownerId),

      createdBy:
        new Types.ObjectId(ownerId),

      isActive: true,

      isDeleted: false,
    });
  }

  /**
   * =========================================================
   * GET ALL RESTAURANTS FOR CURRENT OWNER
   * =========================================================
   */
  async getAll(ownerId: string) {
    return await restaurantRepository.findByOwner(
      ownerId
    );
  }

  /**
   * =========================================================
   * GET RESTAURANT BY OWNER
   * =========================================================
   */
  async getById(
    id: string,
    ownerId: string
  ) {
    const restaurant =
      await restaurantRepository.findByIdAndOwner(
        id,
        ownerId
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    return restaurant;
  }

  /**
   * =========================================================
   * GET RESTAURANTS BY OWNER
   * =========================================================
   */
  async getByOwner(ownerId: string) {
    return await restaurantRepository.findByOwner(
      ownerId
    );
  }

  /**
   * =========================================================
   * UPDATE RESTAURANT
   * OWNER ONLY
   * =========================================================
   */
  async update(
    id: string,
    payload: {
      name?: string;
      slug?: string;
      description?: string;
      phone?: string;
      email?: string;
      address?: string;
    },
    updatedBy: string
  ) {
    const restaurant =
      await restaurantRepository.findByIdAndOwner(
        id,
        updatedBy
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    if (
      payload.slug &&
      payload.slug !== restaurant.slug
    ) {
      const existing =
        await restaurantRepository.findBySlug(
          payload.slug
        );

      if (existing) {
        throw new ConflictError(
          "Restaurant slug already exists."
        );
      }
    }

    const updatedRestaurant =
      await restaurantRepository.updateByOwner(
        id,
        updatedBy,
        {
          ...payload,

          updatedBy:
            new Types.ObjectId(
              updatedBy
            ),
        }
      );

    if (!updatedRestaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    return updatedRestaurant;
  }

  /**
   * =========================================================
   * UPDATE RESTAURANT STATUS
   * OWNER ONLY
   *
   * Existing owner functionality.
   * DO NOT use this for SUPER_ADMIN.
   * =========================================================
   */
  async updateStatus(
    id: string,
    isActive: boolean,
    ownerId: string
  ) {
    if (
      !Types.ObjectId.isValid(id)
    ) {
      throw new NotFoundError(
        "Invalid restaurant ID."
      );
    }

    const restaurant =
      await restaurantRepository.updateStatusByOwner(
        id,
        ownerId,
        isActive
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    return restaurant;
  }

  /**
   * =========================================================
   * UPDATE RESTAURANT STATUS
   * SUPER ADMIN ONLY
   *
   * This method intentionally does NOT use ownerId.
   *
   * SUPER_ADMIN can activate/deactivate ANY restaurant.
   * =========================================================
   */
  async updateStatusAsSuperAdmin(
    id: string,
    isActive: boolean
  ) {
    if (
      !Types.ObjectId.isValid(id)
    ) {
      throw new NotFoundError(
        "Invalid restaurant ID."
      );
    }

    if (
      typeof isActive !== "boolean"
    ) {
      throw new ConflictError(
        "Restaurant active status must be a boolean."
      );
    }

    const restaurant =
      await restaurantRepository.updateStatus(
        id,
        isActive
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    return restaurant;
  }

  /**
   * =========================================================
   * GET ALL RESTAURANTS
   * SUPER ADMIN ONLY
   *
   * This returns all non-deleted restaurants.
   * =========================================================
   */
  async getAllAsSuperAdmin() {
    return await restaurantRepository.findAll();
  }

  /**
   * =========================================================
   * GET ONE RESTAURANT
   * SUPER ADMIN ONLY
   * =========================================================
   */
  async getByIdAsSuperAdmin(
    id: string
  ) {
    if (
      !Types.ObjectId.isValid(id)
    ) {
      throw new NotFoundError(
        "Invalid restaurant ID."
      );
    }

    const restaurant =
      await restaurantRepository.findById(
        id
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    return restaurant;
  }

  /**
   * =========================================================
   * SOFT DELETE
   * OWNER ONLY
   * =========================================================
   */
  async delete(
    id: string,
    ownerId: string
  ) {
    const restaurant =
      await restaurantRepository.findByIdAndOwner(
        id,
        ownerId
      );

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    await restaurantRepository.softDeleteByOwner(
      id,
      ownerId
    );
  }
}

export const restaurantService =
  new RestaurantService();