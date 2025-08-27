import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { config } from "../config/index";

interface JwtPayload {
  userId: string;
  role: string;
}

type JwtExpiresIn = `${number}${"s" | "m" | "h" | "d"}`;

export const generateToken = (payload: JwtPayload): string => {
  const secret: Secret = config.jwt.secret;

  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as JwtExpiresIn,
  };

  return jwt.sign(payload, secret, options);
};
