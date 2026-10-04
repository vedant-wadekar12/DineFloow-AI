import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../database";
import { Branch } from "../modules/branches/models/branch.model";
import { Floor } from "../modules/floors/models/floor.model";
import { Table } from "../modules/tables/models/table.model";
import { User } from "../modules/auth/models/user.model";
import { Restaurant } from "../modules/restaurants/models/restaurant.model";
import { logger } from "../config";

export async function runTenantMigration(): Promise<void> {
  await connectDatabase();
  try {
    const branches = await Branch.find({ isDeleted: false }).select("_id restaurantId");
    const branchMap = new Map(branches.map((b) => [b._id.toString(), b.restaurantId]));

    const floors = await Floor.find({ $or: [{ restaurantId: { $exists: false } }, { restaurantId: null }] });
    for (const floor of floors) {
      const restaurantId = branchMap.get(floor.branchId.toString());
      if (restaurantId) await Floor.updateOne({ _id: floor._id }, { $set: { restaurantId } });
    }

    const tables = await Table.find({ $or: [{ restaurantId: { $exists: false } }, { restaurantId: null }] });
    for (const table of tables) {
      const restaurantId = branchMap.get(table.branchId.toString());
      if (restaurantId) await Table.updateOne({ _id: table._id }, { $set: { restaurantId } });
    }

    // Repair a stale owner restaurant only when exactly one active restaurant remains.
    const owners = await User.find({ isDeleted: false, restaurantId: { $exists: true } }).select("_id restaurantId");
    for (const user of owners) {
      const current = user.restaurantId ? await Restaurant.findOne({ _id: user.restaurantId, ownerId: user._id, isDeleted: false, isActive: true }).select("_id") : null;
      if (current) continue;
      const active = await Restaurant.find({ ownerId: user._id, isDeleted: false, isActive: true }).select("_id");
      if (active.length === 1) await User.updateOne({ _id: user._id }, { $set: { restaurantId: active[0]._id } });
    }

    logger.info("Tenant hierarchy backfill completed.");
  } finally {
    await disconnectDatabase();
  }
}

if (require.main === module) {
  runTenantMigration().then(() => process.exit(0)).catch((error) => { logger.error("Tenant migration failed:", error); process.exit(1); });
}
