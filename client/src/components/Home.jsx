import React, { useState } from "react";
import logo2 from "./img/logo2.png";
import "./css/home.css";
import { useNavigate } from "react-router-dom";
import lupa from "./img/search.png";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const searchQuery = encodeURIComponent(searchText);
    navigate(`/clientes?search=${searchQuery}`);
  };

  return (
    <div className="cont-search">
      <div className="cont-search">
        <img src={logo2} alt="" className="img-buscar"></img>
        <form action="#" method="get" className="search-bar">
          <input
            type="text"
            placeholder="Buscar Cliente"
            name="q"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          ></input>
          <button type="submit" onClick={handleSearch}>
            <img src={lupa} alt="" className="lupa"></img>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
