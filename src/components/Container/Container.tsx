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

  return (
    <article className="main">
      <section className="main_container">
        <div className="main_container_header">
          {page && page !== "home" && page !== "promoter" && !appLoading && (
            <button className="botaoVoltar" onClick={goBack}>
              {"< Voltar"}
            </button>
          )}
          <img
            src={
              "https://image.crm.dermaclub.com.br/lib/fe8b12727d62007b71/m/1/15c542f8-29d7-47db-8ee4-9217dc9fdfe6.png"
            }
            alt="Kérastase Logo"
            className="main_container_header_logo"
          />
        </div>
        {children}
      </section>
    </article>
  );
};
