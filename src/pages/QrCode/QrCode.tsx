import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "../../components";
import { Loading } from "../../components/Loading/Loading";
import { useUserContext } from "../../context";

import { ActionMenu, AppointmentDetails } from "./components";

import "./styles.scss";

interface QrCodeLocationState {
  openDetails?: boolean;
}

const formatAppointment = (str?: string | null | undefined) => {
  if (!str) return { date: "", time: "" };

  const [dayMonth, time] = str.split("-");
  const [day, month] = dayMonth.split("/");
  const monthNames = [
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

  const monthLabel = monthNames[parseInt(month, 10) - 1] ?? "";
  const year = new Date().getFullYear();

  return {
    date: `${day} DE ${monthLabel} DE ${year}`,
    time
  };
};

export const QrCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, appLoading } = useUserContext();
  const openDetailsOnLoad = (location.state as QrCodeLocationState | null)?.openDetails === true;
  const [view, setView] = useState<"menu" | "details">(openDetailsOnLoad ? "details" : "menu");
  const { date, time } = useMemo(() => formatAppointment(user?.appointment), [user?.appointment]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [view, user?.appointment]);

  if (appLoading) return <Loading />;

  return (
    <div
      className={`qr-code-page ${
        !user?.appointment ? "qr-code-page--no-appointment" : view === "menu" ? "qr-code-page--action-menu" : ""
      }`}
    >
      {!user?.appointment ? (
        <>
          <p className="qr-no-appointment-greeting">
            OLÁ, {user?.name?.toUpperCase()}
            <br />
            SEJA BEM VINDO (A)
          </p>

          <h2 className="qr-no-appointment-action">
            SELECIONE ABAIXO O
            <br />
            QUE DESEJA FAZER:
          </h2>

          <Button
            text="FAZER AGENDAMENTO"
            className="primary qr-no-appointment-button"
            onClick={() =>
              navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, {
                replace: true
              })
            }
          />
        </>
      ) : view === "menu" ? (
        <ActionMenu
          userName={user?.name}
          onConsult={() => setView("details")}
          onCancel={() =>
            navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=cancel`, {
              replace: true
            })
          }
          onReschedule={() =>
            navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, {
              replace: true
            })
          }
        />
      ) : (
        <AppointmentDetails
          date={date}
          time={time}
          token={user?.token}
          onCancel={() =>
            navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=cancel`, {
              replace: true
            })
          }
          onReschedule={() =>
            navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=schedule`, {
              replace: true
            })
          }
        />
      )}
    </div>
  );
};
