import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "./tablamarcas.css";
import "primeicons/primeicons.css";
import { useLocation } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import boletin from "../img/1boletin.jpg";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../helpers/auth";
import { getMarcas } from "../helpers/api";
import DarkModeContext from "../helpers/DarkModeContext";
import { FaCaretDown } from "react-icons/fa";

const TablaMarcas = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/log");
    }
  }, [navigate]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [filtroCliente, setFiltroCliente] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [search, setSearch] = useState(""); // Estado para el valor del input
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    MARCA: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ACTA: { value: null, matchMode: FilterMatchMode.CONTAINS },
    NRESO: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CLASE: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FEC_VTO: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FVTODU: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const location = useLocation();
  const [nombreCliente, setNombreCliente] = useState(
    location.state ? location.state.nombreCliente : "Cliente no definido"
  );
  const [indaloClientes] = useState(
    location.state ? location.state.indaloClientes : []
  );
  console.log(indaloClientes);

  const [clientesFiltradosEstado, setClientesFiltradosEstado] =
    useState(indaloClientes);

  // const [role] = useState(
  //   location.state ? location.state.role : []
  // );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMarcas(nombreCliente);
        console.log(data);
        setMarcas(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [nombreCliente]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search");

    setFilters((prevFilters) => ({
      ...prevFilters,
      global: {
        value: searchQuery,
        matchMode: FilterMatchMode.CONTAINS,
      },
    }));
  }, [location.search]);

  const handleSelectCliente = (cliente) => {
    setNombreCliente(cliente);
    setDropdownOpen(false);
    setSearch(cliente);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    // Si el dropdown está cerrado, restablecer la búsqueda y mostrar todos los clientes
    if (!dropdownOpen) {
      setSearch("");
      setClientesFiltradosEstado(indaloClientes);
    }
  };

  const handleInputClick = () => {
    setSearch("");
    setDropdownOpen(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setDropdownOpen(true);
    setFiltroCliente(e.target.value);
    if (value) {
      const filtered = indaloClientes.filter((cliente) =>
        cliente.toLowerCase().includes(value.toLowerCase())
      );
      setClientesFiltradosEstado(filtered); // Aquí es donde se debe corregir
    } else {
      setClientesFiltradosEstado(indaloClientes);
    }
  };

  useEffect(() => {
    const clientesFiltrados = filtroCliente
      ? indaloClientes.filter((cliente) =>
          cliente.toLowerCase().includes(filtroCliente.toLowerCase())
        )
      : indaloClientes;

    setClientesFiltradosEstado(clientesFiltrados);
  }, [filtroCliente, indaloClientes]);

  const renderHeader = () => {
    return (
      <div>
        <div className="titulo">
          <h1 className={isDarkMode ? "nomb-emp-dark" : "nomb-emp"}>
            {nombreCliente}
          </h1>
        </div>
        <div className="header">
          <div className="flex justify-content-end start" id="start">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                onInput={(e) =>
                  setFilters({
                    ...filters,
                    global: {
                      value: e.target.value,
                      matchMode: FilterMatchMode.CONTAINS,
                    },
                  })
                }
                placeholder="Ingrese su marca"
              />
            </span>
          </div>
          <Dropdown
            ref={dropdownRef}
            show={dropdownOpen}
            onToggle={() => setDropdownOpen(!dropdownOpen)}
            className="d-inline-block"
          >
            <div className="d-flex">
              <input
                className="form-control"
                type="text"
                placeholder="Buscar empresa..."
                value={search}
                onChange={handleInputChange}
                onClick={handleInputClick}
              />
              <button
                onClick={toggleDropdown}
                className="btn btn-success dropdown-toggle-split"
              >
                <FaCaretDown />
              </button>
            </div>
            <Dropdown.Menu
              ref={menuRef}
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                position: "absolute",
                right: "0",
              }}
            >
              {clientesFiltradosEstado.map((cliente, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleSelectCliente(cliente)}
                >
                  {cliente}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  };

  const header = renderHeader();
  const handleRowClick = useCallback((rowData) => {
    setSelectedRow(rowData);
    setModalVisible(true);
  }, []);
  const hideModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const tiempo = (rowData) => {
    const fechaVencimiento = new Date(rowData.FEC_VTO);
    const dia = fechaVencimiento.getDate();
    const mes = fechaVencimiento.getMonth() + 1;
    const año = fechaVencimiento.getFullYear();
    const fechaFormateada = `${dia < 10 ? "0" : ""}${dia}-${
      mes < 10 ? "0" : ""
    }${mes}-${año}`;
    return <span>{fechaFormateada}</span>;
  };

  const tiempoDu = (rowData) => {
    const fechaVencimiento = new Date(rowData.FVTODU);
    const dia = fechaVencimiento.getDate();
    const mes = fechaVencimiento.getMonth() + 1;
    const año = fechaVencimiento.getFullYear();
    const fechaFormateada = `${dia < 10 ? "0" : ""}${dia}-${
      mes < 10 ? "0" : ""
    }${mes}-${año}`;
    return <span>{fechaFormateada}</span>;
  };

  return (
    <div>
      <div className="table-container">
        <DataTable
          className={isDarkMode ? "light-bg" : ""}
          value={marcas}
          paginator
          paginatorClassName={isDarkMode ? "dark-paginator" : ""}
          rows={10}
          filters={filters}
          selectionMode="single"
          dataKey="ID_MARCA"
          header={header}
          globalFilterFields={[
            "MARCA",
            "ACTA",
            "NRESO",
            "CLASE",
            "FEC_VTO",
            "FVTODU",
          ]}
          emptyMessage="No se encontraron resultados"
        >
          <Column
            className={isDarkMode ? "dark-text-color" : ""}
            body={(rowData) => (
              <Button
                label=""
                icon="pi pi-search"
                onClick={() => handleRowClick(rowData)}
              />
            )}
          />
          <Column
            className={isDarkMode ? "dark-text-color" : ""}
            field="MARCA"
            header="MARCA"
            style={{ minWidth: "400px" }}
            body={(rowData) => (
              <span style={{ paddingLeft: "10px" }}>{rowData.MARCA}</span>
            )}
          />
          <Column
            className={isDarkMode ? "dark-text-color" : ""}
            field="ACTA"
            header="ACTA"
            style={{ minWidth: "100px" }}
          />
          <Column
            className={isDarkMode ? "dark-text-color" : ""}
            field="NRESO"
            header="RESOLUCION"
            style={{ minWidth: "100px" }}
            body={(rowData) => (
              <div style={{ marginLeft: "20px" }}>{rowData.NRESO}</div>
            )}
          />
          <Column
            className={isDarkMode ? "dark-text-color" : ""}
            field="CLASE"
            header="CLASE"
            style={{ minWidth: "80px", paddingLeft: "5px" }}
            body={(rowData) => (
              <div style={{ marginLeft: "20px" }}>{rowData.CLASE}</div>
            )}
          />
          <Column
            className={isDarkMode ? "dark-text-color" : ""}
            field="FEC_VTO"
            header="VTO MARCA"
            style={{ minWidth: "125px", paddingLeft: "5px" }}
            body={tiempo}
          />
          <Column
            className={isDarkMode ? "dark-text-color" : ""}
            field="FVTODU"
            header="VTO DU"
            style={{ minWidth: "125px", paddingLeft: "5px" }}
            body={tiempoDu}
          />
        </DataTable>
      </div>
      <Dialog
        visible={modalVisible}
        onHide={hideModal}
        header={
          selectedRow && (
            <div className="modalhead">
              <h2>{selectedRow.nombre}</h2>
            </div>
          )
        }
        style={{ minWidth: "400px" }}
      >
        <img src={boletin} alt=""></img>
      </Dialog>
    </div>
  );
};

export default TablaMarcas;
