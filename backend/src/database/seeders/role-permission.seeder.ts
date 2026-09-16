import { Permission } from "../../modules/permissions";
import { Role } from "../../modules/roles";
import { RolePermission } from "../../modules/role-permissions";

export const seedRolePermissions = async (): Promise<void> => {
  const roles = await Role.find({
    isActive: true,
  });

  const permissions = await Permission.find({
    isActive: true,
  });

  for (const role of roles) {
    for (const permission of permissions) {
      /**
       * SUPER_ADMIN
       * Gets every active permission.
       */
      if (role.name === "SUPER_ADMIN") {
        await RolePermission.updateOne(
          {
            roleId: role._id,
            permissionId: permission._id,
          },
          {
            $set: {
              roleId: role._id,
              permissionId: permission._id,
            },
          },
          {
            upsert: true,
          },
        );

        continue;
      }

      /**
       * RESTAURANT_OWNER
       * Gets every active permission.
       */
      if (role.name === "RESTAURANT_OWNER") {
        await RolePermission.updateOne(
          {
            roleId: role._id,
            permissionId: permission._id,
          },
          {
            $set: {
              roleId: role._id,
              permissionId: permission._id,
            },
          },
          {
            upsert: true,
          },
        );

        continue;
      }

      /**
       * BRANCH_MANAGER
       *
       * Gets branch-level and operational permissions.
       */
      if (
        role.name === "BRANCH_MANAGER" &&
        [
          "branch:",
          "floor:",
          "table:",
          "menu:",
          "order:",
          "payment:",
          "report:",
          "inventory:",
          "billing:",
          "supplier:",
          "purchase:",
          "kitchen:",
          "waiter:",
          "coupon:",
          "offer:",
          "loyalty:",
          "subscription:",
          "analytics:",
          "notification:",
        ].some((prefix) => permission.name.startsWith(prefix))
      ) {
        await RolePermission.updateOne(
          {
            roleId: role._id,
            permissionId: permission._id,
          },
          {
            $set: {
              roleId: role._id,
              permissionId: permission._id,
            },
          },
          {
            upsert: true,
          },
        );

        continue;
      }

      /**
       * CASHIER
       */
      if (
        role.name === "CASHIER" &&
        [
          "order:read",
          "order:update",
          "payment:create",
          "payment:read",
          "payment:update",
          "payment:delete",
          "billing:create",
          "billing:read",
          "billing:update",
          "billing:delete",
          "report:read",
          "notification:read",
          "notification:update",
        ].includes(permission.name)
      ) {
        await RolePermission.updateOne(
          {
            roleId: role._id,
            permissionId: permission._id,
          },
          {
            $set: {
              roleId: role._id,
              permissionId: permission._id,
            },
          },
          {
            upsert: true,
          },
        );

        continue;
      }

      /**
       * WAITER
       */
      if (
        role.name === "WAITER" &&
        [
          "menu:read",
          "table:read",
          "order:create",
          "order:read",
          "order:update",
          "waiter:read",
          "waiter:update",
          "notification:read",
          "notification:update",
        ].includes(permission.name)
      ) {
        await RolePermission.updateOne(
          {
            roleId: role._id,
            permissionId: permission._id,
          },
          {
            $set: {
              roleId: role._id,
              permissionId: permission._id,
            },
          },
          {
            upsert: true,
          },
        );

        continue;
      }

      /**
       * CHEF
       */
      if (
        role.name === "CHEF" &&
        [
          "menu:read",
          "order:read",
          "kitchen:read",
          "kitchen:update",
          "order:update",
          "notification:read",
          "notification:update",
        ].includes(permission.name)
      ) {
        await RolePermission.updateOne(
          {
            roleId: role._id,
            permissionId: permission._id,
          },
          {
            $set: {
              roleId: role._id,
              permissionId: permission._id,
            },
          },
          {
            upsert: true,
          },
        );

        continue;
      }

      /**
       * KITCHEN_STAFF
       */
      if (
        role.name === "KITCHEN_STAFF" &&
        [
          "menu:read",
          "order:read",
          "kitchen:read",
          "kitchen:update",
          "order:update",
          "notification:read",
          "notification:update",
        ].includes(permission.name)
      ) {
        await RolePermission.updateOne(
          {
            roleId: role._id,
            permissionId: permission._id,
          },
          {
            $set: {
              roleId: role._id,
              permissionId: permission._id,
            },
          },
          {
            upsert: true,
          },
        );

        continue;
      }
    }
  }
};