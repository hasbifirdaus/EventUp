"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  return (
    <div className="bg-gray-100 h-screen grid grid-cols-1 ">
      <section className=" text-black w-full  bg-[url('/img/login/pattern-blue.png')] bg-cover bg-center h-[33vh]">
        <form
          action=""
          className="bg-neutral-50 rounded-lg flex flex-col gap-1.5 shadow-lg p-8 w-md max-w-2xl mt-36 mx-auto"
        >
          <div className="flex flex-col items-center ">
            <h2 className="font-bold mb-1.5">Buat akun EventUp Kamu</h2>
            <p className="text-gray-500 text-sm tracking-wide ">
              Udah punya akun?
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-700 text-sm font-bold cursor-pointer ml-1"
              >
                Masuk
              </button>
            </p>
          </div>

          <div>
            <label htmlFor="" className="text-gray-500 font-light ">
              Username
            </label>
            <input
              type="Username"
              name="Username"
              className="w-full p-3 border border-gray-300 rounded-sm h-12 my-2.5"
            />
          </div>

          <div>
            <label htmlFor="" className="text-gray-500 font-light ">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-sm h-12 my-2.5"
            />
          </div>
          <div>
            <label htmlFor="" className="text-gray-500 font-light">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-3 border border-gray-300 rounded-sm h-12 mt-2.5 mb-3"
            />
          </div>

          <div>
            <label htmlFor="" className="text-gray-500 font-light ">
              Kode Referral
            </label>
            <input
              type="Kode Referral"
              name="Kode Referral"
              className="w-full p-3 border border-gray-300 rounded-sm h-12 my-2.5"
            />
          </div>
          <button className=" w-full bg-blue-800 rounded-sm h-12 text-sm text-neutral-100 tracking-wider font-bold cursor-pointer">
            Daftar
          </button>
        </form>
      </section>
    </div>
  );
}
