import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  identifier: Yup.string()
    .required("Email atau username wajib diisi")
    .min(5, "Email atau username minimal 5 karakter")
    .max(50, "Email atau username maksimal 50 karakter"),
  password: Yup.string()
    .required("Password wajib diisi")
    .min(5, "Password minimal 5 karakter")
    .max(50, "Pasword maksimal 50 karakter"),
});
