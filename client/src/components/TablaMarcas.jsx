import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "./css/tablamarcas.css";
import "primeicons/primeicons.css";
import { useLocation } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import boletin from "./img/1boletin.jpg";

const TablaMarcas = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
    acta: { value: null, matchMode: FilterMatchMode.CONTAINS },
    resolucion: { value: null, matchMode: FilterMatchMode.CONTAINS },
    clase: { value: null, matchMode: FilterMatchMode.CONTAINS },
    vencimiento: { value: null, matchMode: FilterMatchMode.CONTAINS },
    vencimiento_du: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const location = useLocation();
  const [nombreCliente, setNombreCliente] = useState(
    location.state ? location.state.nombreCliente : "Cliente no definido"
  );
  const [indaloClientes] = useState(
    location.state ? location.state.indaloClientes : []
  );

  console.log("Linea 1: ", indaloClientes);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/marcas?nombreCliente=${nombreCliente}`
        );

        setMarcas(response.data);
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
              {nombreCliente}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {Array.isArray(indaloClientes) &&
                indaloClientes.map((nombre, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => setNombreCliente(nombre)}
                  >
                    {nombre}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  };
  const header = renderHeader();

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <div className="table-container">
        <DataTable
          value={marcas}
          paginator
          rows={20}
          filters={filters}
          selectionMode="single"
          dataKey="id"
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
            field="nombre"
            header="MARCA"
            style={{ minWidth: "400px" }}
            body={(rowData) => (
              <span style={{ paddingLeft: "10px" }}>{rowData.nombre}</span>
            )}
          />
          <Column field="acta" header="ACTA" style={{ minWidth: "100px" }} />
          <Column
            field="resolucion"
            header="RESOLUCION"
            style={{ minWidth: "100px" }}
            body={(rowData) => (
              <div style={{ marginLeft: "20px" }}>{rowData.resolucion}</div>
            )}
          />
          <Column
            field="clase"
            header="CLASE"
            style={{ minWidth: "80px", paddingLeft: "5px" }}
            body={(rowData) => (
              <div style={{ marginLeft: "20px" }}>{rowData.clase}</div>
            )}
          />
          <Column
            field="vencimiento"
            header="VTO MARCA"
            style={{ minWidth: "125px", paddingLeft: "5px" }}
            body={(rowData) => {
              const fechaVencimiento = new Date(rowData.vencimiento);
              const dia = fechaVencimiento.getDate();
              const mes = fechaVencimiento.getMonth() + 1;
              const año = fechaVencimiento.getFullYear();
              const fechaFormateada = `${dia < 10 ? "0" : ""}${dia}-${
                mes < 10 ? "0" : ""
              }${mes}-${año}`;
              return <span>{fechaFormateada}</span>;
            }}
          />
          <Column
            field="vencimiento_du"
            header="VTO DU"
            style={{ minWidth: "125px", paddingLeft: "5px" }}
            body={(rowData) => {
              const fechaVencimiento = new Date(rowData.vencimiento_du);
              const dia = fechaVencimiento.getDate();
              const mes = fechaVencimiento.getMonth() + 1;
              const año = fechaVencimiento.getFullYear();
              const fechaFormateada = `${dia < 10 ? "0" : ""}${dia}-${
                mes < 10 ? "0" : ""
              }${mes}-${año}`;
              return <span>{fechaFormateada}</span>;
            }}
          />
        </DataTable>
      </div>
      <Dialog
        visible={modalVisible}
        onHide={hideModal}
        header={
          selectedRow && (
            <div className="modalhead">
              <h2>{selectedRow.MARCA}</h2>
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
