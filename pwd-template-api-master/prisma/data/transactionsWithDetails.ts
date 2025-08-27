// seed/data/transactionsWithDetails.ts

import {
  TransactionStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "../../src/generated/prisma";

export const transactionsWithDetailsData = [
  // Transaksi 1: riki.s - Jakarta Music Fest 2025
  {
    userUsername: "riki.s",
    eventName: "Jakarta Music Fest 2025",
    promotionCode: "JMF2025DISKON10",
    amount: 225000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-08-20T11:00:00Z",
    items: [
      {
        ticketTypeName: "Early Bird",
        quantity: 1,
        unitPrice: 250000,
        discountApplied: 25000, // Menghitung 10% diskon dari total
      },
    ],
    payment: {
      amount: 225000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.BCA_TRANSFER,
    },
  },
  // Transaksi 2: aditya.p - Jakarta Music Fest 2025
  {
    userUsername: "aditya.p",
    eventName: "Jakarta Music Fest 2025",
    promotionCode: "JMF2025DISKON10",
    amount: 850000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-08-20T12:00:00Z",
    items: [
      {
        ticketTypeName: "Presale 1",
        quantity: 1,
        unitPrice: 350000,
        discountApplied: 35000,
      },
      {
        ticketTypeName: "Early Bird",
        quantity: 2,
        unitPrice: 250000,
        discountApplied: 50000,
      },
    ],
    payment: {
      amount: 850000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.DANA,
    },
  },
  // Transaksi 3: doni.s - Konferensi Teknologi Masa Depan
  {
    userUsername: "doni.s",
    eventName: "Konferensi Teknologi Masa Depan",
    promotionCode: null,
    amount: 150000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 15000,
    createdAt: "2025-10-08T15:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 150000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 150000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.GOPAY,
    },
  },
  // Transaksi 4: riki.s - Retret Yoga dan Meditasi di Bali
  {
    userUsername: "riki.s",
    eventName: "Retret Yoga dan Meditasi di Bali",
    promotionCode: null,
    amount: 3000000,
    status: TransactionStatusEnum.PENDING,
    redemptionPoints: null,
    createdAt: "2025-10-22T09:00:00Z",
    items: [
      {
        ticketTypeName: "VIP",
        quantity: 2,
        unitPrice: 1500000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 3000000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.BCA_TRANSFER,
    },
  },
  // Transaksi 5: yoga.s - Workshop Desain UX/UI Intensif
  {
    userUsername: "yoga.s",
    eventName: "Workshop Desain UX/UI Intensif",
    promotionCode: null,
    amount: 500000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-10-14T18:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 500000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 500000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.BCA_TRANSFER,
    },
  },
  // Transaksi 6: aditya.p - Turnamen Futsal Piala Nusantara
  {
    userUsername: "aditya.p",
    eventName: "Turnamen Futsal Piala Nusantara",
    promotionCode: "SPORTPROMO10",
    amount: 900000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-11-20T10:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 1000000,
        discountApplied: 100000,
      },
    ],
    payment: {
      amount: 900000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.DANA,
    },
  },
  // Transaksi 7: syifa.n - Konferensi Data Science Indonesia
  {
    userUsername: "syifa.n",
    eventName: "Konferensi Data Science Indonesia",
    promotionCode: null,
    amount: 250000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-11-15T11:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 250000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 250000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.GOPAY,
    },
  },
  // Transaksi 8: agus.d - Pameran Kerajinan Tangan Nusantara
  {
    userUsername: "agus.d",
    eventName: "Pameran Kerajinan Tangan Nusantara",
    promotionCode: null,
    amount: 75000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-12-01T14:00:00Z",
    items: [
      {
        ticketTypeName: "Normal",
        quantity: 1,
        unitPrice: 75000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 75000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.OVO,
    },
  },
  // Transaksi 9: riki.s - Seminar FinTech Masa Depan
  {
    userUsername: "riki.s",
    eventName: "Seminar FinTech Masa Depan",
    promotionCode: "FINTECH50OFF",
    amount: 62500,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-10-20T10:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 125000,
        discountApplied: 62500,
      },
    ],
    payment: {
      amount: 62500,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.BCA_TRANSFER,
    },
  },
  // Transaksi 10: lina.s - Lomba Lari 10K Sehat
  {
    userUsername: "lina.s",
    eventName: "Lomba Lari 10K Sehat",
    promotionCode: null,
    amount: 50000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-01-25T08:00:00Z",
    items: [
      {
        ticketTypeName: "Normal",
        quantity: 1,
        unitPrice: 50000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 50000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.SHOPEEPAY,
    },
  },
  // Transaksi 11: joko.s - Workshop Fotografi Dasar
  {
    userUsername: "joko.s",
    eventName: "Workshop Fotografi Dasar",
    promotionCode: null,
    amount: 150000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-11-18T16:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 150000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 150000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.DANA,
    },
  },
  // Transaksi 12: siti.a - Festival Indie Music Bandung
  {
    userUsername: "siti.a",
    eventName: "Festival Indie Music Bandung",
    promotionCode: null,
    amount: 200000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-11-12T19:00:00Z",
    items: [
      {
        ticketTypeName: "Presale",
        quantity: 1,
        unitPrice: 200000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 200000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.BCA_TRANSFER,
    },
  },
  // Transaksi 13: rizal.p - Konferensi Cybersecurity 2026
  {
    userUsername: "rizal.p",
    eventName: "Konferensi Cybersecurity 2026",
    promotionCode: null,
    amount: 350000,
    status: TransactionStatusEnum.PENDING,
    redemptionPoints: 0,
    createdAt: "2025-11-25T10:00:00Z",
    items: [
      {
        ticketTypeName: "Early Bird",
        quantity: 1,
        unitPrice: 350000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 350000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.GOPAY,
    },
  },
  // Transaksi 14: andri.w - Seminar Investasi Saham
  {
    userUsername: "andri.w",
    eventName: "Seminar Investasi Saham",
    promotionCode: null,
    amount: 100000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-11-08T11:00:00Z",
    items: [
      {
        ticketTypeName: "Normal",
        quantity: 1,
        unitPrice: 100000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 100000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.OVO,
    },
  },
  // Transaksi 15: santi.s - Kejuaraan Basket 3x3 Nasional
  {
    userUsername: "santi.s",
    eventName: "Kejuaraan Basket 3x3 Nasional",
    promotionCode: null,
    amount: 1000000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-01-15T12:00:00Z",
    items: [
      {
        ticketTypeName: "Peserta",
        quantity: 1,
        unitPrice: 1000000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 1000000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.DANA,
    },
  },
  // Transaksi 16: doni.s - Festival Budaya Lombok
  {
    userUsername: "doni.s",
    eventName: "Festival Budaya Lombok",
    promotionCode: null,
    amount: 75000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-12-20T10:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 75000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 75000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.GOPAY,
    },
  },
  // Transaksi 17: siti.a - Workshop Coding for Kids
  {
    userUsername: "siti.a",
    eventName: "Workshop Coding for Kids",
    promotionCode: null,
    amount: 125000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-01-10T14:00:00Z",
    items: [
      {
        ticketTypeName: "Normal",
        quantity: 1,
        unitPrice: 125000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 125000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.BCA_TRANSFER,
    },
  },
  // Transaksi 18: dian.c - Konser Amal 'Suara Hati'
  {
    userUsername: "dian.c",
    eventName: "Konser Amal 'Suara Hati'",
    promotionCode: null,
    amount: 150000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-12-18T10:00:00Z",
    items: [
      {
        ticketTypeName: "Reguler",
        quantity: 1,
        unitPrice: 150000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 150000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.DANA,
    },
  },
  // Transaksi 19: tari.s - Seminar Kesehatan Mental
  {
    userUsername: "tari.s",
    eventName: "Seminar Kesehatan Mental",
    promotionCode: null,
    amount: 75000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-02-20T12:00:00Z",
    items: [
      {
        ticketTypeName: "Normal",
        quantity: 1,
        unitPrice: 75000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 75000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.OVO,
    },
  },
  // Transaksi 20: wahyu.s - E-sport Championship: Mobile Legends
  {
    userUsername: "wahyu.s",
    eventName: "E-sport Championship: Mobile Legends",
    promotionCode: null,
    amount: 200000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-01-05T15:00:00Z",
    items: [
      {
        ticketTypeName: "Peserta",
        quantity: 1,
        unitPrice: 200000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 200000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.SHOPEEPAY,
    },
  },
  // Transaksi 21: budi.s - Festival Layang-layang
  {
    userUsername: "budi.s",
    eventName: "Festival Layang-layang",
    promotionCode: null,
    amount: 0,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-11-25T09:00:00Z",
    items: [
      {
        ticketTypeName: "Gratis",
        quantity: 1,
        unitPrice: 0,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 0,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.FREE,
    },
  },
  // Transaksi 22: dina.s - Workshop Public Speaking
  {
    userUsername: "dina.s",
    eventName: "Workshop Public Speaking",
    promotionCode: null,
    amount: 300000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-12-16T11:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 300000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 300000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.DANA,
    },
  },
  // Transaksi 23: tina.k - Konser Klasik Malam Tahun Baru
  {
    userUsername: "tina.k",
    eventName: "Konser Klasik Malam Tahun Baru",
    promotionCode: null,
    amount: 500000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-12-28T10:00:00Z",
    items: [
      {
        ticketTypeName: "VIP",
        quantity: 1,
        unitPrice: 500000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 500000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.BCA_TRANSFER,
    },
  },
  // Transaksi 24: erwin.h - Seminar Pemasaran Digital
  {
    userUsername: "erwin.h",
    eventName: "Seminar Pemasaran Digital",
    promotionCode: null,
    amount: 100000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-03-10T14:00:00Z",
    items: [
      {
        ticketTypeName: "Normal",
        quantity: 1,
        unitPrice: 100000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 100000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.GOPAY,
    },
  },
  // Transaksi 25: deni.a - Kompetisi Renang Junior
  {
    userUsername: "deni.a",
    eventName: "Kompetisi Renang Junior",
    promotionCode: null,
    amount: 120000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-01-25T09:00:00Z",
    items: [
      {
        ticketTypeName: "Peserta",
        quantity: 1,
        unitPrice: 120000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 120000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.OVO,
    },
  },
  // Transaksi 26: sulis.r - Festival Film Pendek
  {
    userUsername: "sulis.r",
    eventName: "Festival Film Pendek",
    promotionCode: null,
    amount: 50000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-12-05T18:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 50000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 50000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.SHOPEEPAY,
    },
  },
  // Transaksi 27: bagus.s - Workshop Bahasa Jepang Dasar
  {
    userUsername: "bagus.s",
    eventName: "Workshop Bahasa Jepang Dasar",
    promotionCode: null,
    amount: 85000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-02-01T15:00:00Z",
    items: [
      {
        ticketTypeName: "Basic",
        quantity: 1,
        unitPrice: 85000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 85000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.DANA,
    },
  },
  // Transaksi 28: miko.p - Java Jazz Festival 2026
  {
    userUsername: "miko.p",
    eventName: "Java Jazz Festival 2026",
    promotionCode: null,
    amount: 750000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-02-25T10:00:00Z",
    items: [
      {
        ticketTypeName: "Reguler",
        quantity: 1,
        unitPrice: 750000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 750000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.BCA_TRANSFER,
    },
  },
  // Transaksi 29: riki.s - Seminar Blockchain dan Kripto
  {
    userUsername: "riki.s",
    eventName: "Seminar Blockchain dan Kripto",
    promotionCode: null,
    amount: 150000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-01-15T11:00:00Z",
    items: [
      {
        ticketTypeName: "Basic",
        quantity: 1,
        unitPrice: 150000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 150000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.GOPAY,
    },
  },
  // Transaksi 30: aditya.p - Lomba Panjat Tebing
  {
    userUsername: "aditya.p",
    eventName: "Lomba Panjat Tebing",
    promotionCode: null,
    amount: 50000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-12-18T09:00:00Z",
    items: [
      {
        ticketTypeName: "Peserta",
        quantity: 1,
        unitPrice: 50000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 50000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.OVO,
    },
  },
  // Transaksi 31: syifa.n - Festival Wayang Kulit
  {
    userUsername: "syifa.n",
    eventName: "Festival Wayang Kulit",
    promotionCode: null,
    amount: 75000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-11-20T20:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 75000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 75000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.SHOPEEPAY,
    },
  },
  // Transaksi 32: agus.d - Workshop Desain Web Lanjutan
  {
    userUsername: "agus.d",
    eventName: "Workshop Desain Web Lanjutan",
    promotionCode: null,
    amount: 250000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2026-02-12T10:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 250000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 250000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.DANA,
    },
  },
  // Transaksi 33: riki.s - Jakarta Music Fest 2025 (kedua)
  {
    userUsername: "riki.s",
    eventName: "Jakarta Music Fest 2025",
    promotionCode: null,
    amount: 350000,
    status: TransactionStatusEnum.PENDING,
    redemptionPoints: 0,
    createdAt: "2025-09-01T15:00:00Z",
    items: [
      {
        ticketTypeName: "Presale 1",
        quantity: 1,
        unitPrice: 350000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 350000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.GOPAY,
    },
  },
  // Transaksi 34: lina.s - Konferensi Teknologi Masa Depan
  {
    userUsername: "lina.s",
    eventName: "Konferensi Teknologi Masa Depan",
    promotionCode: null,
    amount: 150000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-09-29T10:00:00Z",
    items: [
      {
        ticketTypeName: "Standard",
        quantity: 1,
        unitPrice: 150000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 150000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.BCA_TRANSFER,
    },
  },
  // Transaksi 35: joko.s - Retret Yoga dan Meditasi di Bali
  {
    userUsername: "joko.s",
    eventName: "Retret Yoga dan Meditasi di Bali",
    promotionCode: null,
    amount: 3000000,
    status: TransactionStatusEnum.PAID,
    redemptionPoints: 0,
    createdAt: "2025-10-28T09:00:00Z",
    items: [
      {
        ticketTypeName: "VIP",
        quantity: 2,
        unitPrice: 1500000,
        discountApplied: 0,
      },
    ],
    payment: {
      amount: 3000000,
      status: PaymentStatusEnum.SUCCESS,
      method: PaymentMethodEnum.BCA_TRANSFER,
    },
  },
];
