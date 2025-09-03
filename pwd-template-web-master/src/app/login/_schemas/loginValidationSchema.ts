import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Email tidak valid").required("Wajib diisi"),
  password: Yup.string().required("Wajib diisi"),
});
