import * as Yup from "yup";

export const registerValidationSchema = Yup.object({
  username: Yup.string().required("Wajib diisi"),
  email: Yup.string().email("Email tidak valid").required("Wajib diisi"),
  password: Yup.string().required("Wajib diisi"),
});
