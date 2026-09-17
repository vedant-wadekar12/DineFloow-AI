import {
  IRestaurantSettings,
  RestaurantSettings,
} from "../models/restaurant-settings.model";

export class SettingsRepository {
  async findByRestaurant(
    restaurantId: string
  ): Promise<IRestaurantSettings | null> {
    return RestaurantSettings.findOne({
      restaurantId,
    });
  }

  async create(
    data: Partial<IRestaurantSettings>
  ): Promise<IRestaurantSettings> {
    return RestaurantSettings.create(data);
  }

  async update(
    restaurantId: string,
    data: Partial<IRestaurantSettings>
  ): Promise<IRestaurantSettings | null> {
    return RestaurantSettings.findOneAndUpdate(
      {
        restaurantId,
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async createOrUpdate(
    restaurantId: string,
    data: Partial<IRestaurantSettings>
  ): Promise<IRestaurantSettings> {
    const settings =
      await RestaurantSettings.findOneAndUpdate(
        {
          restaurantId,
        },
        {
          $set: data,
          $setOnInsert: {
            restaurantId,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    return settings;
  }
}