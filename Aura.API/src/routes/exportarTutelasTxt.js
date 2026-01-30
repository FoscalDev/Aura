const express = require("express");
const router = express.Router();
const { exportarTxt } = require("../controllers/exportarTutelasTxt");

router.get("/exportar-tutelas-txt", exportarTxt);

module.exports = router;
