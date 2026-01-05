"use client";

import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { registerValidationSchema } from "./_schemas/registerValidationSchema";
import api from "@/utils/api";

export default function Register() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: { username: "", email: "", password: "", referralCode: "" },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      try {
        await api.post("/register", values);
        toast.success("Pendaftaran berhasil? silahkan login");
        router.push("/login");
      } catch (err: unknown) {
        type AxiosLikeError = {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        const axiosErr = err as AxiosLikeError;

        if (axiosErr.response?.data?.message) {
          toast.error(axiosErr.response.data.message);
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          console.error(err);
          toast.error("Pendaftaran gagal");
        }
      }
    },
  });

  return (
    <div className="bg-gray-100 h-screen grid grid-cols-1 ">
      <section className=" text-black w-full  bg-[url('/img/login/pattern-blue.png')] bg-cover bg-center h-[33vh]">
        <form
          onSubmit={formik.handleSubmit}
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
              type="text"
              name="username"
              placeholder=""
              onChange={formik.handleChange}
              value={formik.values.username}
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
              placeholder=""
              onChange={formik.handleChange}
              value={formik.values.email}
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
              placeholder=""
              onChange={formik.handleChange}
              value={formik.values.password}
              className="w-full p-3 border border-gray-300 rounded-sm h-12 mt-2.5 mb-3"
            />
          </div>

          <div>
            <label htmlFor="" className="text-gray-500 font-light ">
              Kode Referral
            </label>
            <input
              type="text"
              name="referralCode"
              placeholder="Massukkan kode referral bila ada"
              onChange={formik.handleChange}
              value={formik.values.referralCode}
              className="w-full p-3 border border-gray-300 rounded-sm h-12 my-2.5"
            />
          </div>
          <button
            type="submit"
            className=" w-full bg-blue-800 rounded-sm h-12 text-sm text-neutral-100 tracking-wider font-bold cursor-pointer"
          >
            Daftar
          </button>
        </form>
      </section>
    </div>
  );
}
