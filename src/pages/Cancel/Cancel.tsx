import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "../../components";
import { useUserContext } from "../../context";
import { messageModal } from "../../utils/messageModal";

import "./styles.scss";

const formatAppointment = (str: string | null | undefined) => {
  if (!str) return { date: "", time: "" };

  const [dayMonth, time] = str.split("-");
  const [day, month] = dayMonth.split("/");
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"
  ];
  return {
    date: `${day} de ${months[parseInt(month, 10) - 1]} de 2026`,
    time
  };
};

export const Cancel = () => {
  const navigate = useNavigate();
  const { user, userPasswordLogin } = useUserContext();

  const [isLoading, setIsLoading] = useState(false);
  const [canceled, setCanceled] = useState(false);

  const { date, time } = formatAppointment(user?.appointment);

  const cancelScheduledDate = async () => {
    setIsLoading(true);

    try {
      const fields = {
        email: user?.email,
        nome: user?.name,
        sobrenome: user?.lastName,
        token: user?.token || "",
        appointment: ""
      };

      const body = JSON.stringify({
        fields,
        action: "remove"
      });

      const config = {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      };

      const response = await axios.post(
        "https://cloud.crm.dermaclub.com.br/popup-store-agendamento-usuario?brand=vichy",
        body,
        config
      );

      const finallyData = await response?.data;

      if (finallyData?.statusCode === 200) {
        setCanceled(true);
        userPasswordLogin(finallyData.token);
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
    <div className="cancel-page">
      <button
        type="button"
        className="cancel-page__close"
        onClick={() =>
          navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=qrCode`, {
            replace: true
          })
        }
        aria-label="Fechar"
      >
        ×
      </button>

      {!canceled ? (
        <>
          <h2>
            Deseja cancelar <br /> sua visita?
          </h2>

          <p className="cancel-page__day">
            Dia: <b>{date}</b>
          </p>
          <p className="cancel-page__time">
            Horário: <b>{time}</b>
          </p>

          <p className="cancel-page__warning">Lembramos que seu QR Code ficará indisponível</p>

          <Button
            text={isLoading ? "Cancelando..." : "Sim, desejo cancelar"}
            className="primary"
            onClick={cancelScheduledDate}
            disabled={isLoading}
          />

          <Button
            text="Agendar nova data"
            className="primary"
            onClick={() =>
              navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, {
                replace: true
              })
            }
          />
        </>
      ) : (
        <>
          <h2>Sua visita foi cancelada</h2>

          <p className="cancel-page__sentimosMuito">Sentimos muito que não consiga comparecer.</p>
          <p className="cancel-page__qrindisponivel">Lembramos que seu QR Code atual ficará indisponível</p>

          <Button
            text="Agendar nova data"
            className="primary"
            onClick={() =>
              navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, {
                replace: true
              })
            }
          />

          <Button
            text="Ir para o início"
            className="primary"
            onClick={() =>
              navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=home`, {
                replace: true
              })
            }
          />

          <p className="cancel-page__tip">
            <b>Dica:</b> se ainda quiser participar desta experiência, você ainda pode agendar uma visita em outro dia e
            horário que fique melhor para você
          </p>
        </>
      )}
    </div>
  );
};
