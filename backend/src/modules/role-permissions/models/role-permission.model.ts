import { Document, Schema, Types, model } from "mongoose";

export interface IRolePermission extends Document {
  roleId: Types.ObjectId;

  permissionId: Types.ObjectId;
}

const rolePermissionSchema = new Schema<IRolePermission>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      index: true,
    },

    permissionId: {
      type: Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Prevent duplicate mappings
 */
rolePermissionSchema.index(
  {
    roleId: 1,
    permissionId: 1,
  },
  {
    unique: true,
  }
);

export const RolePermission = model<IRolePermission>(
  "RolePermission",
  rolePermissionSchema
);