import { Permission } from "../../modules/permissions";
import { PERMISSIONS } from "../../modules/permissions";

export const seedPermissions = async (): Promise<void> => {
  const permissions = Object.values(PERMISSIONS);

  for (const permission of permissions) {
    const module = permission.split(":")[0];

    await Permission.updateOne(
      { name: permission },
      {
        $set: {
          name: permission,
          module,
          description: permission,
        },
      },
      { upsert: true }
    );
  }
};