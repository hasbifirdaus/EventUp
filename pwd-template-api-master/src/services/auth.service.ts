import { Prisma, UsersRoleEnum } from "../generated/prisma";
import { hashPassword, comparePassword } from "../utils/password.util";
import { generateToken } from "../utils/jwt.util";
import { handleReferral } from "./referral.service";
import prisma from "../prisma/client";

export const registerUser = async (
  userData: Prisma.UserCreateInput & { referralCode?: string }
) => {
  const { referralCode, ...rest } = userData;

  // Check if username or email already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: rest.username }, { email: rest.email }],
    },
  });

  if (existingUser) {
    throw new Error("Username or email is already taken.");
  }

  // Hash the password before saving
  const hashedPassword = await hashPassword(rest.password);

  const newUser = await prisma.user.create({
    data: {
      ...rest,
      password: hashedPassword,
      role: UsersRoleEnum.CUSTOMER,
    },
  });

  // Handle referral logic if a code was provided
  if (referralCode) {
    await handleReferral(prisma, newUser.email, referralCode);
  }

  // Generate JWT token
  const token = generateToken({ userId: newUser.id, role: newUser.role });

  // Return user data without the password
  const { password, ...userWithoutPassword } = newUser;
  return { user: userWithoutPassword, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error("Invalid email or password.");
  }

  // Generate JWT token
  const token = generateToken({ userId: user.id, role: user.role });

  // Return user data without the password
  const { password: userPassword, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
