import { Types } from "mongoose";

import {
  Offer,
  IOffer,
} from "../models/offer.model";

class OfferRepository {
  async create(
    data: Partial<IOffer>
  ): Promise<IOffer> {
    return Offer.create(data);
  }

  async findById(
    offerId: string | Types.ObjectId
  ): Promise<IOffer | null> {
    return Offer.findById(offerId);
  }

  async findAll(
    filter: Record<string, unknown>
  ): Promise<IOffer[]> {
    return Offer.find(filter).sort({
      priority: -1,
      createdAt: -1,
    });
  }

  async updateById(
    offerId: string,
    data: Partial<IOffer>
  ): Promise<IOffer | null> {
    return Offer.findByIdAndUpdate(
      offerId,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }
}

export const offerRepository =
  new OfferRepository();