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
      <div className="home_user_header">
        <h2>Apresenta</h2>
        <h1>Clínica de longevidade capilar</h1>
        <h3>Prolongue a longevidade do seu cabelo</h3>
      </div>
      <span className="home_user_divider" />
      <div className="home_user_text">
        <p className="home_user_text_lead">
          Vichy Dercos convida você para <br /> viver a ciência da longevidade <br /> capilar no Barra Shopping
        </p>
        <p className="home_user_text_body">
          Venha participar de uma experiência <br /> imersiva dedicada à saúde do seu <br />
          couro cabeludo. Conheça as inovações <br />
          de <br />
          Dercos e realize um procedimento <br />
          capilar com protocolos desenvolvidos <br />
          para diferentes necessidades de queda <br />e quebra capilar.
        </p>
        <p className="home_user_text_cta">
          Você sente que seu cabelo está <br />
          caindo
          <br />
          ou anda mais frágil e danificado?
        </p>
      </div>

      <div className="home_user_buttons">
        <Button text="Quero me cadastrar e agendar minha visita" onClick={handleRegisterClick} className="primary" />
        <Button text="Quero consultar o meu agendamento" onClick={handleConsultClick} className="white" />
      </div>

      <div className="home_user_products">
        <img src="https://image.crm.dermaclub.com.br/lib/fe8b12727d62007b71/m/1/7057b51a-2b20-4300-b865-f2b4251583a4.png" />
      </div>

      {isLogged && (
        <button
          className="home_user_logout"
          onClick={() => {
            Cookies.remove("User_AuthCookie");
            messageModal("Você foi deslogado com suceeso!", "success", "Sucesso!");
          }}
        >
          Deslogar
        </button>
      )}
    </div>
  );
};
