import { createContext, type ReactNode, useContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JWTDecoded {
  user: UserInterface;
  iat: number;
  exp: number;
}

interface UserInterface {
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  token: string;
  appointment: string | null;
}

interface UserContext {
  user: UserInterface | null;
  userPasswordLogin: (token: string) => void;
  checkLogin: () => void;
  appLoading: boolean;
  setUser: (user: UserInterface | null) => void;
}

const UserContext = createContext<UserContext>({} as UserContext);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [appLoading, setAppLoading] = useState(false);

  const userPasswordLogin = (token: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData: any = jwtDecode(token);
    setUser(userData.user as UserInterface);
    Cookies.set("User_AuthCookie", token);
  };

  const checkLogin = async () => {
    setAppLoading(true);

    try {
      const token = Cookies.get("User_AuthCookie");

      const body = JSON.stringify({
        token
      });

      const config = {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      };

      const response = await axios.post(
        "https://cloud.crm.dermaclub.com.br/popup-store-verificar-token",
        body,
        config
      );
      const { data } = response;

      if (data.statusCode === 200) {
        const jwtDecoded: JWTDecoded = jwtDecode(token as string);
        setUser(jwtDecoded.user);
      } else {
        Cookies.remove("User_AuthCookie");
      }

      setAppLoading(false);
    } catch (error) {
      console.log("error: ", error);
      setAppLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, userPasswordLogin, checkLogin, appLoading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
  return useContext(UserContext);
};
