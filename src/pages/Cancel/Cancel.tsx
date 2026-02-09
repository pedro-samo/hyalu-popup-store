import { useEffect, useMemo, useState } from "react";
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
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO"
  ];

  const monthLabel = months[parseInt(month, 10) - 1] ?? "";
  const year = new Date().getFullYear();

  return {
    date: `${day} DE ${monthLabel} DE ${year}`,
    time
  };
};

export const Cancel = () => {
  const navigate = useNavigate();
  const { user, userPasswordLogin } = useUserContext();

  const [isLoading, setIsLoading] = useState(false);
  const [canceled, setCanceled] = useState(false);

  const { date, time } = useMemo(() => formatAppointment(user?.appointment), [user?.appointment]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [canceled]);

  const goToSchedule = () => {
    navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, { replace: true });
  };

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
        "https://cloud.crm.dermaclub.com.br/popup-store-agendamento-usuario?brand=hyalu",
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
      {!canceled ? (
        <>
          <h2 className="cancel-page__title">DESEJA CANCELAR SUA VISITA?</h2>

          <div className="cancel-page__box">
            <div className="cancel-page__content">
              <div className="cancel-page__disclaimer">
                <p className="cancel-page__line">
                  DIA: <b>{date}</b>
                </p>
                <p className="cancel-page__line">
                  HORÁRIO: <b>{time}</b>
                </p>
                <p className="cancel-page__line cancel-page__line--address">
                  ENDEREÇO: <b>1º PISO BARRA SHOPPING</b>
                </p>
                <p className="cancel-page__address-detail">- RIO DE JANEIRO</p>
              </div>

              <p className="cancel-page__warning">LEMBRAMOS QUE SEU QR CODE FICARÁ INDISPONÍVEL</p>
            </div>

            <div className="cancel-page__actions">
              <Button
                text={isLoading ? "Cancelando..." : "SIM, DESEJO CANCELAR"}
                className="primary cancel-page__confirm cancel-page__confirm--outline"
                onClick={cancelScheduledDate}
                disabled={isLoading}
              />

              <Button
                text="AGENDAR NOVA DATA"
                className="primary cancel-page__reschedule cancel-page__reschedule--fill"
                onClick={goToSchedule}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="cancel-page__title">SUA VISITA FOI CANCELADA</h2>

          <div className="cancel-page__box cancel-page__box--canceled">
            <div className="cancel-page__content cancel-page__content--canceled">
              <p className="cancel-page__sentimosMuito">SENTIMOS MUITO QUE NÃO CONSIGA COMPARECER.</p>
              <p className="cancel-page__qrindisponivel">Lembramos que seu QR Code atual ficará indisponível.</p>
            </div>

            <p className="cancel-page__tip">
              Dica: Se ainda queira participar desta experiência, você ainda pode agendar uma visita em outro dia e
              horário.
            </p>

            <div className="cancel-page__actions cancel-page__actions--single">
              <Button
                text="AGENDAR NOVA DATA"
                className="primary cancel-page__reschedule cancel-page__reschedule--fill"
                onClick={goToSchedule}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
