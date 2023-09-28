const express = require("express");
const { getLogin, postSignup, verifyCuit } = require("../controllers/authc");
const router = express.Router();
const dbconnection = require("../database/database");

router.post("/signup", postSignup);

router.get("/verificar-cuit", verifyCuit);

router.post("/login", getLogin);

module.exports = router;
