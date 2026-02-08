import { useState } from "react";

import { Button, Loading } from "../../../components";
import { hours } from "../daysAndHours";
import type { SelectedDate } from "../Schedule";

import "./styles.scss";

interface SelectDayProps {
  postSelectedDate: () => void;
  setSelectedDate: (date: SelectedDate) => void;
  selectedDate: SelectedDate;
  isLoading: boolean;
  currentAppointments:
  | {
    [key: string]: {
      hour: string;
      appointments: number;
    };
  }[]
  | null;
}

export const SelectHour = ({
  postSelectedDate,
  selectedDate,
  setSelectedDate,
  isLoading,
  currentAppointments
}: SelectDayProps) => {
  const [error, setError] = useState("");
  if (!currentAppointments) return <Loading />;

  function handleSubmit() {
    if (!selectedDate.hour) {
      setError("Por favor, selecione um horário antes de continuar.");
      return;
    }
    setError("");
    postSelectedDate();
  }

  return (
    <>
      <div className="hour-selection">
        {hours.map((hour) => {
          const isDisabled = currentAppointments.some(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            (appointment) => appointment.hour === hour.value && appointment.appointments >= 1
          );

          return (
            <button
              key={hour.value}
              className={`hour-button ${selectedDate.hour === hour.value ? "selected" : ""}`}
              onClick={() => {
                setSelectedDate({ ...selectedDate, hour: hour.value });
                setError("");
              }}
              type="button"
              disabled={isDisabled}
            >
              {isDisabled ? "Esgotado" : hour.label}
            </button>
          );
        })}
      </div>
      <Button
        text={isLoading ? "Agendando..." : "Selecionar Horário"}
        onClick={handleSubmit}
        className="primary"
        disabled={isLoading}
      />
      {error && <p className="error_message">{error}</p>}
    </>
  );
};
