import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
  username: Yup.string()
    .required("Wajib diisi")
    .min(5, "Username minimal 5 karakter")
    .max(50, "Maksimal Username 50 karakter"),
  email: Yup.string()
    .email("Email tidak valid")
    .required("Wajib diisi")
    .max(50, "Maksimal Email atau Password 50 karakter"),
  password: Yup.string().required("Wajib diisi").min(5, "Minimal 5 karakter"),
});
