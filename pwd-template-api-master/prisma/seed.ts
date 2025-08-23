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
  await prisma.payment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.transactionItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organizerProfile.deleteMany();
  await prisma.point.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  console.log("All existing data has been deleted. Ready to seed.");

  // Maps untuk menyimpan ID yang baru dibuat
  const userMap = new Map();
  const eventMap = new Map();
  const promotionMap = new Map();
  const ticketTypeMap = new Map();
  const transactionMap = new Map();
  const transactionItemMap = new Map();

  // --- Langkah 1: Seed User (model tanpa dependensi)
  console.log("\nSeeding User data...");
  const createdUsers = await prisma.user.createManyAndReturn({
    data: usersData,
  });
  createdUsers.forEach((user) => userMap.set(user.username, user.id));
  console.log(`✅ ${createdUsers.length} users created.`);

  // --- Langkah 2: Seed OrganizerProfile dan Referral (bergantung pada User)
  console.log("Seeding OrganizerProfiles and Referrals...");
  const organizerProfilesToCreate = organizerProfilesData.map((p) => ({
    // Hapus properti 'username' dari sini
    companyName: p.companyName,
    npwp: p.npwp,
    bankAccount: p.bankAccount,
    userId: userMap.get(p.username)!,
  }));
  await prisma.organizerProfile.createMany({ data: organizerProfilesToCreate });
  console.log(
    `✅ ${organizerProfilesToCreate.length} organizer profiles created.`
  );

  // --- Langkah 3: Seed Events dan Promotions (bergantung pada User)
  console.log("Seeding Events and Promotions...");
  const eventsToCreate = eventsData.map((e) => ({
    // Hapus properti 'organizerUsername' dari sini
    title: e.title,
    description: e.description,
    startDateTime: e.startDateTime,
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

  // --- Langkah 4: Seed TicketTypes (bergantung pada Event)
  console.log("Seeding TicketTypes...");
  const ticketTypesToCreate = ticketTypesData.map((tt) => ({
    // Hapus properti 'eventName' dari sini
    name: tt.name,
    description: tt.description,
    price: tt.price,
    quota: tt.quota,
    isAvailable: tt.isAvailable,
    isSeated: tt.isSeated,
    eventId: eventMap.get(tt.eventName)!,
  }));
  const createdTicketTypes = await prisma.ticketType.createManyAndReturn({
    data: ticketTypesToCreate,
  });
  createdTicketTypes.forEach((tt) => {
    const originalTicketType = ticketTypesData.find(
      (data) =>
        data.name === tt.name && eventMap.get(data.eventName) === tt.eventId
    );
    if (originalTicketType) {
      ticketTypeMap.set(`${originalTicketType.eventName}-${tt.name}`, tt.id);
    }
  });
  console.log(`✅ ${createdTicketTypes.length} ticket types created.`);

  // --- Langkah 5: Seed Transactions (bergantung pada User, Event, Promotion)
  console.log("Seeding Transactions...");

  const transactionsToCreate = transactionsData
    .map((t) => {
      const userId = userMap.get(t.userUsername);
      const eventId = eventMap.get(t.eventName);
      const promotionId = t.promotionCode
        ? promotionMap.get(t.promotionCode)
        : null;

      if (!userId || !eventId) {
        console.error(
          `Skipping transaction for user '${t.userUsername}' or event '${t.eventName}' due to missing ID.`
        );
        return null;
      }

      return {
        amount: t.amount,
        status: t.status,
        redemptionPoints: t.redemptionPoints,
        createdAt: new Date(t.createdAt),
        userId: userId,
        eventId: eventId,
        // Hapus 'ticketTypeId' dari sini
        promotionId: promotionId,
      };
    })
    .filter(Boolean) as any;

  const createdTransactions = await prisma.transaction.createManyAndReturn({
    data: transactionsToCreate,
  });

  createdTransactions.forEach((t) =>
    transactionMap.set(`${t.userId}-${t.eventId}`, t.id)
  );
  console.log(`✅ ${createdTransactions.length} transactions created.`);

  // --- Langkah 6: Seed TransactionItems (bergantung pada Transaction, TicketType)
  console.log("Seeding TransactionItems...");

  const transactionItemsToCreate = transactionItemsData
    .map((ti) => {
      const userId = userMap.get(ti.userUsername);
      const eventId = eventMap.get(ti.eventName);
      const transactionId = transactionMap.get(`${userId}-${eventId}`);
      const ticketTypeId = ticketTypeMap.get(
        `${ti.eventName}-${ti.ticketTypeName}`
      );

      // Log a warning and return null if any ID is missing
      if (!transactionId || !ticketTypeId) {
        console.error(
          `Skipping transaction item for user '${ti.userUsername}', event '${ti.eventName}', or ticket type '${ti.ticketTypeName}' due to missing ID.`
        );
        return null;
      }

      return {
        quantity: ti.quantity,
        unitPrice: ti.unitPrice,
        transactionId,
        ticketTypeId,
      };
    })
    .filter(Boolean) as any; // The fix is here: 'as any'

  const createdTransactionItems =
    await prisma.transactionItem.createManyAndReturn({
      data: transactionItemsToCreate,
    });

  createdTransactionItems.forEach((ti, index) => {
    const originalItem = transactionItemsData[index];
    if (originalItem) {
      transactionItemMap.set(`${originalItem.userUsername}-${ti.id}`, ti.id);
    }
  });

  console.log(
    `✅ ${createdTransactionItems.length} transaction items created.`
  );
  // --- Langkah 7: Seed Payments, Reviews, Points, dan AuditLogs
  console.log("\nSeeding Payments, Reviews, Points, and AuditLogs...");

  // Seed Payments
  console.log("Seeding Payments...");
  const paymentsToCreate = paymentsData
    .map((p) => {
      const userId = userMap.get(p.userUsername);
      const eventId = eventMap.get(p.eventName);
      const transactionId = transactionMap.get(`${userId}-${eventId}`);

      if (!transactionId) {
        console.error(
          `Skipping payment for user '${p.userUsername}' and event '${p.eventName}' due to missing transaction ID.`
        );
        return null;
      }

      return {
        amount: p.amount,
        status: p.status,
        method: p.method,
        transactionId: transactionId,
      };
    })
    .filter(Boolean) as any;

  await prisma.payment.createMany({
    data: paymentsToCreate,
  });
  console.log(`✅ ${paymentsToCreate.length} payments created.`);

  // Seed Reviews
  console.log("Seeding Reviews...");
  const reviewsToCreate = reviewsData
    .map((r) => {
      const userId = userMap.get(r.userUsername);
      const eventId = eventMap.get(r.eventName);

      if (!userId || !eventId) {
        console.error(
          `Skipping review for user '${r.userUsername}' or event '${r.eventName}' due to missing ID.`
        );
        return null;
      }

      return {
        rating: r.rating,
        comment: r.comment,
        createdAt: new Date(r.createdAt),
        userId: userId,
        eventId: eventId,
      };
    })
    .filter(Boolean) as any;

  await prisma.review.createMany({ data: reviewsToCreate });
  console.log(`✅ ${reviewsToCreate.length} reviews created.`);

  // Seed Points
  console.log("Seeding Points...");
  const pointsToCreate = pointsData
    .map((p) => {
      const userId = userMap.get(p.userUsername);

      if (!userId) {
        console.error(
          `Skipping points for user '${p.userUsername}' due to missing ID.`
        );
        return null;
      }

      return {
        amount: p.amount,
        expirationDate: p.expirationDate,
        userId: userId,
      };
    })
    .filter(Boolean) as any;
  await prisma.point.createMany({ data: pointsToCreate });
  console.log(`✅ ${pointsToCreate.length} points created.`);

  // Seed AuditLogs
  console.log("Seeding AuditLogs...");
  const auditLogsToCreate = auditLogsData
    .map((al) => {
      const userId = userMap.get(al.userUsername);

      if (!userId) {
        console.error(
          `Skipping audit log for user '${al.userUsername}' due to missing ID.`
        );
        return null;
      }

      return {
        action: al.action,
        details: al.details,
        userId: userId,
      };
    })
    .filter(Boolean) as any;
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
