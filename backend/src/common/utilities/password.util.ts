import bcrypt from "bcrypt";
import { env } from "../../config";

export class PasswordUtil {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  }

  async compare(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export const passwordUtil = new PasswordUtil();