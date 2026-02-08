import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components";
import { Loading } from "../../components/Loading/Loading";
import { useUserContext } from "../../context";

import "./styles.scss";

const formatAppointment = (str?: string | null | undefined) => {
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
    date: `${day} de ${months[parseInt(month, 10) - 1]} de 2025`,
    time
  };
};

export const QrCode = () => {
  const navigate = useNavigate();
  const { user, appLoading } = useUserContext();

  const { date, time } = useMemo(() => formatAppointment(user?.appointment), [user?.appointment]);

  if (appLoading) return <Loading />;

  if (!user?.appointment) {
    return (
      <div className="qr-code-page qr-code-page--no-appointment">
        <h2>
          Olá, <b>{user?.name}</b>,<br />
          seja bem vinda.
        </h2>

        <h3 className="qr-code-page__subtitle">
          <b>Como podemos te ajudar?</b>
        </h3>

        <Button
          text="Fazer agendamento"
          className="white"
          onClick={() =>
            navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, {
              replace: true
            })
          }
        />
      </div>
    );
  }

  return (
    <div className="qr-code-page">
      <h2 className="qr-title">Obrigada pelo seu agendamento!</h2>

      <span className="qr-subtitle">Esperamos você para vivermos momentos inesquecíveis.</span>

      <div className="qr-info">
        <div className="qr-info-row">
          <span>
            DIA: <b>{date}</b>
          </span>
        </div>
        <div className="qr-info-row">
          <span>
            HORÁRIO: <b>{time}</b>
          </span>
        </div>
        <div className="qr-info-row">
          <span>
            ENDEREÇO:{" "}
            <b>
              CASA GLOSS ABSOLU <br />
              RUA CONDE BERNADOTTE, 26 - LEBLON
            </b>
          </span>
        </div>
      </div>

      <p className="qr-warning">
        Abaixo está o seu QRCode + código de acesso, em breve você receberá um e-mail com mais informações
      </p>

      <div className="qr-image-wrapper">
        <img className="qr-image" src={`https://quickchart.io/qr?text=${user?.token || "000000"}`} alt="QR Code" />
      </div>

      <div className="qr-code-label">CÓDIGO: {user?.token || "000000"}</div>

      <div className="qr-actions">
        <button
          className="qr-cancel"
          onClick={() =>
            navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=cancel`, {
              replace: true
            })
          }
        >
          CANCELAR
        </button>

        <button
          className="qr-reschedule"
          onClick={() =>
            navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, {
              replace: true
            })
          }
        >
          REAGENDAR
        </button>
      </div>
    </div>
  );
};
