import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import BarraNav from "./components/BarraNav";
import TablaClientes from "./components/TablaClientes";
import TablaMarcas from "./components/TablaMarcas";
import TablaOposiciones from "./components/TablaOposiciones";
import Home from "./components/Home";

function App() {
  return (
    <div className="container-fluid cont-total fondito">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BarraNav />}>
            <Route index element={<Home />} />
            <Route path="marcas" element={<TablaMarcas />} />
            <Route path="clientes" element={<TablaClientes />} />
            <Route path="oposiciones" element={<TablaOposiciones />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
