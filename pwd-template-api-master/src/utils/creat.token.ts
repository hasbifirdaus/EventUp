//gunakan nati jika sudah mau membuat register ketika user mau mengubah password -> pisahkan jwt dari aut.service

import jwt, { SignOptions } from "jsonwebtoken";

export const createToken = (
  payload: any,
  privateKey: string,
  option: SignOptions
) => {
  return jwt.sign(payload, privateKey, option);
};
