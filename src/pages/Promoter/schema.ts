import * as yup from "yup";

const codeRegex = /^[A-Za-z]{3}\d{7}$/;

export const schema = yup.object().shape({
  code: yup.string().required("O código é obrigatório").matches(codeRegex, "O código tem que ter 3 letras e 7 dígitos")
});

export type FormValues = yup.InferType<typeof schema>;
