import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../../common/errors";

import {
  IOffer,
} from "../models/offer.model";

import {
  CreateOfferInput,
  UpdateOfferInput,
} from "../validators/offer.validator";

import {
  offerRepository,
} from "../repositories/offer.repository";

class OfferService {
  async createOffer(
    input: CreateOfferInput,
    userId: string
  ): Promise<IOffer> {
    if (
      input.validUntil <=
      input.validFrom
    ) {
      throw new BadRequestError(
        "validUntil must be after validFrom."
      );
    }

    if (
      input.type === "PERCENTAGE" &&
      (
        input.value === undefined ||
        input.value > 100
      )
    ) {
      throw new BadRequestError(
        "Percentage offer must have a value between 1 and 100."
      );
    }

    if (
      (
        input.type === "FIXED" ||
        input.type === "PERCENTAGE"
      ) &&
      input.value === undefined
    ) {
      throw new BadRequestError(
        "This offer type requires a value."
      );
    }

    if (
      input.type ===
        "BUY_ONE_GET_ONE" &&
      (
        input.buyQuantity ===
          undefined ||
        input.getQuantity ===
          undefined
      )
    ) {
      throw new BadRequestError(
        "Buy One Get One offer requires buyQuantity and getQuantity."
      );
    }

    if (
      input.type === "FREE_ITEM" &&
      !input.freeMenuItemId
    ) {
      throw new BadRequestError(
        "Free item offer requires freeMenuItemId."
      );
    }

    return offerRepository.create({
      restaurantId:
        new Types.ObjectId(
          input.restaurantId
        ),

      branchId:
        input.branchId
          ? new Types.ObjectId(
              input.branchId
            )
          : undefined,

      name: input.name,

      description:
        input.description,

      type: input.type,

      value: input.value,

      minimumOrderAmount:
        input.minimumOrderAmount,

      maximumDiscountAmount:
        input.maximumDiscountAmount,

      buyQuantity:
        input.buyQuantity,

      getQuantity:
        input.getQuantity,

      freeMenuItemId:
        input.freeMenuItemId
          ? new Types.ObjectId(
              input.freeMenuItemId
            )
          : undefined,

      applicableMenuItemIds:
        input.applicableMenuItemIds.map(
          (id) =>
            new Types.ObjectId(id)
        ),

      applicableCategoryIds:
        input.applicableCategoryIds.map(
          (id) =>
            new Types.ObjectId(id)
        ),

      validFrom:
        input.validFrom,

      validUntil:
        input.validUntil,

      priority:
        input.priority,

      createdBy:
        new Types.ObjectId(userId),
    });
  }

  async getOffer(
    offerId: string
  ): Promise<IOffer> {
    const offer =
      await offerRepository.findById(
        offerId
      );

    if (!offer || offer.isDeleted) {
      throw new NotFoundError(
        "Offer not found."
      );
    }

    return offer;
  }

  async getOffers(
    restaurantId?: string,
    branchId?: string
  ): Promise<IOffer[]> {
    const filter: Record<string, unknown> = {
      isDeleted: false,
    };

    if (restaurantId) {
      filter.restaurantId =
        restaurantId;
    }

    if (branchId) {
      filter.branchId =
        branchId;
    }

    return offerRepository.findAll(
      filter
    );
  }

  async updateOffer(
    offerId: string,
    input: UpdateOfferInput,
    userId: string
  ): Promise<IOffer> {
    const offer =
      await this.getOffer(offerId);

    const validFrom =
      input.validFrom ??
      offer.validFrom;

    const validUntil =
      input.validUntil ??
      offer.validUntil;

    if (validUntil <= validFrom) {
      throw new BadRequestError(
        "validUntil must be after validFrom."
      );
    }

    const type =
      input.type ?? offer.type;

    const value =
      input.value ?? offer.value;

    if (
      type === "PERCENTAGE" &&
      (
        value === undefined ||
        value > 100
      )
    ) {
      throw new BadRequestError(
        "Percentage offer must have a value between 1 and 100."
      );
    }

    const updated =
      await offerRepository.updateById(
        offerId,
        {
          ...input,

          type,

          value,

          validFrom,

          validUntil,

          freeMenuItemId:
            input.freeMenuItemId
              ? new Types.ObjectId(
                  input.freeMenuItemId
                )
              : undefined,

          applicableMenuItemIds:
            input.applicableMenuItemIds
              ? input.applicableMenuItemIds.map(
                  (id) =>
                    new Types.ObjectId(id)
                )
              : undefined,

          applicableCategoryIds:
            input.applicableCategoryIds
              ? input.applicableCategoryIds.map(
                  (id) =>
                    new Types.ObjectId(id)
                )
              : undefined,

          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError(
        "Offer not found."
      );
    }

    return updated;
  }

  async updateStatus(
    offerId: string,
    isActive: boolean,
    userId: string
  ): Promise<IOffer> {
    const updated =
      await offerRepository.updateById(
        offerId,
        {
          isActive,

          status:
            isActive
              ? "ACTIVE"
              : "INACTIVE",

          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError(
        "Offer not found."
      );
    }

    return updated;
  }

  async deleteOffer(
    offerId: string,
    userId: string
  ): Promise<IOffer> {
    const updated =
      await offerRepository.updateById(
        offerId,
        {
          isDeleted: true,
          isActive: false,
          status: "INACTIVE",
          updatedBy:
            new Types.ObjectId(userId),
        }
      );

    if (!updated) {
      throw new NotFoundError(
        "Offer not found."
      );
    }

    return updated;
  }

  async calculateOffer(
    offerId: string,
    orderAmount: number
  ) {
    const offer =
      await this.getOffer(offerId);

    const now = new Date();

    if (!offer.isActive) {
      throw new BadRequestError(
        "Offer is inactive."
      );
    }

    if (offer.status !== "ACTIVE") {
      throw new BadRequestError(
        "Offer is not active."
      );
    }

    if (
      now < offer.validFrom ||
      now > offer.validUntil
    ) {
      throw new BadRequestError(
        "Offer is expired or not yet valid."
      );
    }

    if (
      orderAmount <
      offer.minimumOrderAmount
    ) {
      throw new BadRequestError(
        `Minimum order amount is ${offer.minimumOrderAmount}.`
      );
    }

    let discountAmount = 0;

    if (
      offer.type === "PERCENTAGE"
    ) {
      discountAmount =
        orderAmount *
        (offer.value ?? 0) /
        100;
    }

    if (
      offer.type === "FIXED"
    ) {
      discountAmount =
        offer.value ?? 0;
    }

    if (
      offer.maximumDiscountAmount !==
        undefined &&
      discountAmount >
        offer.maximumDiscountAmount
    ) {
      discountAmount =
        offer.maximumDiscountAmount;
    }

    discountAmount = Math.min(
      discountAmount,
      orderAmount
    );

    return {
      offerId: offer._id,

      name: offer.name,

      type: offer.type,

      discountAmount,

      finalAmount:
        orderAmount -
        discountAmount,
    };
  }
}

export const offerService =
  new OfferService();