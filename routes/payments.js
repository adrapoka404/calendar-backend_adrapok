/*
    Rutas Payments
    host + /api/payments
*/

const { Router } = require("express");
const router = Router();

const { crearPago } = require("../controllers/payments");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

//Crear un nuevo Pago
router.post(
  "/",
  [
    check("event", "No hay registro de quien desencadena el evento")
      .not()
      .isEmpty(),
    check("status", "No hay un esatus valido").not().isEmpty(),
    check("reference", "Falta la referencia del cliente").not().isEmpty(),
    check("id", "No hay un identificador valido").isNumeric(),
    check("total", "No hay un monto valido").isNumeric(),
    check("hash", "Falta la firma de seguridad").not().isEmpty(),
    validarCampos,
  ],
  crearPago
);

module.exports = router;
