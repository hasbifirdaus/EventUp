"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePointStore } from "@/stores/usePointStore";
import { useCouponStore } from "@/stores/useCouponStore";

interface IPromotion {
  code: string;
  discount: string;
  validUntil: string;
  status: "active" | "expired";
}

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const { totalPoints, details, fetchPoints } = usePointStore();
  const { coupons, fetchCoupons } = useCouponStore();

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return (
    <div className="p-10">
      <section
        id="profile"
        className=" bg-white-[20rem] max-w-[40rem] mx-auto p-5 flex flex-col rounded-md shadow-xl text-gray-600"
      >
        <h2 className="text-2xl font-bold py-4">Akun Saya</h2>

        <div
          id="user-info"
          className="border-b-[0.5px] border-gray-400 pb-4 flex justify-between"
        >
          <div className="flex items-center gap-3 ">
            <img
              id="img-user"
              className="w-14 rounded-full mr-4 bg-blue-600"
              src="/img/logo/logo_EventUp.png"
              alt="img-user"
            />
            <div className="flex flex-col gap-2">
              <h2 id="username" className="font-bold capitalize">
                {user?.username}
              </h2>
            </div>
          </div>
        </div>

        <div className="py-4 grid gap-3 border-b-[0.5px] border-gray-400">
          <p className="font-bold">Kode Referral</p>
          <p>{user?.referralCode}</p>
        </div>

        <div className="py-4 grid gap-3 border-b-[0.5px] border-gray-400">
          <p className="font-bold">Email </p>
          <p>{user?.email}</p>
        </div>
      </section>

      <section
        id="vouchers-coupons"
        className="gird bg-white-[20rem] max-w-[40rem] mx-auto p-10 rounded-md shadow-xl text-gray-600"
      >
        <h2 className="text-2xl font-bold py-4 mb-4">Rewards</h2>

        <div className="py-4 grid gap-3 border-b-[0.5px] border-gray-400">
          <p className="font-bold">Poin</p>
          <p>{totalPoints?.toLocaleString() ?? 0}</p>

          {details.length > 0 && (
            <ul className="ml-4 text-sm text-gray-500 list-disc">
              {details.map((point, i) => (
                <li key={i}>
                  {point.amount.toLocaleString()} poin berlaku sampai{" "}
                  {new Date(point.expirationDate).toLocaleDateString("id-ID")}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="py-4 grid gap-3 border-b-[0.5px] border-gray-400">
          <p className="font-bold">
            Kupon (
            {coupons?.filter((c) => new Date(c.validUntil) > new Date())
              .length ?? 0}
            )
          </p>

          {coupons?.filter((c) => new Date(c.validUntil) > new Date()).length >
          0 ? (
            <ul className="ml-4 text-sm text-gray-500 list-disc">
              {coupons
                .filter((coupon) => new Date(coupon.validUntil) > new Date())
                .map((coupon, i) => (
                  <li key={i}>
                    Kode: {coupon.code} - Diskon: {coupon.discount} - Berlaku
                    sampai{" "}
                    {new Date(coupon.validUntil).toLocaleDateString("id-ID")}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="ml-4 text-sm text-gray-500">Tidak ada kupon aktif</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
