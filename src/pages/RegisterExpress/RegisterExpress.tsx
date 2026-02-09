import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Cookies from "js-cookie";

import { Button } from "../../components";
import { useUserContext } from "../../context";
import { celularMask, cpfMask } from "../../utils/masks";
import { messageModal } from "../../utils/messageModal";

import { type FormValues, schema } from "./schema";

import "./styles.scss";

export const RegisterExpress = ({ isPromoter }: { isPromoter?: boolean }) => {
  const isLogged = !!Cookies.get("User_AuthCookie");
  const navigate = useNavigate();
  const { userPasswordLogin } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  });

  const [isLoading, setIsLoading] = useState(false);

  const cpfRegister = register("cpf");
  const celularRegister = register("celular");

  useEffect(() => {
    if (isLogged && !isPromoter) {
      navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=qrCode`, { replace: true });
    }
  }, [isLogged, isPromoter, navigate]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    try {
      const tokenInscription = await axios.get("https://cloud.crm.dermaclub.com.br/popup-store-gerador-token?brand=hyalu");
      const token = tokenInscription?.data?.token;

      const fields = {
        ...data,
        SubscriberKey: data.email,
        EmailAddress: data.email,
        cpf: data.cpf.replace(/\D/g, ""),
        celular: data.celular.replace(/\D/g, ""),
        token: `VIC${token}`,
        linkQrCode: `https://quickchart.io/qr?text=VIC${token}`,
        cienciaComparecimento: true,
        cienciaTermos: true,
        autorizacaoImagem: true,
      };

      if (!token) {
        setIsLoading(false);
        return messageModal("Erro para gerar o token, envie os dados novamente.", "error", "Erro!");
      }

      const body = JSON.stringify({
        fields
      });

      const config = {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      };

      const response = await axios.post(
        "https://cloud.crm.dermaclub.com.br/popup-store-registro-usuario?brand=hyalu",
        body,
        config
      );

      const finallyData = await response?.data;

      if (finallyData?.statusCode === 200) {
        if (!isPromoter) {
          messageModal("Cadastro realizado com sucesso!", "success", "Sucesso!");
          userPasswordLogin(finallyData.token);
          return navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, { replace: true });
        } else {
          messageModal("Check-in realizado com sucesso!", "success", "Sucesso!");
          navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=promoter`, { replace: true });
        }
      } else {
        messageModal(finallyData.message, "error", "Erro!");
      }
    } catch (error) {
      messageModal(error as string, "error", "Erro!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register">
      <span className="register_divider" />
      <h1 className="register_title">FAÇA O SEU CADASTRO</h1>
      <form className="register_form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input_container">
          <input {...register("nome")} placeholder="NOME" />
          {errors.nome && <p className="error_message">{errors.nome.message}</p>}
        </div>
        <div className="input_container">
          <input {...register("sobrenome")} placeholder="SOBRENOME" />
          {errors.sobrenome && <p className="error_message">{errors.sobrenome.message}</p>}
        </div>

        <div className="input_container">
          <input {...register("email")} placeholder="E-MAIL" />
          {errors.email && <p className="error_message">{errors.email.message}</p>}
        </div>
        <div className="input_container">
          <input
            {...cpfRegister}
            placeholder="CPF | EXEMPLO 000.000.000-00"
            onChange={(event) => {
              event.target.value = cpfMask(event.target.value);
              cpfRegister.onChange(event);
            }}
          />
          {errors.cpf && <p className="error_message">{errors.cpf.message}</p>}
        </div>
        <div className="input_container">
          <input
            {...celularRegister}
            placeholder="CELULAR | EXEMPLO (00) 99999-9999"
            onChange={(event) => {
              event.target.value = celularMask(event.target.value);
              celularRegister.onChange(event);
            }}
          />
          {errors.celular && <p className="error_message">{errors.celular.message}</p>}
        </div>
        <Button
          className="primary"
          type="submit"
          text={isLoading ? "Cadastrando..." : "Cadastrar"}
          disabled={isLoading}
        />
      </form>
    </div>
  );
};
