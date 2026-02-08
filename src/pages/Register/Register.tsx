import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Cookies from "js-cookie";

import { Button } from "../../components";
import { useUserContext } from "../../context";
import { celularMask, dateMask } from "../../utils/masks";
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
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const dataNascimentoRegister = register("dataNascimento");
  const celularRegister = register("celular");

  useEffect(() => {
    if (isLogged && !isPromoter) {
      navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=qrCode`, { replace: true });
    }
  }, [isLogged, isPromoter, navigate]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    try {
      const tokenInscription = await axios.get(`https://cloud.crm.dermaclub.com.br/popup-store-gerador-token?brand=vichy`);
      const token = tokenInscription?.data?.token;

      const fields = {
        ...data,
        SubscriberKey: data.email,
        EmailAddress: data.email,
        dataNascimento: transformDate(data.dataNascimento),
        celular: data.celular.replace(/\D/g, ""),
        token: `VIC${token}`,
        linkQrCode: `https://quickchart.io/qr?text=VIC${token}`
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
        "https://cloud.crm.dermaclub.com.br/popup-store-registro-usuario?brand=vichy",
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
            token: `VIC${token}`,
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
      <div className="register_header">
        <h2>Apresenta Pop Up</h2>
        <h1>Gloss Absolu</h1>
      </div>
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
            <input {...register("cienciaComparecimento")} type="checkbox" id="cienciaComparecimento" />
            <label htmlFor="cienciaComparecimento">
              Declaro que estou ciente de que, para participar da ação e realizar o procedimento na Clínica de
              Longevidade Capilar Dercos, devo comparecer no horário agendado com o cabelo limpo (lavado) e seco.
            </label>
          </div>
          {errors.cienciaComparecimento && <p className="error_message">{errors.cienciaComparecimento.message}</p>}

          <div className="checkbox_container">
            <input {...register("cienciaTermos")} type="checkbox" id="cienciaTermos" />
            <label htmlFor="cienciaTermos">
              Desejo participar da ativação da Clínica de Longevidade Capilar, de acordo os Termos e condições do
              Regulamento presentes no link.
            </label>
          </div>
          {errors.cienciaTermos && <p className="error_message">{errors.cienciaTermos.message}</p>}

          <div className="checkbox_container">
            <input {...register("autorizacaoImagem")} type="checkbox" id="autorizacaoImagem" />
            <label htmlFor="autorizacaoImagem">
              Autorizo o uso da minha imagem, voz e declarações registradas durante o evento pela L'Oréal Brasil, para
              fins de divulgação institucional e promocional, em quaisquer mídias e canais da empresa, sem limitação de
              prazo e território.
            </label>
          </div>
          {errors.autorizacaoImagem && <p className="error_message">{errors.autorizacaoImagem.message}</p>}

          <div className="checkbox_container">
            <input {...register("aceiteComunicacao")} type="checkbox" id="aceiteComunicacao" />
            <label htmlFor="aceiteComunicacao">
              Aceito também receber comunicações sobre produtos e serviços da L'Oréal Brasil e suas marcas. Você pode
              cancelar a assinatura a qualquer momento por meio do link disponibilizado em nossas comunicações.
            </label>
          </div>

          <div className="checkbox_container">
            <input {...register("aceiteProdutos")} type="checkbox" id="aceiteProdutos" />
            <label htmlFor="aceiteProdutos">
              Além de participar da Clínica de Longevidade Capilar, aceito receber produtos e amostras de outras
              campanhas futuras e lançamentos de outras marcas da L'Oréal Brasil.
            </label>
          </div>

          <p className="register_terms_note">
            A Clínica de Longevidade Capilar Dercos faz parte da Vichy, marca do Grupo L'Oréal no Brasil, e utilizará
            seus dados pessoais de acordo com a Política de Privacidade. Este serviço é voltado para maiores de 18
            (dezoito) anos.
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
