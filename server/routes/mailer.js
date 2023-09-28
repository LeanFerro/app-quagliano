const express = require("express");
const { passRecover, passReset } = require("../controllers/mailerc");
const router = express.Router();
const dbconnection = require("../database/database");

router.post("/password-recovery", passRecover);

router.post("/reset-password", passReset);

module.exports = router;
