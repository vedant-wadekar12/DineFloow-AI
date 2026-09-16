export interface CreateMenuRecipeDto {
  restaurantId: string;

  menuItemId: string;

  inventoryItemId: string;

  quantity: number;
}

export interface UpdateMenuRecipeDto {
  quantity: number;
}