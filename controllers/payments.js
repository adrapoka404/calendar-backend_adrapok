const { response } = require("express");
const Pago = require("../models/Pago");
const Cuenta = require("../models/Cuenta");

const crearPago = async (req, res = response) => {
  const pago = new Pago(req.body);

  try {
    const cuentaId = pago.reference;
    pago.paymentId = pago.id;

    const pagoGuardado = await pago.save();

    const cuenta = await Cuenta.findById(cuentaId);

    if (!cuenta) {
      console.log("Error: No se encontró cuenta con id:", cuentaId);
      return res.status(404).json({
        ok: false,
        msg: "Póngase en contacto con su administrador de BD",
      });
    }

    // Agregar el nuevo pago al arreglo de pagos de la cuenta
    cuenta.payments.push(pagoGuardado.id);
    await cuenta.save();

    res.status(201).json({
      ok: true,
      cuenta: pagoGuardado,
    });
  } catch (error) {
    console.log("Crear pago:", error);
    return res.status(500).json({
      ok: false,
      msg: "Póngase en contacto con su administrador de BD",
    });
  }
};

module.exports = { crearPago };
