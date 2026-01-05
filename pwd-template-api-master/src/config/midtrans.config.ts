import MidtransClient from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

// Konfigurasi snap API
export const snap = new MidtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string,
});

// Konfigurasi core API (untuk webhook)
export const coreAPI = new MidtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string,
});
