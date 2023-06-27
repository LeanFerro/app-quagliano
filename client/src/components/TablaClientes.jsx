import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "./css/tablaclientes.css";
import "primeicons/primeicons.css";
import { useLocation } from "react-router-dom";

const TablaClientes = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CLIENTE: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CUIT: { value: null, matchMode: FilterMatchMode.CONTAINS },
    EMAIL: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ACLARACION: { value: null, matchMode: FilterMatchMode.CONTAINS },
    FIRMANTE: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DOMICILIO: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LOCALIDAD: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CALLE: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/clientes");
        setClientes(response.data);
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

  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
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
            placeholder="Búsqueda general"
          />
        </span>
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
      <DataTable
        value={clientes}
        paginator
        rows={15}
        filters={filters}
        selectionMode="single"
        dataKey="id"
        header={header}
        globalFilterFields={[
          "CLIENTE",
          "CUIT",
          "EMAIL",
          "FIRMANTE",
          "DOMICILIO",
          "ACLARACION",
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
          field="CLIENTE"
          header="CLIENTE"
          style={{ minWidth: "400px" }}
        />
        <Column header="CUIT" field="CUIT" style={{ maxWidth: "150px" }} />
        <Column header="EMAIL" field="EMAIL" style={{ minWidth: "200px" }} />
        <Column
          field="ACLARACION"
          header="GRUPO"
          style={{ minWidth: "200px" }}
        />
        <Column
          field="FIRMANTE"
          header="FIRMANTE"
          style={{ minWidth: "300px" }}
        />
        <Column
          field="DOMICILIO"
          header="DOMICILIO"
          style={{ minWidth: "300px" }}
        />
        <Column
          field="LOCALIDAD"
          header="LOCALIDAD"
          style={{ minWidth: "200px" }}
        />
      </DataTable>
      <Dialog
        visible={modalVisible}
        onHide={hideModal}
        header={
          selectedRow && (
            <div className="modalhead">
              <h2>{selectedRow.CLIENTE}</h2>
            </div>
          )
        }
        footer={<Button label="Cerrar" onClick={hideModal} />}
        style={{ minWidth: "400px" }}
      >
        {selectedRow && (
          <div>
            <p className="info-client">DOMICILIO: {selectedRow.DOMICILIO}</p>
            <p className="info-client">FIRMANTE: {selectedRow.FIRMANTE}</p>
            <p className="info-client">GRUPO: {selectedRow.ACLARACION}</p>
            <p className="info-client">EMAIL: {selectedRow.EMAIL}</p>
            <p className="info-client">CUIT: {selectedRow.CUIT}</p>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default TablaClientes;
