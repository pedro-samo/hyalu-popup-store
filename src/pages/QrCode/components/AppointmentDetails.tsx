interface AppointmentDetailsProps {
  date: string;
  time: string;
  token?: string;
  onCancel: () => void;
  onReschedule: () => void;
}

export const AppointmentDetails = ({ date, time, token, onCancel, onReschedule }: AppointmentDetailsProps) => {
  return (
    <>
      <h2 className="qr-title">Obrigada pelo seu agendamento!</h2>
      <p className="qr-subtitle">
        ESPERAMOS VOCÊ PARA
        <br />
        ESSA IMERSÃO INESQUECÍVEL.
      </p>

      <div className="qr-disclaimer">
        <p className="qr-disclaimer__line">
          DIA: <b>{date}</b>
        </p>
        <p className="qr-disclaimer__line">
          HORÁRIO: <b>{time}</b>
        </p>
        <p className="qr-disclaimer__note">Informamos que não haverá tolerância para atrasos.</p>
        <p className="qr-disclaimer__line qr-disclaimer__line--address">
          ENDEREÇO: <b>BARRA SHOPPING</b>
        </p>
        <p className="qr-disclaimer__address-detail">PISO AMÉRICAS - EM FRENTE À LOJA DA MAC</p>
      </div>

      <p className="qr-warning">
        ABAIXO O SEU QR CODE + CÓDIGO DE ACESSO.
        <br />
        EM BREVE VOCÊ RECEBERÁ UM E-MAIL COM MAIS INFORMAÇÕES.
      </p>

      <div className="qr-image-wrapper">
        <img className="qr-image" src={`https://quickchart.io/qr?text=${token || "000000"}`} alt="QR Code" />
      </div>

      <div className="qr-code-label">CÓDIGO: {token || "000000"}</div>
      <p className="qr-entry-note">
        O QR CODE deve ser apresentado para a liberação da entrada, de acordo com a data e horário do seu agendamento.
      </p>

      <div className="qr-actions">
        <button className="qr-cancel" onClick={onCancel}>
          CANCELAR
        </button>

        <button className="qr-reschedule" onClick={onReschedule}>
          REAGENDAR
        </button>
      </div>
    </>
  );
};
