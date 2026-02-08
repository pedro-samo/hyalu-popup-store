import { type ReactNode, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

import { Container } from "./components";
import { useUserContext } from "./context";
import { Cancel, HomeUser, Login, Promoter, QrCode, Register, RegisterExpress, ResetPassword, Schedule } from "./pages";

function PrivateRoute({ children }: { children: ReactNode }) {
  const isLogged = !!Cookies.get("User_AuthCookie");
  const { user, checkLogin } = useUserContext();

  useEffect(() => {
    if (isLogged && !user) checkLogin();
  }, [isLogged, user, checkLogin]);

  return isLogged ? children : <Navigate to={`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}`} />;
}

export function Router() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page");

  let pageComponent;

  switch (page) {
    case "home":
      pageComponent = <HomeUser />;
      break;
    case "register":
      pageComponent = <Register />;
      break;
    case "login":
      pageComponent = <Login />;
      break;
    case "schedule":
      pageComponent = (
        <PrivateRoute>
          <Schedule />
        </PrivateRoute>
      );
      break;
    case "qrCode":
      pageComponent = (
        <PrivateRoute>
          <QrCode />
        </PrivateRoute>
      );
      break;
    case "cancel":
      pageComponent = (
        <PrivateRoute>
          <Cancel />
        </PrivateRoute>
      );
      break;
    case "promoter":
      pageComponent = <Promoter />;
      break;
    case "promoter-register":
      pageComponent = <RegisterExpress isPromoter />;
      break;
    case "reset-password":
      pageComponent = <ResetPassword />;
      break;
    default:
      pageComponent = <HomeUser />;
  }

  return (
    <Container>
      <Routes>
        <Route path="*" element={pageComponent} />
        <Route path={`/${import.meta.env.VITE_URL_CLOUDPAGE_HASH}`} element={pageComponent} />
      </Routes>
    </Container>
  );
}
