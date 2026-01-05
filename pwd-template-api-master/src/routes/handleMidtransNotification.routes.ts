import { Router } from "express";
import { handleMidtransNotification } from "../controllers/midtrans.webhook.controller";

const handleMidtransNotificationRouter = Router();

// Endpoint untuk simulasi, hanya untuk DEVELOPMENT
handleMidtransNotificationRouter.post(
  "/simulasi/pembayaran/sukses",
  (req, res) => {
    // Ganti `123` dengan ID transaksi yang sudah Anda buat di Step 1
    const transactionIdToSimulate = 123;
    const simulatedBody = {
      order_id: `INV-EVENTUP-${transactionIdToSimulate}`,
      status_code: "200",
      transaction_status: "settlement", // atau "capture"
      gross_amount: "100000.00", // Ganti dengan total amount transaksi
      signature_key: "dummy-signature-key", // Tidak akan divalidasi
      fraud_status: "accept",
    };

    // Panggil handler asli dengan data simulasi
    req.body = simulatedBody;
    handleMidtransNotification(req, res);
  }
);

// Endpoint untuk webhook Midtrans asli
handleMidtransNotificationRouter.post(
  "/midtrans/notification",
  handleMidtransNotification
);

export default handleMidtransNotificationRouter;
