import { BrowserRouter } from "react-router-dom";
import { Router } from "./Routes";
import { UserContextProvider } from "./context";

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
