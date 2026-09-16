import {
  Document,
  Schema,
  Types,
  model,
} from "mongoose";

export interface IMenuRecipe
  extends Document {
  restaurantId: Types.ObjectId;

  menuItemId: Types.ObjectId;

  inventoryItemId: Types.ObjectId;

  quantity: number;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const menuRecipeSchema =
  new Schema<IMenuRecipe>(
    {
      restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true,
      },

      menuItemId: {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
        index: true,
      },

      inventoryItemId: {
        type: Schema.Types.ObjectId,
        ref: "InventoryItem",
        required: true,
        index: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 0.000001,
      },

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

menuRecipeSchema.index(
  {
    menuItemId: 1,
    inventoryItemId: 1,
  },
  {
    unique: true,
  }
);

export const MenuRecipe =
  model<IMenuRecipe>(
    "MenuRecipe",
    menuRecipeSchema
  );