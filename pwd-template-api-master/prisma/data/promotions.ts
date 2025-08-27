import { DiscountTypeEnum } from "../../src/generated/prisma";

export const promotionsData = [
  {
    code: "JMF2025DISKON10",
    discountAmount: 25000.0,
    discountType: DiscountTypeEnum.FIXED,
    eventName: "Jakarta Music Fest 2025",
    isReferralPromo: false,
    maxRedemptions: 50,
    usedRedemptions: 2,
    startDate: new Date("2025-10-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
  },
  {
    code: "FINTECH50OFF",
    discountAmount: 50.0,
    discountType: DiscountTypeEnum.PERCENTAGE,
    eventName: "Seminar FinTech Masa Depan",
    isReferralPromo: false,
    maxRedemptions: 100,
    usedRedemptions: 1,
    startDate: new Date("2025-08-23T00:00:00Z"),
    endDate: new Date("2025-09-30T23:59:59Z"),
  },
  {
    code: "DISKON20PERSEN",
    discountAmount: 20.0,
    discountType: DiscountTypeEnum.PERCENTAGE,
    eventName: null, // Promosi ini tidak terikat pada event tertentu
    isReferralPromo: false,
    maxRedemptions: 200,
    usedRedemptions: 0,
    startDate: new Date("2025-10-01T00:00:00Z"),
    endDate: new Date("2025-11-30T23:59:59Z"),
  },
  {
    code: "FREEMUSIC100",
    discountAmount: 100000.0,
    discountType: DiscountTypeEnum.FIXED,
    eventName: "Festival Indie Music Bandung",
    isReferralPromo: false,
    maxRedemptions: null, // Tidak ada batasan
    usedRedemptions: 5,
    startDate: new Date("2025-11-10T00:00:00Z"),
    endDate: new Date("2025-11-15T23:59:59Z"),
  },
  {
    code: "SPORTPROMO10",
    discountAmount: 10.0,
    discountType: DiscountTypeEnum.PERCENTAGE,
    eventName: "Turnamen Futsal Piala Nusantara",
    isReferralPromo: false,
    maxRedemptions: 75,
    usedRedemptions: 10,
    startDate: new Date("2025-11-20T00:00:00Z"),
    endDate: new Date("2025-12-05T23:59:59Z"),
  },
];
