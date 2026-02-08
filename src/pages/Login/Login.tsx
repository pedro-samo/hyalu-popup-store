import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import { Button } from "../../components";
import { useUserContext } from "../../context";
import { messageModal } from "../../utils/messageModal";

import { type FormValues, schema } from "./schema";

import "./styles.scss";

export const Login = () => {
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      const fields = {
        email: data.email,
        senha: data.senha
      };

      const body = JSON.stringify({ fields });
      const config = {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      };

      const response = await axios.post("https://cloud.crm.dermaclub.com.br/popup-store-login?brand=vichy", body, config);
      const finallyData = response?.data;

      if (finallyData?.statusCode === 200) {
        userPasswordLogin(finallyData.token);
        navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=qrCode`, { replace: true });
      } else {
        messageModal(finallyData.message, "error", "Erro!");
      }
    } catch (error) {
      messageModal(error as string, "error", "Erro!");
    } finally {
      setIsLoading(false);
    }
  };

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleForgot = async () => {
    if (!forgotEmail) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      messageModal("E-mail inválido", "error", "Erro!");
      return;
    }

    setForgotLoading(true);
    try {
      await axios.post(
        "https://cloud.crm.dermaclub.com.br/popup-store-esqueceu-senha?brand=vichy",
        JSON.stringify({
          fields: {
            email: forgotEmail
          }
        }),
        { headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
      setForgotSent(true);
    } catch {
      messageModal("Não foi possível enviar o e‑mail. Tente novamente.", "error", "Erro!");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login_container">
      {!showForgot ? (
        <>
          <div className="login_header">
            <h2>SEJA BEM VINDO(A) À</h2>
            <h1>CASA GLOSS ABSOLU</h1>
          </div>

          <form className="login_form" onSubmit={handleSubmit(onSubmit)}>
            <div className="input_container">
              <input {...register("email")} placeholder="E-MAIL" />
              {errors.email && <p className="error_message">{errors.email.message}</p>}
            </div>

            <div className="input_container">
              <input {...register("senha")} placeholder="SENHA" type="password" />
              {errors.senha && <p className="error_message">{errors.senha.message}</p>}
            </div>

            <p className="password_hint">
              Sua senha contem: mínimo de 8 caracteres, letras maiúscula e minúscula, caracter especial e números.
            </p>

            <button
              type="button"
              className="forgot_password"
              onClick={() => {
                setForgotSent(false);
                setForgotEmail("");
                setShowForgot(true);
              }}
            >
              ESQUECI MINHA SENHA
            </button>

            <Button className="white" type="submit" text={isLoading ? "ENVIANDO..." : "ENVIAR"} disabled={isLoading} />
          </form>
        </>
      ) : (
        <div className="forgot_container">
          <button type="button" className="forgot_close" onClick={() => setShowForgot(false)}>
            ×
          </button>

          {!forgotSent ? (
            <>
              <div className="esqueceu-sua-senha">
                <h2 className="forgot_title">ESQUECEU SUA SENHA?</h2>
                <p className="forgot_text">
                  Insira o e-mail cadastrado e enviaremos <br /> uma nova senha.
                </p>
              </div>

              <input
                name="forgotEmail"
                id="forgot-email"
                type="email"
                placeholder="E-mail"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="forgot_input"
              />

              <Button
                text={forgotLoading ? "ENVIANDO..." : "ENVIAR"}
                className="primary"
                onClick={handleForgot}
                disabled={forgotLoading}
              />
            </>
          ) : (
            <>
              <h2 className="forgot_title">PRONTO!</h2>
              <p className="forgot_text">
                Enviamos uma nova senha para o e-mail <br /> informado. Verifique o seu e-mail!
              </p>

              <Button text="FAZER LOGIN" className="primary" onClick={() => setShowForgot(false)} />
            </>
          )}
        </div>
      )}
    </div>
  );
};
