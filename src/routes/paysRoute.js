const express = require("express");
const router = express.Router();
const paysControllers = require("../controllers/paysControllers");


router.get("/", paysControllers.getAllPays);
router.post("/", paysControllers.createPays);


module.exports = router;