import { Role } from "../../modules/roles";
import { SYSTEM_ROLES } from "../../modules/roles";

export const seedRoles = async (): Promise<void> => {
  const roles = [
    {
      name: SYSTEM_ROLES.SUPER_ADMIN,
      description: "System Super Administrator",
    },
    {
      name: SYSTEM_ROLES.RESTAURANT_OWNER,
      description: "Restaurant Owner",
    },
    {
      name: SYSTEM_ROLES.BRANCH_MANAGER,
      description: "Branch Manager",
    },
    {
      name: SYSTEM_ROLES.CASHIER,
      description: "Cashier",
    },
    {
      name: SYSTEM_ROLES.WAITER,
      description: "Waiter",
    },
    {
      name: SYSTEM_ROLES.CHEF,
      description: "Chef",
    },
    {
      name: SYSTEM_ROLES.KITCHEN_STAFF,
      description: "Kitchen Staff",
    },
  ];

  for (const role of roles) {
    await Role.updateOne(
      { name: role.name },
      { $set: role },
      { upsert: true }
    );
  }
};