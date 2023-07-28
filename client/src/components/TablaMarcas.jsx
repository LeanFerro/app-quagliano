import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import axios from "axios";
import "primereact/resources/themes/saga-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "./css/tablaclientes.css";
import "primeicons/primeicons.css";
import { useLocation } from "react-router-dom";

const TablaMarcas = () => {
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

  return (
    <div>
      <DataTable
        value={marcas}
        paginator
        rows={20}
        filters={filters}
        selectionMode="single"
        dataKey="id"
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
        <Column headerStyle={{ width: "2rem" }}></Column>
        <Column field="MARCA" header="MARCA" style={{ minWidth: "400px" }} />
        <Column field="ACTA" header="ACTA" style={{ minWidth: "200px" }} />
        <Column field="NRESO" header="NRESO" style={{ minWidth: "200px" }} />
        <Column field="CLASE" header="CLASE" style={{ minWidth: "100px" }} />
        <Column
          field="FEC_VTO"
          header="FEC_VTO"
          style={{ minWidth: "200px" }}
        />
        <Column field="FVTODU" header="FVTODU" style={{ minWidth: "200px" }} />
      </DataTable>
    </div>
  );
};

export default TablaMarcas;
