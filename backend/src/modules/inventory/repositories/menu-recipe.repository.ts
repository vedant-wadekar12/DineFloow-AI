import { Types } from "mongoose";

import {
  IMenuRecipe,
  MenuRecipe,
} from "../models/menu-recipe.model";

export class MenuRecipeRepository {
  async create(
    payload: Partial<IMenuRecipe>
  ): Promise<IMenuRecipe> {
    return await MenuRecipe.create(payload);
  }

  async findById(
    id: string | Types.ObjectId
  ): Promise<IMenuRecipe | null> {
    return await MenuRecipe.findById(id);
  }

  async findByMenuItem(
    menuItemId: string | Types.ObjectId
  ): Promise<IMenuRecipe[]> {
    return await MenuRecipe.find({
      menuItemId,
    }).populate("inventoryItemId");
  }

  async findByIngredient(
    inventoryItemId: string | Types.ObjectId
  ): Promise<IMenuRecipe[]> {
    return await MenuRecipe.find({
      inventoryItemId,
    });
  }

  async findExisting(
    menuItemId: string | Types.ObjectId,
    inventoryItemId: string | Types.ObjectId
  ): Promise<IMenuRecipe | null> {
    return await MenuRecipe.findOne({
      menuItemId,
      inventoryItemId,
    });
  }

  async update(
    id: string | Types.ObjectId,
    quantity: number,
    updatedBy?: Types.ObjectId
  ) {
    return await MenuRecipe.findByIdAndUpdate(
      id,
      {
        $set: {
          quantity,
          updatedBy,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async delete(
    id: string | Types.ObjectId
  ) {
    return await MenuRecipe.findByIdAndDelete(
      id
    );
  }
}

export const menuRecipeRepository =
  new MenuRecipeRepository();