interface AppointmentDetailsProps {
  date: string;
  time: string;
  token?: string;
  onCancel: () => void;
  onReschedule: () => void;
}

export const AppointmentDetails = ({ date, time, token, onCancel, onReschedule }: AppointmentDetailsProps) => {
  return (
    <section className="qr-details">
      <h2 className="qr-title">OBRIGADA PELO SEU AGENDAMENTO!</h2>
      <p className="qr-subtitle">Esperamos você para essa imersão inesquecível.</p>
      <span className="qr-title-divider" />

      <div className="qr-disclaimer">
        <p className="qr-disclaimer__line">
          DIA: <b>{date}</b>
        </p>
        <p className="qr-disclaimer__line">
          HORÁRIO: <b>{time}</b>
        </p>
        <p className="qr-disclaimer__line qr-disclaimer__line--address">
          ENDEREÇO: <b>1º PISO BARRA SHOPPING</b>
        </p>
        <p className="qr-disclaimer__city">- RIO DE JANEIRO</p>
      </div>

      <p className="qr-warning">
        Abaixo estão seu QRcode + código de acesso.
        <br />
        Em breve você receberá um e-mail com mais informações.
      </p>

      <div className="qr-image-wrapper">
        <img className="qr-image" src={`https://quickchart.io/qr?text=${token || "000000"}`} alt="QR Code" />
      </div>

      <div className="qr-code-label">CÓDIGO {token || "000000"}</div>
      <p className="qr-entry-note">
        O QR Code deve ser apresentado para liberação da entrada, de acordo com a data e horário do seu agendamento.
      </p>

      <div className="qr-actions">
        <button className="qr-cancel" onClick={onCancel}>
          CANCELAR
        </button>

        <button className="qr-reschedule" onClick={onReschedule}>
          REAGENDAR
        </button>
      </div>
    </section>
  );
};
