/*
    Rutas Users
    host + /api/users
*/

const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

const { getUsuarios } = require("../controllers/users");
const { check } = require("express-validator");
const { isDate } = require("../helpers/isDate");

router.use(validarJWT);
//Obtener eventos
router.get("/", getUsuarios);

module.exports = router;
