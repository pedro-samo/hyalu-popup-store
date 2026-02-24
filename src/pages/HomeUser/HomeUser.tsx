import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { Button } from "../../components";
import { messageModal } from "../../utils/messageModal";

import "./styles.scss";

export const HomeUser = () => {
  const isLogged = !!Cookies.get("User_AuthCookie");
  const navigate = useNavigate();

  function handleRegisterClick() {
    navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=register`);
  }

  function handleConsultClick() {
    const isLogged = !!Cookies.get("User_AuthCookie");

    if (isLogged) {
      return navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=qrCode`);
    }
    return navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=login`);
  }

  return (
    <div className="home_user">

      <div className="home_user_text">
        <span className="home_user_divider" />
        <p className="home_user_text_lead">
          A LA ROCHE-POSAY CONVIDA VOCÊ PARA PARTICIPAR
          DA POP UP EXPERIENCE HYALU
          <span className="highlight"> B5.</span>
        </p>

        <p className="home_user_text_body">
          Conheça os novos lançamentos de <strong>Hyalu</strong> <span className="highlight">B5</span> e sinta de perto
          o poder do preenchimento que vai evoluir a sua rotina
          de cuidados com Ácido Hialurônico.
        </p>

        <div className="home_user_buttons">
          <Button text="Quero me cadastrar e agendar minha visita" onClick={handleRegisterClick} className="primary" />
          <Button text="Quero consultar o meu agendamento" onClick={handleConsultClick} className="white" />
        </div>
      </div>

      <div className="home_user_products">
        <img src="https://image.crm.dermaclub.com.br/lib/fe8b12727d62007b71/m/1/7057b51a-2b20-4300-b865-f2b4251583a4.png" />
      </div>

      {isLogged && (
        <button
          className="home_user_logout"
          onClick={() => {
            Cookies.remove("User_AuthCookie");
            messageModal("Você foi deslogado com sucesso!", "success", "Sucesso!");
          }}
        >
          Deslogar
        </button>
      )}
    </div>
  );
};
