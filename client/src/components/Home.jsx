import React, { useState } from "react";
import logo2 from "./img/logo2.png";
import "./css/home.css";
import { useNavigate } from "react-router-dom";
import lupa from "./img/search.png";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const [marcasText, setMarcasText] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    const searchQuery = encodeURIComponent(searchText);
    navigate(`/clientes?search=${searchQuery}`);
  };

  const marcasSearch = () => {
    const searchQuery = encodeURIComponent(marcasText);
    navigate(`/marcas?search=${searchQuery}`);
  };

  return (
    <div className="cont-search">
      <div className="cont-search-1">
        <img src={logo2} alt="" className="img-buscar"></img>
        <form action="#" method="get" className="search-bar">
          <input
            type="text"
            placeholder="Buscar Cliente"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          ></input>
          <button type="submit" onClick={handleSearch}>
            <img src={lupa} alt="" className="lupa"></img>
          </button>
        </form>

        <form action="#" method="get" className="search-bar mt">
          <input
            type="text"
            placeholder="Buscar Marca"
            value={marcasText}
            onChange={(e) => setMarcasText(e.target.value)}
          ></input>
          <button type="submit" onClick={marcasSearch}>
            <img src={lupa} alt="" className="lupa"></img>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
