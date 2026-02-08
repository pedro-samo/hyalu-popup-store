import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

import { Button } from "../../../../components";
import type { FormValues } from "../../schema";

import "./styles.scss";

interface ScanQrCodeInterface {
  onSubmit: (data: FormValues) => Promise<void | boolean>;
  setStep: (step: "home" | "type" | "scan" | "userData") => void;
}

export const ScanQrCode = ({ onSubmit, setStep }: ScanQrCodeInterface) => {
  const [dataResultQr, setDataResultQr] = useState("");

  useEffect(() => {
    if (!dataResultQr) return;
    const handleSubmit = async () => {
      const result = await onSubmit({
        code: dataResultQr
      });
      if (!result) {
        setDataResultQr("");
        return;
      }
      setStep("userData");
    };
    handleSubmit();
  }, [dataResultQr, onSubmit, setStep]);

  return (
    <>
      <div className="scanQr">
        <h1>APONTE A CÂMERA PARA O QR CODE PARA VALIDAR A ENTRADA</h1>

        <div className="scanQr_cam">
          <Scanner
            onScan={(result) => {
              if (Array.isArray(result) && result.length > 0 && result[0].rawValue) {
                setDataResultQr(result[0].rawValue);
              }
            }}
          />
        </div>

        <p>{dataResultQr}</p>
      </div>

      <Button text="Retornar" onClick={() => setStep("home")} className="primary" />
    </>
  );
};
