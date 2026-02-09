import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useUserContext } from "../../context";

import "./styles.scss";

export const Container = ({ children }: { children: ReactNode }) => {
  const { appLoading } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page");

  const goBack = () => {
    if (page && page === "qrCode") {
      navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}`);
    } else if (page && page.includes("promoter")) {
      navigate(`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}?page=promoter`, { replace: true });
    } else {
      navigate(-1);
    }
  };

  console.log("PAGE", page);

  return (
    <article className="main" style={{ paddingBottom: page ? '40px ' : undefined }}>
      <img className="main_bubble top" src="https://image.crm.dermaclub.com.br/lib/fe8b12727d62007b71/m/1/a3d12551-57c5-45f1-995c-f178854e7807.png" />
      <section className="main_container">
        <div className="main_container_header">
          {page && page !== "home" && page !== "promoter" && !appLoading && (
            <button className="botaoVoltar" onClick={goBack}>
              {"< Voltar"}
            </button>
          )}
          <div className="main_container_header_images">
            <img
              src={
                "https://image.crm.dermaclub.com.br/lib/fe8b12727d62007b71/m/1/a4059db2-043e-4de7-8870-1000f6ce6d99.png"
              }
              alt="Laroche Logo"
              className="main_container_header_logo lrp"
            />
            {!page && <p>Apresenta</p>}
            <img
              src={
                "https://image.crm.dermaclub.com.br/lib/fe8b12727d62007b71/m/1/bb9ec478-5537-410f-a913-a9566f295f03.png"
              }
              alt="Hyalo Logo"
              className="main_container_header_logo hyalo"
            />
          </div>
        </div>
        {children}
      </section>
      <img className="main_bubble bottom" src="https://image.crm.dermaclub.com.br/lib/fe8b12727d62007b71/m/1/a3d12551-57c5-45f1-995c-f178854e7807.png" />
    </article>
  );
};
