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
  console.log("Starting database seeding process...");

  // Hapus semua data yang ada untuk menghindari duplikasi dan konflik relasi
  // Urutan penghapusan harus terbalik dari urutan pembuatan karena foreign key
  // await prisma.payment.deleteMany();
  // await prisma.ticket.deleteMany();
  // await prisma.transactionItem.deleteMany();
  // await prisma.review.deleteMany();
  // await prisma.transaction.deleteMany();
  // await prisma.ticketType.deleteMany();
  // await prisma.promotion.deleteMany();
  // await prisma.event.deleteMany();
  // await prisma.organizerProfile.deleteMany();
  // await prisma.point.deleteMany();
  // await prisma.referral.deleteMany();
  // await prisma.auditLog.deleteMany();
  // await prisma.user.deleteMany();

  // console.log("All existing data has been deleted. Ready to seed.");

  // Maps untuk menyimpan ID.
  const userMap = new Map<string, string>();
  const eventMap = new Map<string, number>();
  const promotionMap = new Map<string, number>();
  const ticketTypeMap = new Map<string, number>();
  const transactionMap = new Map<string, number>();
  const transactionItemMap = new Map<string, number>();

  // --- Langkah 1: Seed User
  console.log("\nSeeding User data...");
  const createdUsers = await prisma.user.createManyAndReturn({
    data: usersData,
  });
  createdUsers.forEach((user) => userMap.set(user.username, user.id));
  console.log(`✅ ${createdUsers.length} users created.`);

  // --- Langkah 2: Seed OrganizerProfile dan Referral
  console.log("Seeding OrganizerProfiles...");
  const organizerProfilesToCreate = organizerProfilesData.map((p: any) => ({
    companyName: p.companyName,
    npwp: p.npwp,
    bankAccount: p.bankAccount,
    userId: userMap.get(p.username)!,
  }));
  await prisma.organizerProfile.createMany({ data: organizerProfilesToCreate });
  console.log(
    `✅ ${organizerProfilesToCreate.length} organizer profiles created.`
  );

  console.log("Seeding Referrals...");
  const referralsToCreate: Prisma.ReferralCreateManyInput[] = referralsData
    .map((r: any) => {
      const referrerId = userMap.get(r.referrerUsername);
      const referredUserId = userMap.get(r.referredUsername);
      if (!referrerId || !referredUserId) {
        console.error(
          `Skipping referral from '${r.referrerUsername}' to '${r.referredUsername}' due to missing user ID.`
        );
        return null;
      }
      return {
        referrerId,
        referredUserId,
        discountAmount: r.discountAmount,
      };
    })
    .filter((r) => r !== null) as Prisma.ReferralCreateManyInput[];
  await prisma.referral.createMany({ data: referralsToCreate });
  console.log(`✅ ${referralsToCreate.length} referrals created.`);

  // --- Langkah 3: Seed Events
  console.log("Seeding Events...");
  const eventsToCreate = eventsData.map((e: any) => ({
    title: e.title,
    description: e.description,
    startDateTime: new Date(e.startDateTime),
    location: e.location,
    category: e.category,
    isActive: e.isActive,
    organizerId: userMap.get(e.organizerUsername)!,
  }));
  const createdEvents = await prisma.event.createManyAndReturn({
    data: eventsToCreate,
  });
  createdEvents.forEach((event) => eventMap.set(event.title, event.id));
  console.log(`✅ ${createdEvents.length} events created.`);

  // --- Langkah 4: Seed Promotions dan TicketTypes
  console.log("Seeding Promotions...");
  const promotionsToCreate: Prisma.PromotionCreateManyInput[] =
    promotionsData.map((p: any) => ({
      eventId: p.eventName ? eventMap.get(p.eventName) : null,
      code: p.code,
      discountAmount: p.discountAmount,
      discountType: p.discountType,
      isReferralPromo: p.isReferralPromo,
      maxRedemptions: p.maxRedemptions,
      usedRedemptions: p.usedRedemptions,
      startDate: p.startDate,
      endDate: p.endDate,
    }));
  const createdPromotions = await prisma.promotion.createManyAndReturn({
    data: promotionsToCreate,
  });
  createdPromotions.forEach((p) => promotionMap.set(p.code, p.id));
  console.log(`✅ ${createdPromotions.length} promotions created.`);

  console.log("Seeding TicketTypes...");
  const ticketTypesToCreate = ticketTypesData.map((tt: any) => ({
    eventId: eventMap.get(tt.eventName)!,
    name: tt.name,
    description: tt.description,
    price: tt.price,
    quota: tt.quota,
    isAvailable: tt.isAvailable,
    isSeated: tt.isSeated,
  }));
  const createdTicketTypes = await prisma.ticketType.createManyAndReturn({
    data: ticketTypesToCreate,
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
  console.log(`✅ ${createdTicketTypes.length} ticket types created.`);

  // --- Langkah 5, 6, 7: Seed Transactions, TransactionItems, Tickets, dan Payments secara berurutan
  console.log("\nSeeding Transactions, Items, and Payments sequentially...");
  let transactionCount = 0;
  let transactionItemCount = 0;
  let ticketCount = 0;
  let paymentCount = 0;

  for (const t of transactionsData) {
    const userId = userMap.get(t.userUsername);
    const eventId = eventMap.get(t.eventName);
    const promotionId = t.promotionCode
      ? promotionMap.get(t.promotionCode)
      : null;

    if (!userId || !eventId) {
      console.error(
        `Skipping transaction for user '${t.userUsername}' or event '${t.eventName}' due to missing ID.`
      );
      continue;
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
        createdAt: new Date(t.createdAt),
      },
    });
    transactionCount++;

    // CREATE TRANSACTION ITEMS & TICKETS
    const relatedTransactionItems = transactionItemsData.filter(
      (ti) => ti.userUsername === t.userUsername && ti.eventName === t.eventName
    );

    for (const ti of relatedTransactionItems) {
      const ticketTypeId = ticketTypeMap.get(
        `${ti.eventName}-${ti.ticketTypeName}`
      );
      if (!ticketTypeId) {
        console.error(
          `Skipping transaction item for user '${ti.userUsername}', event '${ti.eventName}', or ticket type '${ti.ticketTypeName}' due to missing ID.`
        );
        continue;
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
      transactionItemCount++;

      // CREATE TICKETS
      const originalTicketType = ticketTypesData.find(
        (tt: any) =>
          tt.name === ti.ticketTypeName &&
          eventMap.get(tt.eventName) === eventId
      );

      const isSeated = originalTicketType?.isSeated || false;

      for (let i = 0; i < ti.quantity; i++) {
        await prisma.ticket.create({
          data: {
            eventId: eventId,
            ownerId: userId,
            transactionItemId: createdTransactionItem.id,
            ticketCode: `TKT-${createdTransactionItem.id}-${i + 1}`,
            status: TicketStatusEnum.sold,
            isSeated: isSeated,
            seatNumber: isSeated
              ? `A-${createdTransactionItem.id}-${i + 1}`
              : null,
          },
        });
        ticketCount++;
      }
    }

    // CREATE PAYMENTS
    const relatedPayments = paymentsData.filter(
      (p) => p.userUsername === t.userUsername && p.eventName === t.eventName
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
      paymentCount++;
    }
  }

  console.log(`✅ ${transactionCount} transactions created.`);
  console.log(`✅ ${transactionItemCount} transaction items created.`);
  console.log(`✅ ${ticketCount} tickets created.`);
  console.log(`✅ ${paymentCount} payments created.`);

  // --- Langkah 8: Seed Reviews, Points, dan AuditLogs (Sama seperti sebelumnya)
  console.log("\nSeeding Reviews, Points, and AuditLogs...");
  const reviewsToCreate: Prisma.ReviewCreateManyInput[] = reviewsData
    .map((r: any) => {
      const userId = userMap.get(r.userUsername);
      const eventId = eventMap.get(r.eventName);
      if (!userId || !eventId) {
        console.error(
          `Skipping review for user '${r.userUsername}' or event '${r.eventName}' due to missing ID.`
        );
        return null;
      }
      return {
        userId,
        eventId,
        rating: r.rating,
        comment: r.comment,
        createdAt: new Date(r.createdAt),
      };
    })
    .filter(Boolean) as Prisma.ReviewCreateManyInput[];
  await prisma.review.createMany({ data: reviewsToCreate });
  console.log(`✅ ${reviewsToCreate.length} reviews created.`);

  const pointsToCreate: Prisma.PointCreateManyInput[] = pointsData
    .map((p: any) => {
      const userId = userMap.get(p.userUsername);
      if (!userId) {
        console.error(
          `Skipping points for user '${p.userUsername}' due to missing ID.`
        );
        return null;
      }
      return {
        userId,
        amount: p.amount,
        expirationDate: new Date(p.expirationDate),
      };
    })
    .filter(Boolean) as Prisma.PointCreateManyInput[];
  await prisma.point.createMany({ data: pointsToCreate });
  console.log(`✅ ${pointsToCreate.length} points created.`);

  const auditLogsToCreate: Prisma.AuditLogCreateManyInput[] = auditLogsData
    .map((al: any) => {
      const userId = userMap.get(al.userUsername);
      if (!userId) {
        console.error(
          `Skipping audit log for user '${al.userUsername}' due to missing ID.`
        );
        return null;
      }
      return {
        userId,
        action: al.action,
        details: al.details,
      };
    })
    .filter(Boolean) as Prisma.AuditLogCreateManyInput[];
  await prisma.auditLog.createMany({ data: auditLogsToCreate });
  console.log(`✅ ${auditLogsToCreate.length} audit logs created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
