import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Button } from "../../../../components";
import { messageModal } from "../../../../utils/messageModal";
import type { UserDataInterface } from "../../Promoter";

import "./styles.scss";

export const UserData = ({
  setStep,
  ...userInfos
}: UserDataInterface & { setStep: (step: "home" | "type" | "scan" | "userData") => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setIsvalidated] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [validated]);

  const homeReturn = () => {
    setIsvalidated(false);
    setStep("home");
  };

  const appointmentDetails = useMemo(() => {
    const [rawDate = "", rawTime = ""] = (userInfos?.appointment || "").split("-");
    const dateMatch = rawDate.match(/^(\d{1,2})\/(\d{1,2})$/);

    if (!dateMatch) {
      return {
        date: rawDate,
        time: rawTime
      };
    }

    const [, day, month] = dateMatch;
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

    const monthLabel = monthNames[Number(month) - 1] || month;

    return {
      date: `${day.padStart(2, "0")} DE ${monthLabel} DE ${new Date().getFullYear()}`,
      time: rawTime
    };
  }, [userInfos.appointment]);

  const doCheckin = async () => {
    setIsLoading(true);
    try {
      const fields = {
        email: userInfos.email
      };
      const body = JSON.stringify({ fields });
      const config = {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      };
      const response = await axios.post(
        "https://cloud.crm.dermaclub.com.br/popup-store-checkin?brand=hyalu",
        body,
        config
      );
      const finallyData = response?.data;
      if (finallyData?.statusCode === 200) {
        setIsvalidated(true);
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
    <div className={`user_data${validated ? " user_data--validated" : ""}`}>
      {!validated ? (
        <>
          <div className="user_data_visitor">
            VISITANTE: <span className="bold">{userInfos.name}</span>
          </div>

          <div className="user_data_card">
            <div className="user_data_info">
              <div className="user_data_row user_data_date">
                DIA: <span className="bold">{appointmentDetails.date}</span>
              </div>
              <div className="user_data_row user_data_time">
                HORÁRIO: <span className="bold">{appointmentDetails.time}</span>
              </div>
            </div>
            <Button
              text={isLoading ? "Validando..." : "VALIDAR"}
              className="primary user_data_button"
              onClick={doCheckin}
              disabled={isLoading}
            />
          </div>
        </>
      ) : (
        <>
          <div className="user_data_success">
            CHECK-IN <br /> <span className="bold">REALIZADO!</span>
          </div>

          <Button text="Início" className="primary user_data_button user_data_button--success" onClick={homeReturn} />
        </>
      )}
    </div>
  );
};
