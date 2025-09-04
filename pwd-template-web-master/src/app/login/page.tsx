"use client";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { loginValidationSchema } from "./_schemas/loginValidationSchema";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Login() {
  type TLoginResponse = {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  };

  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        const res = await api.post<TLoginResponse>("/login", values);
        setAccessToken(res.data.token);
        setUser(res.data.user);
        toast.success("Login berhasil!");
        router.push("/");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Login gagal");
      }
    },
  });

  return (
    <div className="bg-gray-100 h-screen grid grid-cols-1 ">
      <section className=" text-black w-full  bg-[url('/img/login/pattern-blue.png')] bg-cover bg-center h-[33vh]">
        <form
          onSubmit={formik?.handleSubmit}
          className="bg-neutral-50 rounded-lg flex flex-col gap-1.5 shadow-lg p-8 w-md max-w-2xl mt-36 mx-auto"
        >
          <div className="flex flex-col items-center ">
            <h2 className="font-bold mb-1.5">Masuk Ke akunmu</h2>
            <p className="text-gray-500 text-sm tracking-wide ">
              Belum punya akun?
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-blue-700 text-sm font-bold cursor-pointer ml-1"
              >
                Daftar
              </button>
            </p>
          </div>

          <div>
            <label htmlFor="" className="text-gray-500 font-light ">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik?.values?.email}
              onChange={formik?.handleChange}
              placeholder=""
              className="w-full p-3 border border-gray-300 rounded-sm h-12 my-2.5"
            />
          </div>
          {formik?.errors.email && formik?.touched.email && (
            <div id="feedback">{formik?.errors.email}</div>
          )}
          <div>
            <label htmlFor="" className="text-gray-500 font-light">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formik?.values.password}
              onChange={formik?.handleChange}
              placeholder=""
              className="w-full p-3 border border-gray-300 rounded-sm h-12 mt-2.5 mb-3"
            />
          </div>
          {formik?.errors.password && formik?.touched?.password && (
            <div id="feedback">{formik?.errors.password}</div>
          )}
          <button
            type="submit"
            className=" w-full bg-blue-800 rounded-sm h-12 text-sm text-neutral-100 tracking-wider font-bold cursor-pointer"
          >
            Masuk
          </button>
        </form>
      </section>
    </div>
  );
}
