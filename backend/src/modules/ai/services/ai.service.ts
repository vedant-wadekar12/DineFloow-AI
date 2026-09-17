import { BadRequestError, NotFoundError } from "../../../common/errors";

import { AIRepository } from "../repositories/ai.repository";

export class AIService {
  constructor(
    private readonly repository = new AIRepository()
  ) {}

  async getPopularRecommendations(
    restaurantId: string,
    limit = 10
  ) {
    return this.repository.getPopularItems(
      restaurantId,
      limit
    );
  }

  async getPersonalizedRecommendations(
    restaurantId: string,
    customerId: string,
    limit = 10
  ) {
    const orderedItems =
      await this.repository.getCustomerOrderedItems(
        restaurantId,
        customerId
      );

    const availableItems =
      await this.repository.getAvailableMenuItems(
        restaurantId,
        50
      );

    const orderedIds = new Set(
      orderedItems.map((item) =>
        String(item._id)
      )
    );

    const recommendations = availableItems
      .filter(
        (item) =>
          !orderedIds.has(String(item._id))
      )
      .map((item) => {
        let score = 0;

        // Vegetarian items receive a small recommendation boost.
        if (item.isVegetarian) {
          score += 10;
        }

        // Vegan items receive an additional boost.
        if (item.isVegan) {
          score += 10;
        }

        // Available and active items are preferred.
        if (item.isAvailable && item.isActive) {
          score += 10;
        }

        // Items with a shorter preparation time can be recommended
        // more easily for faster service.
        if (
          item.preparationTime !== undefined &&
          item.preparationTime <= 20
        ) {
          score += 10;
        }

        return {
          ...item,
          recommendationScore: score,
          reason: this.getRecommendationReason(item),
        };
      })
      .sort(
        (a, b) =>
          b.recommendationScore -
          a.recommendationScore
      )
      .slice(0, limit);

    return recommendations;
  }

  async getRecommendations(
    restaurantId: string,
    customerId?: string,
    limit = 10
  ) {
    if (customerId) {
      return this.getPersonalizedRecommendations(
        restaurantId,
        customerId,
        limit
      );
    }

    return this.getPopularRecommendations(
      restaurantId,
      limit
    );
  }

  async getSpecialDish(
    restaurantId: string
  ) {
    const items =
      await this.repository.getAvailableMenuItems(
        restaurantId,
        50
      );

    if (!items.length) {
      throw new NotFoundError(
        "No available menu items found."
      );
    }

    const special = items
      .map((item) => {
        let score = 0;

        if (item.isVegetarian) {
          score += 10;
        }

        if (item.isVegan) {
          score += 10;
        }

        if (item.isAvailable && item.isActive) {
          score += 10;
        }

        if (
          item.preparationTime !== undefined &&
          item.preparationTime <= 20
        ) {
          score += 10;
        }

        return {
          ...item,
          specialScore: score,
        };
      })
      .sort(
        (a, b) =>
          b.specialScore -
          a.specialScore
      )[0];

    return special;
  }

  async setSpecialDish(
    restaurantId: string,
    menuItemId: string
  ) {
    const item =
      await this.repository.findMenuItemById(
        restaurantId,
        menuItemId
      );

    if (!item) {
      throw new NotFoundError(
        "Menu item not found."
      );
    }

    if (!item.isAvailable) {
      throw new BadRequestError(
        "Unavailable menu item cannot be a special dish."
      );
    }

    return item;
  }

  private getRecommendationReason(
    item: {
      isVegetarian?: boolean;
      isVegan?: boolean;
      isAvailable?: boolean;
      isActive?: boolean;
      preparationTime?: number;
    }
  ) {
    if (item.isVegan) {
      return "Vegan menu item";
    }

    if (item.isVegetarian) {
      return "Vegetarian menu item";
    }

    if (
      item.preparationTime !== undefined &&
      item.preparationTime <= 20
    ) {
      return "Quickly prepared menu item";
    }

    if (item.isAvailable && item.isActive) {
      return "Currently available menu item";
    }

    return "Recommended for you";
  }
}