import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "../../config";

import { JwtPayload } from "../interfaces";

export class TokenUtil {
  generateAccessToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
      issuer: env.JWT_ISSUER,
    };

    return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
  }

  generateRefreshToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn:
        env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
      issuer: env.JWT_ISSUER,
    };

    return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
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