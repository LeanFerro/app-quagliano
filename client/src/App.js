import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import BarraNav from "./components/BarraNav";
import TablaMarcas from "./components/TablaMarcas";
import Log from "./components/Login/Log";
import Forgot from "./components/Recupero/Forgot";
import Reset from "./components/Recupero/Reset";

function App() {
  return (
    <div className="container-fluid cont-total fondito">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BarraNav />}>
            <Route index element={<Log />} />
            <Route path="marcas" element={<TablaMarcas />} />
            <Route path="olvido" element={<Forgot />} />
            <Route path="log" element={<Log />} />
            <Route path="reset" element={<Reset />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
