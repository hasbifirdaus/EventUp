import {
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "../../src/generated/prisma";

export const paymentsData = [
  // Transaksi 1
  {
    userUsername: "rikis.s",
    eventName: "Jakarta Music Fest 2025",
    amount: 250000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.BCA_TRANSFER,
  },
  // Transaksi 2
  {
    userUsername: "aditya.p",
    eventName: "Jakarta Music Fest 2025",
    amount: 850000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.DANA,
  },
  // Transaksi 3
  {
    userUsername: "doni.s",
    eventName: "Konferensi Teknologi Masa Depan",
    amount: 150000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.GOPAY,
  },
  // Transaksi 4
  {
    userUsername: "rikis.s",
    eventName: "Retret Yoga dan Meditasi di Bali",
    amount: 3000000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.BCA_TRANSFER,
  },
  // Transaksi 5
  {
    userUsername: "yoga.s",
    eventName: "Workshop Desain UX/UI Intensif",
    amount: 500000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.BCA_TRANSFER,
  },
  // Transaksi 6
  {
    userUsername: "aditya.p",
    eventName: "Turnamen Futsal Piala Nusantara",
    amount: 1000000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.DANA,
  },
  // Transaksi 7
  {
    userUsername: "syifa.n",
    eventName: "Konferensi Data Science Indonesia",
    amount: 250000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.GOPAY,
  },
  // Transaksi 8
  {
    userUsername: "agus.d",
    eventName: "Pameran Kerajinan Tangan Nusantara",
    amount: 75000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.OVO,
  },
  // Transaksi 9
  {
    userUsername: "riki.s",
    eventName: "Seminar FinTech Masa Depan",
    amount: 125000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.BCA_TRANSFER,
  },
  // Transaksi 10
  {
    userUsername: "lina.s",
    eventName: "Lomba Lari 10K Sehat",
    amount: 50000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.SHOPEEPAY,
  },
  // Transaksi 11
  {
    userUsername: "joko.s",
    eventName: "Workshop Fotografi Dasar",
    amount: 150000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.DANA,
  },
  // Transaksi 12
  {
    userUsername: "siti.a",
    eventName: "Festival Indie Music Bandung",
    amount: 200000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.BCA_TRANSFER,
  },
  // Transaksi 13
  {
    userUsername: "rizal.p",
    eventName: "Konferensi Cybersecurity 2026",
    amount: 350000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.GOPAY,
  },
  // Transaksi 14
  {
    userUsername: "andri.w",
    eventName: "Seminar Investasi Saham",
    amount: 100000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.OVO,
  },
  // Transaksi 15
  {
    userUsername: "santi.s",
    eventName: "Kejuaraan Basket 3x3 Nasional",
    amount: 1000000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.DANA,
  },
  // Transaksi 16
  {
    userUsername: "doni.s",
    eventName: "Festival Budaya Lombok",
    amount: 375000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.GOPAY,
  },
  // Transaksi 17
  {
    userUsername: "siti.a",
    eventName: "Workshop Coding for Kids",
    amount: 125000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.BCA_TRANSFER,
  },
  // Transaksi 18
  {
    userUsername: "dian.c",
    eventName: "Konser Amal 'Suara Hati'",
    amount: 300000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.DANA,
  },
  // Transaksi 19
  {
    userUsername: "tari.s",
    eventName: "Seminar Kesehatan Mental",
    amount: 75000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.OVO,
  },
  // Transaksi 20
  {
    userUsername: "wahyu.s",
    eventName: "E-sport Championship: Mobile Legends",
    amount: 200000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.SHOPEEPAY,
  },
  // Transaksi 21
  {
    userUsername: "budi.s",
    eventName: "Festival Layang-layang",
    amount: 0,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.FREE,
  },
  // Transaksi 22
  {
    userUsername: "dina.s",
    eventName: "Workshop Public Speaking",
    amount: 600000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.DANA,
  },
  // Transaksi 23
  {
    userUsername: "tina.k",
    eventName: "Konser Klasik Malam Tahun Baru",
    amount: 500000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.BCA_TRANSFER,
  },
  // Transaksi 24
  {
    userUsername: "erwin.h",
    eventName: "Seminar Pemasaran Digital",
    amount: 300000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.GOPAY,
  },
  // Transaksi 25
  {
    userUsername: "deni.a",
    eventName: "Kompetisi Renang Junior",
    amount: 120000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.OVO,
  },
  // Transaksi 26
  {
    userUsername: "sulis.r",
    eventName: "Festival Film Pendek",
    amount: 50000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.SHOPEEPAY,
  },
  // Transaksi 27
  {
    userUsername: "bagus.s",
    eventName: "Workshop Bahasa Jepang Dasar",
    amount: 170000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.DANA,
  },
  // Transaksi 28
  {
    userUsername: "miko.p",
    eventName: "Java Jazz Festival 2026",
    amount: 750000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.BCA_TRANSFER,
  },
  // Transaksi 29
  {
    userUsername: "rikis.s",
    eventName: "Seminar Blockchain dan Kripto",
    amount: 150000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.GOPAY,
  },
  // Transaksi 30
  {
    userUsername: "aditya.p",
    eventName: "Lomba Panjat Tebing",
    amount: 150000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.OVO,
  },
  // Transaksi 31
  {
    userUsername: "syifa.n",
    eventName: "Festival Wayang Kulit",
    amount: 75000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.SHOPEEPAY,
  },
  // Transaksi 32
  {
    userUsername: "agus.d",
    eventName: "Workshop Desain Web Lanjutan",
    amount: 300000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.DANA,
  },
  // Transaksi 33
  {
    userUsername: "riki.s",
    eventName: "Jakarta Music Fest 2025",
    amount: 350000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.GOPAY,
  },
  // Transaksi 34
  {
    userUsername: "lina.s",
    eventName: "Konferensi Teknologi Masa Depan",
    amount: 150000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.BCA_TRANSFER,
  },
  // Transaksi 35
  {
    userUsername: "joko.s",
    eventName: "Retret Yoga dan Meditasi di Bali",
    amount: 3000000,
    status: PaymentStatusEnum.SUCCESS,
    method: PaymentMethodEnum.BCA_TRANSFER,
  },
];
