import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import { messageModal, toastMessage } from "../../utils";

import { type FormValues, schema } from "./schema";

import "./styles.scss";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      messageModal("Token de recuperação inválido ou ausente.", "error", "Erro!");
      navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}`, { replace: true });
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur"
  });

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      messageModal("Token inválido.", "error", "Erro!");
      return;
    }

    try {
      const body = JSON.stringify({
        token: token,
        newPassword: data.newPassword
      });

      const response = await axios.post("https://cloud.crm.dermaclub.com.br/popup-store-redefinir-senha?brand=vichy", body, {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      });

      const finallyData = await response?.data;

      if (finallyData?.statusCode === 200) {
        toastMessage("Senha redefinida com sucesso!", "success");
        setTimeout(() => {
          navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}`, { replace: true });
        }, 2000);
        return;
      } else {
        messageModal(finallyData.message || "Erro ao redefinir senha.", "error", "Erro!");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao redefinir senha.";
      messageModal(errorMessage, "error", "Erro!");
    }
  };

  if (!token) {
    return null;
  }

  return (
    <section className="enel_reset">
      <div className="enel_reset__form">
        <div className="enel_reset__header">
          <h1 className="enel_reset__title">Redefinir Senha</h1>
          <p className="enel_reset__subtitle">Crie uma nova senha para sua conta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form__row">
            <div className="form_group">
              <label htmlFor="newPassword" className="label">
                Nova Senha
              </label>
              <input
                type="password"
                id="newPassword"
                {...register("newPassword")}
                placeholder="Digite sua nova senha"
                className={`input ${errors.newPassword ? "error" : ""}`}
              />
              {errors.newPassword && <span className="error_message">{errors.newPassword.message}</span>}
            </div>
          </div>
          <div className="form__row">
            <div className="form_group">
              <label htmlFor="confirmPassword" className="label">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Confirme sua nova senha"
                className={`input ${errors.confirmPassword ? "error" : ""}`}
              />
              {errors.confirmPassword && <span className="error_message">{errors.confirmPassword.message}</span>}
            </div>
          </div>

          <button type="submit" className="submit_button" disabled={isSubmitting}>
            {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
          </button>

          <div className="login_link">
            <span>Lembrou sua senha? </span>
            <button
              type="button"
              onClick={() => navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}`)}
              className="login"
            >
              Faça seu Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
