/*
    Rutas Accounts
    host + /api/accounts
*/

const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

const {
  getCuentas,
  crearCuenta,
  actualizarCuenta,
  eliminarCuenta,
} = require("../controllers/accounts");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

router.use(validarJWT);
//Obtener cuentas
router.get("/", getCuentas);
//Crear un nueva cuenta
router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("amount", "El monto de la cuenta es requerido").not().isEmpty(),
    check("amount", "El monto debe ser un número válido").isNumeric(),
    check("amount", "El monto debe ser mayor a $10.00").isFloat({ gt: 10 }),
    check("asignedTo", "Debe asignar a un usuario valido").not().isEmpty(),
    validarCampos,
  ],
  crearCuenta
);

//Actulizar cuenta
router.put(
  "/:id",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("amount", "El monto de la cuenta es requerido").not().isEmpty(),
    check("amount", "El monto debe ser un número válido").isNumeric(),
    check("amount", "El monto debe ser mayor a $10.00").isFloat({ gt: 10 }),
    check("asignedTo", "Debe asignar a un usuario valido").not().isEmpty(),
    validarCampos,
  ],
  actualizarCuenta
);

//Borrar cuenta
router.delete("/:id", eliminarCuenta);

module.exports = router;
