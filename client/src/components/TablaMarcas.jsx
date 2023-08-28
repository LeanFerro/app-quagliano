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
    CLASE: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FEC_VTO: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FVTODU: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/marcas");
        setMarcas(response.data);
      } catch (error) {
        // Manejar errores de la petición
        console.error(error);
      }
    };

    fetchData();
  }, []);

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

  const nombreCliente = location.state?.nombreCliente;
  console.log(nombreCliente);

  const renderHeader = () => {
    return (
      <div>
        <div className="titulo">
          <h1 className="nomb-emp">{nombreCliente}</h1>
        </div>
        <div className="header">
          <div className="flex justify-content-end ">
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
              Votionis S.A
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">
                Ideas del Sur S.A.
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2">Telepiu S.A.</Dropdown.Item>
              <Dropdown.Item href="#/action-3">DH COM</Dropdown.Item>
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
            "CLASE",
            "FEC_VTO",
            "FVTODU",
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
          <Column field="acta" header="ACTA" style={{ minWidth: "200px" }} />
          <Column
            field="resolucion"
            header="NRESO"
            style={{ minWidth: "200px" }}
          />
          <Column field="CLASE" header="CLASE" style={{ minWidth: "100px" }} />
          <Column
            field="FEC_VTO"
            header="FEC_VTO"
            style={{ minWidth: "200px" }}
          />
          <Column
            field="FVTODU"
            header="FVTODU"
            style={{ minWidth: "200px" }}
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
