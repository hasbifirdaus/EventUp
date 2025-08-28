/// <reference types="node" />

import {
  PrismaClient,
  UsersRoleEnum,
  TransactionStatusEnum,
  TicketStatusEnum,
  EventCategoryEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  DiscountTypeEnum,
  AuditLogActionEnum,
  Prisma,
} from "../src/generated/prisma";

// Import your data files
import { usersData } from "./data/users";
import { organizerProfilesData } from "./data/organizerProfiles";
import { eventsData } from "./data/events";
import { promotionsData } from "./data/promotions";
import { ticketTypesData } from "./data/ticketTypes";
import { transactionsData } from "./data/transactions";
import { transactionItemsData } from "./data/transactionItems";
import { paymentsData } from "./data/payments";
import { reviewsData } from "./data/reviews";
import { pointsData } from "./data/points";
import { referralsData } from "./data/referrals";
import { auditLogsData } from "./data/auditLogs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const BATCH_SIZE = parseInt(process.env.SEED_BATCH_SIZE || "10", 10);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("Starting atomic database seeding process...");

  const userMap = new Map<string, string>();
  const eventMap = new Map<string, number>();
  const promotionMap = new Map<string, number>();
  const ticketTypeMap = new Map<string, number>();

  let referralsSkipped = 0;
  let reviewsSkipped = 0;
  let pointsSkipped = 0;
  let auditLogsSkipped = 0;
  let transactionsFailed = 0;

  console.log(
    "\nSeeding foundational data (Users, Organizers, Referrals, Events, Promotions, TicketTypes)..."
  );

  await prisma.$transaction(async (prisma) => {
    // Seed User
    await prisma.user.createMany({
      data: usersData,
    });
    const createdUsers = await prisma.user.findMany({
      where: {
        username: {
          in: usersData.map((u) => u.username),
        },
      },
    });
    createdUsers.forEach((user) => userMap.set(user.username, user.id));

    // Seed OrganizerProfile
    const organizerProfilesToCreate = organizerProfilesData.map((p: any) => {
      const userId = userMap.get(p.username);
      if (!userId) {
        throw new Error(`User not found for organizer: ${p.username}`);
      }
      return {
        companyName: p.companyName,
        npwp: p.npwp,
        bankAccount: p.bankAccount,
        userId: userId,
      };
    });
    await prisma.organizerProfile.createMany({
      data: organizerProfilesToCreate,
    });

    // Seed Referrals
    const referralsToCreate: Prisma.ReferralCreateManyInput[] = referralsData
      .map((r: any) => {
        const referrerId = userMap.get(r.referrerUsername);
        const referredUserId = userMap.get(r.referredUsername);
        if (!referrerId || !referredUserId) {
          console.error(
            `Skipping referral from '${r.referrerUsername}' to '${r.referredUsername}' due to missing user ID.`
          );
          referralsSkipped++;
          return null;
        }
        return { referrerId, referredUserId };
      })
      .filter((r) => r !== null) as Prisma.ReferralCreateManyInput[];
    await prisma.referral.createMany({ data: referralsToCreate });

    // Seed Events
    const eventsToCreate = eventsData
      .map((e: any) => {
        const organizerId = userMap.get(e.organizerUsername);
        if (!organizerId) {
          console.error(
            `Skipping event '${e.title}' due to missing organizer user: ${e.organizerUsername}`
          );
          return null;
        }

        const startDateTime = new Date(e.startDateTime);
        const endDateTime = e.endDateTime ? new Date(e.endDateTime) : null;

        if (isNaN(startDateTime.getTime())) {
          console.error(
            `Skipping event '${e.title}' due to invalid date format.`
          );
          return null;
        }

        return {
          title: e.title,
          description: e.description,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          location: e.location,
          imageUrl: e.imageUrl,
          category: e.category,
          isActive: e.isActive,
          organizerId: organizerId,
        };
      })
      .filter(Boolean) as Prisma.EventCreateManyInput[];

    await prisma.event.createMany({
      data: eventsToCreate,
    });
    const createdEvents = await prisma.event.findMany({
      where: {
        title: {
          in: eventsData.map((e) => e.title),
        },
      },
    });
    createdEvents.forEach((event) => eventMap.set(event.title, event.id));

    // Seed Promotions
    const promotionsToCreate: Prisma.PromotionCreateManyInput[] = promotionsData
      .map((p: any) => {
        const eventId = p.eventName ? eventMap.get(p.eventName) : null;
        const userId = p.userUsername ? userMap.get(p.userUsername) : null;

        if (p.eventName && !eventId) {
          console.error(
            `Skipping promotion '${p.code}' due to missing event: ${p.eventName}`
          );
          return null;
        }

        if (p.userUsername && !userId) {
          console.error(
            `Skipping promotion '${p.code}' due to missing user: ${p.userUsername}`
          );
          return null;
        }

        return {
          eventId,
          userId,
          name: p.name || p.code,
          code: p.code,
          discountAmount: p.discountAmount,
          discountType: p.discountType,
          isReferralPromo: p.isReferralPromo,
          maxRedemptions: p.maxRedemptions,
          usedRedemptions: p.usedRedemptions,
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
        };
      })
      .filter(Boolean) as Prisma.PromotionCreateManyInput[];
    await prisma.promotion.createMany({
      data: promotionsToCreate,
    });
    const createdPromotions = await prisma.promotion.findMany({
      where: {
        code: {
          in: promotionsData.map((p) => p.code),
        },
      },
    });
    createdPromotions.forEach((p) => promotionMap.set(p.code, p.id));

    // Seed TicketTypes
    const ticketTypesToCreate = ticketTypesData
      .map((tt: any) => {
        const eventId = eventMap.get(tt.eventName);
        if (!eventId) {
          console.error(
            `Skipping ticket type '${tt.name}' due to missing event: ${tt.eventName}`
          );
          return null;
        }
        return {
          eventId: eventId,
          name: tt.name,
          description: tt.description,
          price: tt.price,
          quota: tt.quota,
          isAvailable: tt.isAvailable,
          isSeated: tt.isSeated,
        };
      })
      .filter(Boolean) as Prisma.TicketTypeCreateManyInput[];
    await prisma.ticketType.createMany({
      data: ticketTypesToCreate,
    });
    const createdTicketTypes = await prisma.ticketType.findMany({
      where: {
        name: {
          in: ticketTypesData.map((tt) => tt.name),
        },
        eventId: {
          in: ticketTypesData.map((tt) => eventMap.get(tt.eventName) || 0),
        },
      },
    });
    createdTicketTypes.forEach((tt) => {
      const originalTicketType = ticketTypesData.find(
        (data: any) =>
          data.name === tt.name && eventMap.get(data.eventName) === tt.eventId
      );
      if (originalTicketType) {
        ticketTypeMap.set(`${originalTicketType.eventName}-${tt.name}`, tt.id);
      }
    });
  });
  console.log("✅ Foundational data seeded successfully.");

  console.log("\nSeeding Transactions, Items, and Payments atomically...");
  let successCount = 0;

  for (let i = 0; i < transactionsData.length; i += BATCH_SIZE) {
    const batch = transactionsData.slice(i, i + BATCH_SIZE);

    const promises = batch.map(async (t) => {
      try {
        await prisma.$transaction(async (prisma) => {
          const userId = userMap.get(t.userUsername);
          const eventId = eventMap.get(t.eventName);
          const promotionId = t.promotionCode
            ? promotionMap.get(t.promotionCode)
            : null;

          if (!userId || !eventId) {
            throw new Error(
              `Missing ID for user '${t.userUsername}' or event '${t.eventName}'.`
            );
          }

          const transactionDate = Date.parse(t.createdAt);
          if (isNaN(transactionDate)) {
            throw new Error(
              `Invalid transaction date for user '${t.userUsername}' and event '${t.eventName}': ${t.createdAt}`
            );
          }

          const createdTransaction = await prisma.transaction.create({
            data: {
              userId,
              eventId,
              promotionId,
              totalAmount: new Prisma.Decimal(t.amount),
              status: t.status as TransactionStatusEnum,
              pointUsed: t.redemptionPoints,
              createdAt: new Date(transactionDate),
            },
          });

          const relatedTransactionItems = transactionItemsData.filter(
            (ti) =>
              ti.userUsername === t.userUsername && ti.eventName === t.eventName
          );

          const transactionItemsToCreate: Prisma.TransactionItemCreateManyInput[] =
            [];

          for (const ti of relatedTransactionItems) {
            const ticketTypeId = ticketTypeMap.get(
              `${ti.eventName}-${ti.ticketTypeName}`
            );
            if (!ticketTypeId) {
              throw new Error(
                `Missing ticket type ID for '${ti.ticketTypeName}'.`
              );
            }
            transactionItemsToCreate.push({
              transactionId: createdTransaction.id,
              ticketTypeId,
              quantity: ti.quantity,
              unitPrice: ti.unitPrice,
              discountApplied: ti.discountApplied || 0,
            });
          }

          await prisma.transactionItem.createMany({
            data: transactionItemsToCreate,
          });

          const createdTransactionItems = await prisma.transactionItem.findMany(
            {
              where: { transactionId: createdTransaction.id },
            }
          );

          const ticketsToCreate: Prisma.TicketCreateManyInput[] = [];

          for (const createdItem of createdTransactionItems) {
            const originalItemData = relatedTransactionItems.find(
              (ti) =>
                ticketTypeMap.get(`${ti.eventName}-${ti.ticketTypeName}`) ===
                createdItem.ticketTypeId
            );

            if (originalItemData) {
              const originalTicketType = ticketTypesData.find(
                (tt: any) =>
                  tt.name === originalItemData.ticketTypeName &&
                  eventMap.get(tt.eventName) === eventId
              );
              const isSeated = originalTicketType?.isSeated || false;

              for (let j = 0; j < originalItemData.quantity; j++) {
                ticketsToCreate.push({
                  eventId,
                  ticketTypeId: createdItem.ticketTypeId,
                  ownerId: userId,
                  transactionItemId: createdItem.id,
                  ticketCode: `TKT-${uuidv4()}`,
                  status: TicketStatusEnum.SOLD,
                  seatNumber: isSeated
                    ? `A-${eventId}-${createdItem.id}-${j + 1}`
                    : null,
                });
              }
            }
          }

          if (ticketsToCreate.length > 0) {
            await prisma.ticket.createMany({
              data: ticketsToCreate,
            });
          }

          const relatedPayments = paymentsData.filter(
            (p) =>
              p.userUsername === t.userUsername && p.eventName === t.eventName
          );

          for (const p of relatedPayments) {
            await prisma.payment.create({
              data: {
                amount: p.amount,
                transactionId: createdTransaction.id,
                method: p.method as PaymentMethodEnum,
                status: String(p.status).toUpperCase() as PaymentStatusEnum,
              },
            });
          }
          successCount++;
        });
      } catch (e) {
        transactionsFailed++;
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(
            `❌ Prisma error (${e.code}) for user '${t.userUsername}' and event '${t.eventName}': ${e.message}`
          );
        } else {
          console.error(
            `❌ Unexpected error for user '${t.userUsername}' and event '${t.eventName}': ${e instanceof Error ? e.message : e}`
          );
        }
      }
    });
    await Promise.allSettled(promises);
    await delay(2000);
  }

  console.log(
    `✅ ${successCount} transactions, items, tickets, and payments created successfully.`
  );
  if (transactionsFailed > 0) {
    console.log(
      `❌ ${transactionsFailed} transactions failed and were rolled back.`
    );
  }

  console.log("\nSeeding Reviews, Points, and AuditLogs...");
  await prisma.$transaction(async (prisma) => {
    const reviewsToCreate = reviewsData
      .map((r: any) => {
        const userId = userMap.get(r.userUsername);
        const eventId = eventMap.get(r.eventName);
        if (!userId || !eventId) {
          console.error(
            `Skipping review for user '${r.userUsername}' or event '${r.eventName}' due to missing ID.`
          );
          reviewsSkipped++;
          return null;
        }
        const reviewDate = Date.parse(r.createdAt);
        if (isNaN(reviewDate)) {
          console.error(
            `Skipping review for user '${r.userUsername}' due to invalid creation date: ${r.createdAt}`
          );
          return null;
        }
        return {
          userId,
          eventId,
          rating: r.rating,
          comment: r.comment,
          createdAt: new Date(reviewDate),
        };
      })
      .filter(Boolean) as Prisma.ReviewCreateManyInput[];
    await prisma.review.createMany({ data: reviewsToCreate });

    const pointsToCreate = pointsData
      .map((p: any) => {
        const userId = userMap.get(p.userUsername);
        if (!userId) {
          console.error(
            `Skipping points for user '${p.userUsername}' due to missing ID.`
          );
          pointsSkipped++;
          return null;
        }
        const expirationDate = Date.parse(p.expirationDate);
        if (isNaN(expirationDate)) {
          console.error(
            `Skipping points for user '${p.userUsername}' due to invalid expiration date: ${p.expirationDate}`
          );
          return null;
        }
        return {
          userId,
          amount: p.amount,
          expirationDate: new Date(expirationDate),
        };
      })
      .filter(Boolean) as Prisma.PointCreateManyInput[];
    await prisma.point.createMany({ data: pointsToCreate });

    const auditLogsToCreate = auditLogsData
      .map((al: any) => {
        const userId = userMap.get(al.userUsername);
        if (!userId) {
          console.error(
            `Skipping audit log for user '${al.userUsername}' due to missing ID.`
          );
          auditLogsSkipped++;
          return null;
        }
        const createdAt = al.createdAt ? new Date(al.createdAt) : new Date();
        const action = al.action as AuditLogActionEnum;
        return { userId, action, details: al.details, createdAt };
      })
      .filter(Boolean) as Prisma.AuditLogCreateManyInput[];
    await prisma.auditLog.createMany({ data: auditLogsToCreate });
  });
  console.log("✅ Reviews, Points, and AuditLogs seeded successfully.");

  console.log("\n--- Seeding Summary ---");
  console.log(`✅ Total successful transactions: ${successCount}`);
  console.log(`❌ Total failed transactions: ${transactionsFailed}`);
  console.log(`- Total records skipped (due to missing data):`);
  console.log(`   - Referrals: ${referralsSkipped}`);
  console.log(`   - Reviews: ${reviewsSkipped}`);
  console.log(`   - Points: ${pointsSkipped}`);
  console.log(`   - AuditLogs: ${auditLogsSkipped}`);
  console.log("------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Seeding process finished.");
  });
