import {
  Schema,
  model,
  Document,
} from "mongoose";

export interface IAuditLog
  extends Document {
  userId?: string;

  restaurantId?: string;

  branchId?: string;

  action: string;

  resource: string;

  resourceId?: string;

  method: string;

  path: string;

  ipAddress?: string;

  userAgent?: string;

  oldValues?: Record<
    string,
    unknown
  >;

  newValues?: Record<
    string,
    unknown
  >;

  metadata?: Record<
    string,
    unknown
  >;

  createdAt: Date;

  updatedAt: Date;
}

const auditLogSchema =
  new Schema<IAuditLog>(
    {
      userId: {
        type: String,
      },

      restaurantId: {
        type: String,
      },

      branchId: {
        type: String,
      },

      action: {
        type: String,
        required: true,
        trim: true,
      },

      resource: {
        type: String,
        required: true,
        trim: true,
      },

      resourceId: {
        type: String,
      },

      method: {
        type: String,
        required: true,
      },

      path: {
        type: String,
        required: true,
      },

      ipAddress: {
        type: String,
      },

      userAgent: {
        type: String,
      },

      oldValues: {
        type: Schema.Types.Mixed,
      },

      newValues: {
        type: Schema.Types.Mixed,
      },

      metadata: {
        type: Schema.Types.Mixed,
      },
    },
    {
      timestamps: true,
    }
  );

auditLogSchema.index({
  restaurantId: 1,
  createdAt: -1,
});

auditLogSchema.index({
  userId: 1,
  createdAt: -1,
});

auditLogSchema.index({
  resource: 1,
  resourceId: 1,
});

export const AuditLog =
  model<IAuditLog>(
    "AuditLog",
    auditLogSchema
  );