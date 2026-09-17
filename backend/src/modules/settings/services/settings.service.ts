import { SettingsRepository } from "../repositories/settings.repository";

export class SettingsService {
  constructor(
    private readonly repository = new SettingsRepository()
  ) {}

  async getSettings(restaurantId: string) {
    let settings =
      await this.repository.findByRestaurant(
        restaurantId
      );

    if (!settings) {
      settings =
        await this.repository.createOrUpdate(
          restaurantId,
          {
            restaurantId: restaurantId as never,
          }
        );
    }

    return settings;
  }

  async updateSettings(
    restaurantId: string,
    data: Record<string, unknown>,
    userId: string
  ) {
    return this.repository.createOrUpdate(
      restaurantId,
      {
        ...data,
        updatedBy: userId as never,
      }
    );
  }
}