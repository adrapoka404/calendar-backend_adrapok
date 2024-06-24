/*
    Rutas Profiles
    host + /api/profiles
*/

const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { crearPerfil, actualizarPerfil } = require("../controllers/profiles");

router.use(validarJWT);
//Crear un nuevo perfil
router.post(
  "/",
  [
    check("fname", "El nombre es obligatorio").not().isEmpty(),
    check("lname", "El apellido paterno es requerido").not().isEmpty(),
    check("mname", "El apellido materno es requerido").not().isEmpty(),
    check("phone", "El teléfono es requerido").not().isEmpty(),
    check("phone", "El teléfono debe ser numerico de 10 digitos").isNumeric(),
    check("addr", "la dirección es requerida").not().isEmpty(),
    check("state", "El estado es requerido").not().isEmpty(),
    check("city", "La ciudad es requerida").not().isEmpty(),
    check("zip", "El código postal es requerido").not().isEmpty(),
    validarCampos,
  ],
  crearPerfil
);

//Actulizar perfil
router.put(
  "/:id",
  [
    check("fname", "El nombre es obligatorio").not().isEmpty(),
    check("lname", "El apellido paterno es requerido").not().isEmpty(),
    check("mname", "El apellido materno es requerido").not().isEmpty(),
    check("phone", "El teléfono es requerido").not().isEmpty(),
    check("phone", "El teléfono debe ser numerico de 10 digitos").isNumeric(),
    check("addr", "la dirección es requerida").not().isEmpty(),
    check("state", "El estado es requerido").not().isEmpty(),
    check("city", "La ciudad es requerida").not().isEmpty(),
    check("zip", "El código postal es requerido").not().isEmpty(),
    validarCampos,
  ],
  actualizarPerfil
);

module.exports = router;
