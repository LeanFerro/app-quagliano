import {
  BrowserRouter,
  useNavigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useEffect, useState } from "react";
import BarraNav from "./components/navbar/BarraNav";
import TablaMarcas from "./components/tablas/TablaMarcas";
import Log from "./components/Login/Log";
import Forgot from "./components/Recupero/Forgot";
import Reset from "./components/Recupero/Reset";
import { isAuthenticated } from "./components/helpers/auth";
import "./App.css";
import DarkModeContext from "./components/helpers/DarkModeContext";

const MainRoutes = () => {
  const navigate = useNavigate();
  const isAuth = isAuthenticated();
  

  useEffect(() => {
    if (
      !isAuth &&
      !window.location.pathname.includes("olvido") &&
      !window.location.pathname.includes("reset")
    ) {
      navigate("/log");
    }
  }, [isAuth, navigate]);

  return (
    <Routes>
      <Route path="/" element={<BarraNav />}>
        <Route index element={<Log />} />
        <Route path="olvido" element={<Forgot />} />
        <Route path="log" element={<Log />} />
        <Route path="reset" element={<Reset />} />
        <Route path="marcas" element={<TablaMarcas />} />
        <Route path="*" element={<Outlet />} />
      </Route>
    </Routes>
  );
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <div className="container-fluid cont-total fondito">
      <BrowserRouter>
        <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
         <MainRoutes />
        </DarkModeContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
