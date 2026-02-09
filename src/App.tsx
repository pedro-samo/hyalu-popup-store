import { BrowserRouter } from "react-router-dom";

import { UserContextProvider } from "./context";
import { Router } from "./Routes";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </UserContextProvider>
  );
}
export default App;
