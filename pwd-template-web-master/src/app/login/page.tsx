"use client";
import { useRouter } from "next/navigation";
import { useFormik, FormikHelpers } from "formik";
import { loginValidationSchema } from "./_schemas/loginValidationSchema";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/useAuthStore";
import ToastProvider from "@/components/ToastProvider";

type TLoginFormValues = {
  identifier: string;
  password: string;
};

export default function Login() {
  type TLoginResponse = {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      username: string;
      email: string;
      roles: string[];
    };
  };

  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  //handler login
  const handleLogin = async (values: {
    identifier: string;
    password: string;
  }) => {
    try {
      const res = await api.post<TLoginResponse>("/login", values);
      if (!res.data.token) {
        toast.error("Login gagal, token tidak ditemukan");
        return;
      }

      setAccessToken(res.data.token);
      setUser(res.data.user);

      toast.success("Login berhasil");
      setTimeout(() => {
        router.push("/");
      }, 500);
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
        toast.error("Login gagal");
      }
    }
  };

  //Formik setup
  const formik = useFormik<TLoginFormValues>({
    initialValues: { identifier: "", password: "" },
    validationSchema: loginValidationSchema,
    onSubmit: (
      values: TLoginFormValues,
      actions: FormikHelpers<TLoginFormValues>
    ) => {
      handleLogin(values);
      actions.setSubmitting(false);
    },
  });

  return (
    <div className="bg-gray-100 h-screen grid grid-cols-1 ">
      <section className=" text-black w-full  bg-[url('/img/login/pattern-blue.png')] bg-cover bg-center h-[33vh]">
        <ToastProvider />
        <form
          onSubmit={formik.handleSubmit}
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
              Email ata Username
            </label>
            <input
              type="text"
              name="identifier"
              value={formik.values.identifier}
              onChange={formik.handleChange}
              placeholder=""
              className="w-full p-3 border border-gray-300 rounded-sm h-12 my-2.5"
            />
          </div>
          {formik?.errors.identifier && formik.touched.identifier && (
            <div id="feedback">{formik.errors.identifier}</div>
          )}
          <div>
            <label htmlFor="" className="text-gray-500 font-light">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder=""
              className="w-full p-3 border border-gray-300 rounded-sm h-12 mt-2.5 mb-3"
            />
          </div>
          {formik?.errors.password && formik.touched.password && (
            <div id="feedback">{formik.errors.password}</div>
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
