const { response } = require("express");
const Cuenta = require("../models/Cuenta");

const getCuentas = async (req, res = response) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status || "created";
  let sort = -1;

  if (req.query.sort === "up") sort = 1;
  try {
    const cuentas = await Cuenta.find({ status })
      .sort({ created: sort })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("payments")
      .populate("asignedTo", "name _id");

    const count = await Cuenta.countDocuments();
    const pages = Math.ceil(count / limit);

    res.status(200).json({
      ok: true,
      pages,
      page,
      limit,
      cuentas,
      count,
    });
  } catch (error) {
    console.log("Crear cuenta:", error);
    return res.status(500).json({
      ok: false,
      msg: "pongase en contacto con su administrador de BD",
    });
  }
};

const crearCuenta = async (req, res = response) => {
  const cuenta = new Cuenta(req.body);
  console.log(req.body);
  try {
    cuenta.createdBy = req.uid;
    cuentaGuardada = await cuenta.save();

    res.status(201).json({
      ok: true,
      cuenta: cuentaGuardada,
    });
  } catch (error) {
    console.log("Crear cuenta:", error);
    return res.status(500).json({
      ok: false,
      msg: "pongase en contacto con su administrador de BD",
    });
  }
};

const actualizarCuenta = async (req, res = response) => {
  const cuentaId = req.params.id;
  const uid = req.uid;

  try {
    const cuenta = await Cuenta.findById(cuentaId).populate(
      "asignedTo",
      "name _id"
    );

    if (!cuenta) {
      console.log("Error:  No se encontro cuenta con id: ", cuentaId);
      return res.status(404).json({
        ok: true,
        msg: "Pongase en contacto con su administrador de BD",
      });
    }

    //que sea el mismo user que la creo
    if (cuenta.createdBy.toString() !== uid) {
      console.log("Error:  no es el mismo usuario creador");
      return res.status(401).json({
        ok: true,
        msg: "Privilegios insuficientes",
      });
    }

    const nuevaCuenta = {
      ...req.body,
      createdBy: uid,
    };

    const cuentaActulizada = await Cuenta.findByIdAndUpdate(
      cuentaId,
      nuevaCuenta,
      { new: true }
    );

    res.status(201).json({
      ok: true,
      cuenta: cuentaActulizada,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: true,
      msg: "Pongase en contacto con su administrador de BD",
    });
  }
};

const eliminarCuenta = async (req, res = response) => {
  const cuentaId = req.params.id;
  const uid = req.uid;

  try {
    const cuenta = await Cuenta.findById(cuentaId);

    if (!cuenta) {
      console.log("Error:  No se encontro la cuenta con id: ", cuentaId);
      return res.status(404).json({
        ok: true,
        msg: "Pongase en contacto con su administrador de BD",
      });
    }

    //que sea el mismo user que la creo
    if (cuenta.createdBy.toString() !== uid) {
      console.log("Error:  no es el mismo usuario el que elimina");
      return res.status(401).json({
        ok: true,
        msg: "Privilegios insuficientes",
      });
    }

    await Cuenta.findByIdAndDelete(cuentaId);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: true,
      msg: "Pongase en contacto con su administrador de BD",
    });
  }
};

module.exports = { getCuentas, crearCuenta, actualizarCuenta, eliminarCuenta };
