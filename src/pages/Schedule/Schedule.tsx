import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { Loading } from "../../components";
import { useUserContext } from "../../context";
import { messageModal } from "../../utils/messageModal";

import { SelectHour } from "./components/SelectHour";
import { SelectDay } from "./components";

import "./styles.scss";

export interface SelectedDate {
  day: string;
  hour: string;
}

const formatAppointment = (str: string | null | undefined) => {
  if (!str) return { date: "", time: "" };

  const [dayMonth, time] = str.split("-");
  const [day, month] = dayMonth.split("/");
  const monthNames = [
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
  const date = `${day} de ${monthNames[parseInt(month, 10) - 1]} de 2025`;
  return { date, time };
};

export const Schedule = ({ isPromoter }: { isPromoter?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appLoading, user, userPasswordLogin } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [currentAppointments, setCurrentAppointments] = useState(null);
  const [selectedDate, setSelectedDate] = useState<SelectedDate>({
    day: "",
    hour: ""
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setStep(searchParams.get("step") === "2" ? 2 : 1);
  }, [location.search]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [step]);

  const setScheduleStep = (nextStep: number) => {
    const search = nextStep === 2 ? "?page=schedule&step=2" : "?page=schedule";
    navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}${search}`, { replace: nextStep === 1 });
  };

  const postSelectedDate = async () => {
    setIsLoading(true);

    try {
      const fields = {
        email: user?.email,
        nome: user?.name,
        sobrenome: user?.lastName,
        token: user?.token || "", //
        dataHorario: `${selectedDate.day}-${selectedDate.hour}`,
        dia: selectedDate.day.split("-")[0],
        hora: selectedDate.hour,
        checkin: isPromoter ? true : false,
        local: "Rio de Janeiro - Barra Shopping",
        linkQrCode: `https://quickchart.io/qr?text=LRP${user?.token}`
      };

      const body = JSON.stringify({
        fields,
        action: user?.appointment ? "update" : "insert"
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
        if (!isPromoter) {
          userPasswordLogin(finallyData.token);
          messageModal("Agendamento realizado com sucesso!", "success", "Sucesso!");
          return navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=qrCode`, {
            replace: true,
            state: { openDetails: true }
          });
        } else {
          messageModal("Checkin realizado com sucesso!", "success", "Sucesso!");
          return navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=promoter`, { replace: true });
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

  const getAppointments = async () => {
    setIsLoading(true);

    try {
      const fields = {
        day: selectedDate.day
      };

      const body = JSON.stringify({
        fields
      });

      const config = {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      };

      const response = await axios.post(
        "https://cloud.crm.dermaclub.com.br/popup-store-buscar-agendamentos?brand=hyalu",
        body,
        config
      );

      const finallyData = await response?.data;

      setCurrentAppointments(finallyData?.appointments || null);
    } catch (error) {
      messageModal(error as string, "error", "Erro!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate.day) {
      getAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate.day]);

  if (appLoading && !isPromoter) return <Loading />;

  const { date: formattedDate, time: formattedTime } = formatAppointment(user?.appointment);

  return (
    <div className="schedule-page">
      {user?.appointment && (
        <div className="schedule-page__user-info">
          <h3>
            Olá, <b>{user.name}!</b>
          </h3>
          <p>
            sua visita esta agendada para o dia <b>{formattedDate}</b> às <b>{formattedTime}</b>.
          </p>
        </div>
      )}
      <h2 className="schedule-page__selection-title">
        SELECIONE O MELHOR {step === 1 ? "DIA" : "HORÁRIO"} <br /> PARA A SUA VISITAÇÃO
      </h2>

      {step === 1 ? (
        <SelectDay
          setStep={setScheduleStep}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isLoading={isLoading}
        />
      ) : (
        <SelectHour
          postSelectedDate={postSelectedDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          isLoading={isLoading}
          currentAppointments={currentAppointments}
        />
      )}
    </div>
  );
};
