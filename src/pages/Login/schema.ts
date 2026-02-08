import * as yup from "yup";

export const schema = yup.object().shape({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  senha: yup.string().required("Senha é obrigatória").min(8, "A senha deve ter no mínimo 8 caracteres")
});

export type FormValues = yup.InferType<typeof schema>;
