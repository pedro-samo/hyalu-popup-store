import * as yup from "yup";

export const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  sobrenome: yup.string().required("Sobrenome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  celular: yup.string().required("Celular é obrigatório")
});

export type FormValues = yup.InferType<typeof schema>;
