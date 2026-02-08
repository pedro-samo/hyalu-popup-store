import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import { Button } from "../../components";
import { messageModal } from "../../utils/messageModal";

import { ScanQrCode, TypeCode, UserData } from "./components";
import type { FormValues } from "./schema";

import "./styles.scss";

export interface UserDataInterface {
  appointment: string;
  email: string;
  name: string;
  lastName: string;
}

export const Promoter = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"home" | "type" | "scan" | "userData">("home");
  const [userData, setUserData] = useState<UserDataInterface>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Cookies.remove("User_AuthCookie");
  }, []);

  const onSubmit = async (data: FormValues): Promise<boolean | void> => {
    setIsLoading(true);
    try {
      const fields = {
        token: data.code
      };
      const body = JSON.stringify({ fields });
      const config = {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      };
      const response = await axios.post(
        "https://cloud.crm.dermaclub.com.br/popup-store-promotor-token-validation?brand=vichy",
        body,
        config
      );
      const finallyData = response?.data;
      if (finallyData?.statusCode === 200) {
        setUserData(finallyData.data);
        setStep("userData");
      } else {
        messageModal(finallyData.message, "error", "Erro!");
        return false;
      }
    } catch (error) {
      messageModal(error as string, "error", "Erro!");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "type") return <TypeCode onSubmit={onSubmit} isLoading={isLoading} setStep={setStep} />;

  if (step === "scan") return <ScanQrCode onSubmit={onSubmit} setStep={setStep} />;

  if (step === "userData" && userData)
    return (
      <UserData
        appointment={userData.appointment}
        email={userData.email}
        name={userData.name}
        lastName={userData.lastName}
        setStep={setStep}
      />
    );

  return (
    <div className="promoter_user">
      <div className="promoter_user_header">
        <h2>Entre no mundo de</h2>
        <h1>Gloss Absolu</h1>
      </div>

      <div className="promoter_user_buttons">
        <Button text="Ler QR Code" onClick={() => setStep("scan")} className="primary" />
        <Button text="Validar com código" onClick={() => setStep("type")} className="white" />
        <Button
          text="Agendamento Express"
          onClick={() =>
            navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=promoter-register`, { replace: true })
          }
          className="white"
        />
      </div>
    </div>
  );
};
