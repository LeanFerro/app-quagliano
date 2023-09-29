const express = require("express");
const { getClientes, getMarcas } = require("../controllers/userc");
const router = express.Router();
const dbconnection = require("../database/database");

router.get("/clientes", getClientes);

router.get("/marcas", getMarcas);

module.exports = router;
