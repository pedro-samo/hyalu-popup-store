import * as yup from "yup";

export const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  sobrenome: yup.string().required("Sobrenome é obrigatório"),
  dataNascimento: yup.string().required("Data de nascimento é obrigatória"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  celular: yup.string().required("Celular é obrigatório"),
  senha: yup
    .string()
    .required("Senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])/,
      "A senha precisa ter uma letra maiúscula, uma minúscula, um número e um caracter especial"
    ),
  cienciaComparecimento: yup
    .boolean()
    .oneOf([true], "Você deve aceitar os termos de comparecimento")
    .required("Você deve aceitar os termos de comparecimento"),
  cienciaTermos: yup
    .boolean()
    .oneOf([true], "Você deve aceitar os termos e condições")
    .required("Você deve aceitar os termos e condições"),
  autorizacaoImagem: yup
    .boolean()
    .oneOf([true], "Você deve aceitar os termos de autorização de uso de imagem")
    .required("Você deve aceitar os termos e condições"),
  aceiteComunicacao: yup.boolean().default(false),
  aceiteProdutos: yup.boolean().default(false)
});

export type FormValues = yup.InferType<typeof schema>;
