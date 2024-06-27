const { response } = require("express");
const Cuenta = require("../models/Cuenta");
const Usuario = require("../models/Usuario");
const crypto = require("crypto");

const getCuentas = async (req, res = response) => {
  const uid = req.uid;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status || "";
  const sort = parseInt(req.query.sort) || -1;

  try {
    const usuario = await Usuario.findById(uid);

    let cuentas = [];
    let count = 0;

    if (usuario.admin) {
      cuentas = await Cuenta.find({
        status: { $regex: status + ".*", $options: "i" },
      })
        .sort({ created: sort })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("payments")
        .populate("asignedTo", "name _id");

      count = await Cuenta.countDocuments({
        status: { $regex: status + ".*", $options: "i" },
      });
    } else {
      cuentas = await Cuenta.find({
        status: { $regex: status + ".*", $options: "i" },
        asignedTo: uid,
      })
        .sort({ created: sort })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("payments")
        .populate("asignedTo", "name _id");

      count = await Cuenta.countDocuments({
        status: { $regex: status + ".*", $options: "i" },
        asignedTo: uid,
      });
    }

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

  cuenta._id = generateUniqueId();
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
    const cuenta = await Cuenta.findById(cuentaId);

    if (!cuenta) {
      console.log("Error:  No se encontro cuenta con id: ", cuentaId);
      return res.status(404).json({
        ok: true,
        msg: "Pongase en contacto con su administrador de BD",
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
    ).populate("asignedTo", "name _id");

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

function generateUniqueId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(36); // Base36 timestamp
  const random = crypto
    .randomBytes(10)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, ""); // 10 bytes aleatorios convertidos a base64 y limpiados
  return (timestamp + random).slice(0, 20); // Concatenar y cortar a 20 caracteres
}

module.exports = { getCuentas, crearCuenta, actualizarCuenta, eliminarCuenta };
