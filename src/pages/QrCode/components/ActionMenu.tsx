import { Button } from "../../../components";

interface ActionMenuProps {
  userName?: string;
  onConsult: () => void;
  onCancel: () => void;
  onReschedule: () => void;
}

export const ActionMenu = ({ userName, onConsult, onCancel, onReschedule }: ActionMenuProps) => {
  return (
    <>
      <p className="qr-action-greeting">
        OLÁ, {userName?.toUpperCase()}
        <br />
        SEJA BEM VINDO (A)
      </p>

      <h2 className="qr-action-title">
        SELECIONE ABAIXO O
        <br />
        QUE DESEJA FAZER:
      </h2>

      <div className="qr-action-buttons">
        <Button text="CONSULTAR AGENDAMENTO" className="primary qr-action-button" onClick={onConsult} />
        <Button text="CANCELAR AGENDAMENTO" className="primary qr-action-button" onClick={onCancel} />
        <Button text="PRECISO REAGENDAR" className="primary qr-action-button" onClick={onReschedule} />
      </div>
    </>
  );
};
