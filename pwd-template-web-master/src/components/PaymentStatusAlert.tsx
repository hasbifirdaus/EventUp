"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const PaymentStatusAlert = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const status = searchParams.get("status");
    if (!status) return;

    if (status === "success") {
      toast.success("Pembayaran berhasil!");
    } else if (status === "pending") {
      toast.info("Pembayaran masih pending.");
    } else if (status === "error") {
      toast.error("Pembayaran gagal. Silakan coba lagi.");
    }
  }, [searchParams]);

  return null;
};

export default PaymentStatusAlert;
