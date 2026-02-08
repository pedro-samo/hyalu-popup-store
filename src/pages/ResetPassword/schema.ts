import * as yup from "yup";

export const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required("A senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número"),
  confirmPassword: yup
    .string()
    .required("A confirmação de senha é obrigatória")
    .oneOf([yup.ref("newPassword")], "As senhas não coincidem")
});

export type FormValues = yup.InferType<typeof schema>;
