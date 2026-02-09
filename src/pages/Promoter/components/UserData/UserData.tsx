import { useEffect, useState } from "react";
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
      const response = await axios.post("https://cloud.crm.dermaclub.com.br/popup-store-checkin?brand=hyalu", body, config);
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
    <div className="user_data">
      <div className="user_data_card">
        <div className="user_data_info">
          {validated ? (
            <div className="user_data_row user_data_code">
              CHECK-IN <br /> <span className="bold">REALIZADO!</span>
            </div>
          ) : (
            <>
              <div className="user_data_row user_data_code">
                VISITANTE: <span className="bold">{userInfos.name}</span>
              </div>
              <div className="user_data_row user_data_date">
                DIA: <span className="bold">{userInfos.appointment.split("-")[0]}</span>
              </div>
              <div className="user_data_row user_data_time">
                HORÁRIO: <span className="bold">{userInfos.appointment.split("-")[1]}</span>
              </div>
            </>
          )}
        </div>
        <Button
          text={isLoading ? "Validando..." : validated ? "Início" : "VALIDAR"}
          className="primary user_data_button"
          onClick={validated ? homeReturn : doCheckin}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
