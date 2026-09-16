import { Permission } from "../../modules/permissions";
import { Role } from "../../modules/roles";
import { RolePermission } from "../../modules/role-permissions";

export const seedRolePermissions = async (): Promise<void> => {
  const roles = await Role.find({
    isActive: true,
  });

  for (const role of roles) {
    const permissions = await Permission.find({
      isActive: true,
    });

    for (const permission of permissions) {
      /**
       * SUPER_ADMIN gets every permission
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
       * RESTAURANT_OWNER gets restaurant-level
       * and all operational permissions
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
          "supplier:create",
          "supplier:read",
          "supplier:update",
          "supplier:delete",
          "purchase:create",
          "purchase:read",
          "purchase:update",
          "purchase:delete",
          "purchase:receive",
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
          "report:read",
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
        ["menu:read", "order:read", "order:update"].includes(permission.name)
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
        ["menu:read", "order:read", "order:update"].includes(permission.name)
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
      }
    }
  }
};
