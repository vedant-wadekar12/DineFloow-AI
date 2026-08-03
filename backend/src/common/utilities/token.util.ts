import jwt from "jsonwebtoken";

import { env } from "../../config";

import { JwtPayload } from "../interfaces";

export class TokenUtil {
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      issuer: env.JWT_ISSUER,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      issuer: env.JWT_ISSUER,
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    ) as JwtPayload;
  }

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(
      token,
      env.JWT_REFRESH_SECRET
    ) as JwtPayload;
  }
}

export const tokenUtil = new TokenUtil();