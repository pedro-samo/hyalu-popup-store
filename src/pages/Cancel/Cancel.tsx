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
      <div className="cancel-page__hero">
        <h1>Clínica de longevidade capilar</h1>
        <h3>Prolongue a longevidade do seu cabelo</h3>
      </div>
      <span className="cancel-page__divider" />

      {!canceled ? (
        <>
          <div className="cancel-page__box">
            <h2>
              DESEJA CANCELAR
              <br />
              SUA VISITA?
            </h2>

            <div className="cancel-page__disclaimer">
              <p className="cancel-page__line">
                DIA: <b>{date}</b>
              </p>
              <p className="cancel-page__line">
                HORÁRIO: <b>{time}</b>
              </p>
              <p className="cancel-page__line cancel-page__line--address">
                ENDEREÇO: <b>BARRA SHOPPING</b>
              </p>
              <p className="cancel-page__address-detail">PISO AMÉRICAS - EM FRENTE À LOJA DA MAC</p>
            </div>

            <p className="cancel-page__warning">
              LEMBRAMOS QUE SEU QR CODE
              <br />
              FICARÁ INDISPONÍVEL
            </p>
          </div>

          <Button
            text={isLoading ? "Cancelando..." : "Sim, desejo cancelar"}
            className="primary cancel-page__confirm"
            onClick={cancelScheduledDate}
            disabled={isLoading}
          />

          <Button
            text="Agendar nova data"
            className="primary cancel-page__reschedule"
            onClick={() =>
              navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, {
                replace: true
              })
            }
          />
        </>
      ) : (
        <>
          <div className="cancel-page__box cancel-page__box--canceled">
            <h2>SUA VISITA FOI CANCELADA</h2>

            <p className="cancel-page__sentimosMuito">SENTIMOS MUITO QUE NÃO CONSIGA COMPARECER.</p>
            <p className="cancel-page__qrindisponivel">LEMBRAMOS QUE SEU QR CODE ATUAL FICARÁ INDISPONÍVEL.</p>
          </div>

          <Button
            text="Sim, desejo cancelar"
            className="primary cancel-page__confirm"
            onClick={() =>
              navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=home`, {
                replace: true
              })
            }
          />

          <Button
            text="Agendar nova data"
            className="primary cancel-page__reschedule"
            onClick={() =>
              navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, {
                replace: true
              })
            }
          />

          <p className="cancel-page__tip">DICA: SE AINDA QUEIRA PARTICIPAR DESTA EXPERIÊNCIA, VOCÊ AINDA PODE AGENDAR UMA VISITA EM OUTRO DIA E HORÁRIO.</p>
        </>
      )}
    </div>
  );
};
