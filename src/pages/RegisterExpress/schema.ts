import * as yup from "yup";

export const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  sobrenome: yup.string().required("Sobrenome é obrigatório"),
  cpf: yup
    .string()
    .required("CPF é obrigatório")
    .test("cpf", "CPF inválido", (value) => (value ? value.replace(/\D/g, "").length === 11 : false)),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  celular: yup.string().required("Celular é obrigatório")
});

export type FormValues = yup.InferType<typeof schema>;
