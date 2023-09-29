import React, { useState, useEffect, useCallback } from "react";
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
import "../navbar/script";
import { getMarcas } from "../helpers/api";

const TablaMarcas = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/log");
    }
  }, [navigate]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [marcas, setMarcas] = useState([]);
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

  const renderHeader = () => {
    return (
      <div>
        <div className="titulo">
          <h1 className="nomb-emp">{nombreCliente}</h1>
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
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Elegir empresa
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ maxHeight: "400px", overflowY: "auto" }}>
              {Array.isArray(indaloClientes) &&
                indaloClientes.map((cliente, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => setNombreCliente(cliente)}
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
          value={marcas}
          paginator
          rows={10}
          filters={filters}
          selectionMode="single"
          dataKey="ID_MARCA"
          header={header}
          globalFilterFields={[
            "nombre",
            "acta",
            "resolucion",
            "clase",
            "vencimiento",
            "vencimiento_du",
          ]}
          emptyMessage="No se encontraron resultados"
        >
          <Column
            body={(rowData) => (
              <Button
                label=""
                icon="pi pi-search"
                onClick={() => handleRowClick(rowData)}
              />
            )}
          />
          <Column
            field="MARCA"
            header="MARCA"
            style={{ minWidth: "400px" }}
            body={(rowData) => (
              <span style={{ paddingLeft: "10px" }}>{rowData.MARCA}</span>
            )}
          />
          <Column field="ACTA" header="ACTA" style={{ minWidth: "100px" }} />
          <Column
            field="NRESO"
            header="RESOLUCION"
            style={{ minWidth: "100px" }}
            body={(rowData) => (
              <div style={{ marginLeft: "20px" }}>{rowData.NRESO}</div>
            )}
          />
          <Column
            field="CLASE"
            header="CLASE"
            style={{ minWidth: "80px", paddingLeft: "5px" }}
            body={(rowData) => (
              <div style={{ marginLeft: "20px" }}>{rowData.CLASE}</div>
            )}
          />
          <Column
            field="FEC_VTO"
            header="VTO MARCA"
            style={{ minWidth: "125px", paddingLeft: "5px" }}
            body={tiempo}
          />
          <Column
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
