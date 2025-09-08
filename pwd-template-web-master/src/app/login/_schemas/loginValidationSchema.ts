import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  identifier: Yup.string().required("Email atau username wajib diisi"),
  password: Yup.string().required("Password wajib diisi"),
});
