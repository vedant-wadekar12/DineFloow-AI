import { seedPermissions } from "./permission.seeder";
import { seedRoles } from "./role.seeder";
import { seedRolePermissions } from "./role-permission.seeder";

export const seedDatabase = async (): Promise<void> => {
  await seedRoles();

  await seedPermissions();

  await seedRolePermissions();

  console.log("Database Seeded Successfully");
};