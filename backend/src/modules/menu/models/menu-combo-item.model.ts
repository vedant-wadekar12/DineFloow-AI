import {
  Document,
  Schema,
  Types,
  model,
} from "mongoose";

export interface IMenuComboItem extends Document {
  comboId: Types.ObjectId;
  menuItemId: Types.ObjectId;

  quantity: number;

  createdAt: Date;
  updatedAt: Date;
}

const menuComboItemSchema =
  new Schema<IMenuComboItem>(
    {
      comboId: {
        type: Schema.Types.ObjectId,
        ref: "MenuCombo",
        required: true,
        index: true,
      },

      menuItemId: {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
        index: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

menuComboItemSchema.index(
  {
    comboId: 1,
    menuItemId: 1,
  },
  {
    unique: true,
  }
);

export const MenuComboItem =
  model<IMenuComboItem>(
    "MenuComboItem",
    menuComboItemSchema
  );