import { useState } from "react";

import { Button } from "../../../components";
import { days } from "../daysAndHours";
import type { SelectedDate } from "../Schedule";

import "./styles.scss";

interface SelectDayProps {
  setStep: (step: number) => void;
  setSelectedDate: (date: SelectedDate) => void;
  selectedDate: SelectedDate;
  isLoading?: boolean;
}

export const SelectDay = ({ setStep, selectedDate, setSelectedDate, isLoading }: SelectDayProps) => {
  const [error, setError] = useState("");
  const yearShort = String(new Date().getFullYear()).slice(-2);

  function nextStep() {
    if (!selectedDate.day) {
      setError("Por favor, selecione uma data antes de continuar.");
      return;
    }
    setError("");
    setStep(2);
  }

  return (
    <>
      <div className="day-selection">
        {days.map((day) => {
          return (
            <button
              key={day.value}
              className={`day-button ${selectedDate.day === day.value ? "selected" : ""}`}
              onClick={() => {
                setSelectedDate({ ...selectedDate, day: day.value, hour: "" });
                setError("");
              }}
              type="button"
              disabled={day.reserved || day.isCompleted}
            >
              <span className="day-weekday">{day.day.toUpperCase()}</span>
              <span className="day-date">
                {day.reserved ? "ESGOTADO" : day.isCompleted ? "CONCLUÍDO" : `${day.label}/${yearShort}`}
              </span>
            </button>
          );
        })}
      </div>
      <Button
        text={isLoading ? "Aguarde..." : "Selecionar data"}
        onClick={nextStep}
        className="primary"
        disabled={isLoading}
      />
      {error && <p className="error_message">{error}</p>}
    </>
  );
};
