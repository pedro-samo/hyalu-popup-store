import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Cookies from "js-cookie";

import { Button } from "../../components";
import { useUserContext } from "../../context";
import { celularMask, cpfMask, dateMask } from "../../utils/masks";
import { messageModal } from "../../utils/messageModal";
import { transformDate } from "../../utils/transformDate";

import { type FormValues, schema } from "./schema";

import "./styles.scss";

export const Register = ({ isPromoter }: { isPromoter?: boolean }) => {
  const isLogged = !!Cookies.get("User_AuthCookie");
  const navigate = useNavigate();
  const { userPasswordLogin, setUser } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: yupResolver(schema)
  });

  const [isLoading, setIsLoading] = useState(false);

  const dataNascimentoRegister = register("dataNascimento");
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
      const tokenInscription = await axios.get(
        `https://cloud.crm.dermaclub.com.br/popup-store-gerador-token?brand=hyalu`
      );
      const token = tokenInscription?.data?.token;

      const fields = {
        ...data,
        SubscriberKey: data.email,
        EmailAddress: data.email,
        cpf: data.cpf.replace(/\D/g, ""),
        dataNascimento: transformDate(data.dataNascimento),
        celular: data.celular.replace(/\D/g, ""),
        token: `LRP${token}`,
        linkQrCode: `https://quickchart.io/qr?text=LRP${token}`
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
        messageModal("Cadastro realizado com sucesso!", "success", "Sucesso!");
        if (!isPromoter) {
          userPasswordLogin(finallyData.token);
          return navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, { replace: true });
        } else {
          navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=promoter-schedule`, { replace: true });
          setUser({
            name: data.nome,
            lastName: data.sobrenome,
            email: data.email,
            phone: data.celular.replace(/\D/g, ""),
            token: `LRP${token}`,
            appointment: null
          });
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
          <input
            {...dataNascimentoRegister}
            placeholder="DATA DE NASCIMENTO"
            type="text"
            onChange={(event) => {
              event.target.value = dateMask(event.target.value);
              dataNascimentoRegister.onChange(event);
            }}
          />
          {errors.dataNascimento && <p className="error_message">{errors.dataNascimento.message}</p>}
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
          <input {...register("email")} placeholder="E-MAIL" />
          {errors.email && <p className="error_message">{errors.email.message}</p>}
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
        <div className="input_container">
          <input {...register("senha")} placeholder="SENHA" type="password" />
          {errors.senha && <p className="error_message">{errors.senha.message}</p>}
        </div>

        <div className="register_terms">
          <div className="checkbox_container">
            <input {...register("cienciaTermos")} type="checkbox" id="cienciaTermos" />
            <label htmlFor="cienciaTermos">
              Aceito o Termos e Condições do Regulamento da campanha presentes no link:{" "}
              <a
                href="http://image.crm.loreal.com.br/lib/fe8812727d6200787d/m/1/4eabd865-a145-43fa-b005-8aef7c5d62e3.pdf"
                target="_blank"
                rel="noreferrer"
              >
                http://image.crm.loreal.com.br/lib/fe8812727d6200787d/m/1/4eabd865-a145-43fa-b005-8aef7c5d62e3.pdf
              </a>
            </label>
          </div>
          {errors.cienciaTermos && <p className="error_message">{errors.cienciaTermos.message}</p>}

          <div className="checkbox_container">
            <input {...register("aceiteComunicacao")} type="checkbox" id="aceiteComunicacao" />
            <label htmlFor="aceiteComunicacao">
              Aceito receber comunicações sobre produtos e serviços da L’Oréal Brasil e suas marcas. Você pode cancelar
              a assinatura a qualquer momento por meio do link disponibilizado em nossas comunicações.
            </label>
          </div>

          <div className="checkbox_container">
            <input {...register("aceiteProdutos")} type="checkbox" id="aceiteProdutos" />
            <label htmlFor="aceiteProdutos">
              Além de participar da campanha de La Roche Posay, aceito receber produtos e amostras de outras campanhas
              futuras e lançamentos da L'Oréal Brasil.
            </label>
          </div>

          <p className="register_terms_note">
            La Roche Posay faz parte da L’Oréal Brasil e utilizará seus dados pessoais de acordo com a Política de
            Privacidade. Este serviço é voltado para maiores de 18 (dezoito) anos.
          </p>
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
