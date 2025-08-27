import {
  PrismaClient,
  Prisma,
  UsersRoleEnum,
  DiscountTypeEnum,
} from "../generated/prisma";
import { config } from "../config/index";

export const handleReferral = async (
  prisma: PrismaClient,
  referredUserEmail: string,
  referralCode: string
): Promise<void> => {
  const referrer = await prisma.user.findUnique({
    where: { referralCode: referralCode },
  });

  if (!referrer) {
    // If referral code is not found, we don't proceed with referral logic
    // but the registration can still continue.
    console.warn(
      `Referral code '${referralCode}' not found. Skipping referral logic.`
    );
    return;
  }

  // Find the newly registered user to link the referral
  const referredUser = await prisma.user.findUnique({
    where: { email: referredUserEmail },
  });

  if (!referredUser) {
    // This case should ideally not happen if called right after user creation
    console.error(`Referred user with email '${referredUserEmail}' not found.`);
    return;
  }

  // Start a transaction for creating both referral record and promotion/points
  await prisma.$transaction(async (tx) => {
    // 1. Create a Referral record
    await tx.referral.create({
      data: {
        referrerId: referrer.id,
        referredUserId: referredUser.id,
      },
    });

    // 2. Give points to the referrer
    await tx.point.create({
      data: {
        userId: referrer.id,
        amount: config.referral.points,
        expirationDate: new Date(
          Date.now() + config.referral.validityInDays * 24 * 60 * 60 * 1000
        ),
      },
    });

    // 3. Give a referral promo to the newly registered user
    const endDate = new Date(
      Date.now() + config.referral.validityInDays * 24 * 60 * 60 * 1000
    );
    const promoCode = `REFERRAL-${referredUser.username.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    await tx.promotion.create({
      data: {
        userId: referredUser.id,
        name: "Referral Discount",
        code: promoCode,
        discountAmount: new Prisma.Decimal(config.referral.discount),
        discountType: DiscountTypeEnum.PERCENTAGE,
        isReferralPromo: true,
        maxRedemptions: 1,
        usedRedemptions: 0,
        startDate: new Date(),
        endDate: endDate,
      },
    });
  });

  console.log(
    `Referral successful: ${referrer.username} referred ${referredUser.username}. Points and promo created.`
  );
};
