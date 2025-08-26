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

const prisma = new PrismaClient();

async function main() {
  console.log("Starting atomic database seeding process...");

  // Maps untuk menyimpan ID.
  const userMap = new Map<string, string>();
  const eventMap = new Map<string, number>();
  const promotionMap = new Map<string, number>();
  const ticketTypeMap = new Map<string, number>();

  let usersSkipped = 0;
  let referralsSkipped = 0;
  let reviewsSkipped = 0;
  let pointsSkipped = 0;
  let auditLogsSkipped = 0;
  let transactionsSkipped = 0;

  // --- Langkah 1: Seed data yang tidak memiliki dependensi siklus
  // (tetap di luar transaksi karena volume dan independensinya)
  console.log(
    "\nSeeding foundational data (Users, Organizers, Referrals, Events, Promotions, TicketTypes)..."
  );

  await prisma.$transaction(async (prisma) => {
    // Seed User
    // NOTE: createMany tidak mengembalikan ID, jadi kita ambil ID-nya setelahnya
    // NOTE: createdAt dihandle secara otomatis oleh database, jadi tidak perlu ditambahkan secara manual.
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
        return { referrerId, referredUserId, discountAmount: r.discountAmount };
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
        // Validasi dan parsing tanggal yang lebih aman
        const startDate = Date.parse(e.startDateTime);
        if (isNaN(startDate)) {
          console.error(
            `Skipping event '${e.title}' due to invalid start date format: ${e.startDateTime}`
          );
          return null;
        }
        return {
          title: e.title,
          description: e.description,
          startDateTime: new Date(startDate),
          location: e.location,
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
        if (p.eventName && !eventId) {
          console.error(
            `Skipping promotion '${p.code}' due to missing event: ${p.eventName}`
          );
          return null;
        }
        return {
          eventId: eventId,
          code: p.code,
          discountAmount: p.discountAmount,
          discountType: p.discountType,
          isReferralPromo: p.isReferralPromo,
          maxRedemptions: p.maxRedemptions,
          usedRedemptions: p.usedRedemptions,
          startDate: p.startDate,
          endDate: p.endDate,
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

  // --- Langkah 2: Seed data yang saling bergantung dalam transaksi yang lebih kecil
  console.log("\nSeeding Transactions, Items, and Payments atomically...");
  let successCount = 0;
  let failCount = 0;

  // NOTE: Pendekatan loop ini memastikan setiap transaksi bersifat atomik.
  // Untuk data dalam jumlah besar (misalnya 1000+), Anda dapat mempertimbangkan
  // untuk membuat "batch" transaksi untuk performa yang lebih baik.

  for (const t of transactionsData) {
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

        // Validasi dan parsing tanggal yang lebih aman
        const transactionDate = Date.parse(t.createdAt);
        if (isNaN(transactionDate)) {
          throw new Error(
            `Invalid transaction date for user '${t.userUsername}' and event '${t.eventName}': ${t.createdAt}`
          );
        }

        // CREATE TRANSACTION
        const createdTransaction = await prisma.transaction.create({
          data: {
            userId,
            eventId,
            promotionId,
            amount: t.amount,
            status: t.status,
            redemptionPoints: t.redemptionPoints,
            createdAt: new Date(transactionDate),
          },
        });

        // CREATE TRANSACTION ITEMS & TICKETS
        const relatedTransactionItems = transactionItemsData.filter(
          (ti) =>
            ti.userUsername === t.userUsername && ti.eventName === t.eventName
        );

        // Array untuk menampung semua data tiket
        const ticketsToCreate: Prisma.TicketCreateManyInput[] = [];

        for (const ti of relatedTransactionItems) {
          const ticketTypeId = ticketTypeMap.get(
            `${ti.eventName}-${ti.ticketTypeName}`
          );
          if (!ticketTypeId) {
            throw new Error(
              `Missing ticket type ID for '${ti.ticketTypeName}'.`
            );
          }

          const createdTransactionItem = await prisma.transactionItem.create({
            data: {
              transactionId: createdTransaction.id,
              ticketTypeId,
              quantity: ti.quantity,
              unitPrice: ti.unitPrice,
              discountApplied: ti.discountApplied || 0,
            },
          });

          // CREATE TICKETS - Kumpulkan data tiket
          const originalTicketType = ticketTypesData.find(
            (tt: any) =>
              tt.name === ti.ticketTypeName &&
              eventMap.get(tt.eventName) === eventId
          );
          const isSeated = originalTicketType?.isSeated || false;

          for (let i = 0; i < ti.quantity; i++) {
            ticketsToCreate.push({
              eventId: eventId,
              ownerId: userId,
              transactionItemId: createdTransactionItem.id,
              // Menggunakan UUID untuk memastikan uniqueness yang stabil di antara seeding.
              ticketCode: `TKT-${crypto.randomUUID()}`,
              status: TicketStatusEnum.sold,
              isSeated: isSeated,
              seatNumber: isSeated
                ? `A-${createdTransactionItem.id}-${i + 1}`
                : null,
            });
          }
        }

        // Lakukan bulk insertion untuk semua tiket
        if (ticketsToCreate.length > 0) {
          await prisma.ticket.createMany({
            data: ticketsToCreate,
          });
        }

        // CREATE PAYMENTS
        const relatedPayments = paymentsData.filter(
          (p) =>
            p.userUsername === t.userUsername && p.eventName === t.eventName
        );
        for (const p of relatedPayments) {
          await prisma.payment.create({
            data: {
              amount: p.amount,
              transactionId: createdTransaction.id,
              method: p.method,
              status: p.status,
            },
          });
        }
        successCount++;
      });
    } catch (e) {
      console.error(
        `❌ Transaction failed for user '${t.userUsername}' and event '${t.eventName}':`,
        e
      );
      failCount++;
      transactionsSkipped++;
    }
  }

  console.log(
    `✅ ${successCount} transactions, items, tickets, and payments created successfully.`
  );
  if (failCount > 0) {
    console.log(`❌ ${failCount} transactions failed and were rolled back.`);
  }

  // --- Langkah 3: Seed data lainnya yang tidak saling bergantung
  console.log("\nSeeding Reviews, Points, and AuditLogs...");
  await prisma.$transaction(async (prisma) => {
    // Seed Reviews
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
        // Validasi dan parsing tanggal yang lebih aman
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

    // Seed Points
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
        // Validasi dan parsing tanggal yang lebih aman
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

    // Seed AuditLogs
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
        return { userId, action: al.action, details: al.details };
      })
      .filter(Boolean) as Prisma.AuditLogCreateManyInput[];
    await prisma.auditLog.createMany({ data: auditLogsToCreate });
  });
  console.log("✅ Reviews, Points, and AuditLogs seeded successfully.");

  console.log("\n--- Seeding Summary ---");
  console.log(`✅ Total successful transactions: ${successCount}`);
  console.log(`❌ Total failed transactions: ${failCount}`);
  console.log(`- Total records skipped (due to missing data):`);
  console.log(`  - Referrals: ${referralsSkipped}`);
  console.log(`  - Reviews: ${reviewsSkipped}`);
  console.log(`  - Points: ${pointsSkipped}`);
  console.log(`  - AuditLogs: ${auditLogsSkipped}`);
  console.log(`  - Transactions (handled by catch): ${transactionsSkipped}`);
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