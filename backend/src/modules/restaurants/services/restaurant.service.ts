import { Types } from "mongoose";

import {
  ConflictError,
  NotFoundError,
} from "../../../common/errors";

import {
  restaurantRepository,
} from "../repositories/restaurant.repository";

export class RestaurantService {
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
      ownerId: new Types.ObjectId(ownerId),
      createdBy: new Types.ObjectId(ownerId),
      isActive: true,
      isDeleted: false,
    });
  }

  async getAll() {
    return await restaurantRepository.findAll();
  }

  async getById(id: string) {
    const restaurant =
      await restaurantRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    return restaurant;
  }

  async getByOwner(ownerId: string) {
    return await restaurantRepository.findByOwner(
      ownerId
    );
  }

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
      await restaurantRepository.findById(id);

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

    return await restaurantRepository.update(
      id,
      {
        ...payload,
        updatedBy: new Types.ObjectId(updatedBy),
      }
    );
  }

  async updateStatus(
    id: string,
    isActive: boolean
  ) {
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

  async delete(id: string) {
    const restaurant =
      await restaurantRepository.findById(id);

    if (!restaurant) {
      throw new NotFoundError(
        "Restaurant not found."
      );
    }

    await restaurantRepository.softDelete(id);
  }
}

export const restaurantService =
  new RestaurantService();