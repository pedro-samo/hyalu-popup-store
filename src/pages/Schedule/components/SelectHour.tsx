import { useState } from "react";

import { Button, Loading } from "../../../components";
import { hours } from "../daysAndHours";
import type { SelectedDate } from "../Schedule";

import "./styles.scss";

const SUNDAY_LIMITED_DAYS = new Set(["22/02", "01/03"]);

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

  const visibleHours = SUNDAY_LIMITED_DAYS.has(selectedDate.day)
    ? hours.filter((hour) => hour.value >= "13:00" && hour.value <= "20:00")
    : hours;

  function handleSubmit() {
    const isVisibleSelectedHour = visibleHours.some((hour) => hour.value === selectedDate.hour);

    if (!selectedDate.hour || !isVisibleSelectedHour) {
      setError("Por favor, selecione um horário antes de continuar.");
      return;
    }
    setError("");
    postSelectedDate();
  }

  return (
    <>
      <div className="hour-selection">
        {visibleHours?.map((hour) => {
          const isDisabled = currentAppointments.some(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            (appointment) => appointment.hour === hour.value && appointment.appointments >= 20
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
      <p className="hour-note">Para garantir o atendimento, compareça ao local pontualmente no horário marcado.</p>
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
