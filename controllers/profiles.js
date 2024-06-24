const { response } = require("express");
const Perfil = require("../models/Profile");
const Usuario = require("../models/Usuario");

const crearPerfil = async (req, res = response) => {
  const uid = req.uid;
  const user = await Usuario.findById(uid);

  if (user.profile) {
    console.log("Este usuario ya cuenta con un perfil registrado");
    res.status(500).json({
      ok: false,
      msg: "pongase en contacto con su administrador de BD",
    });
    return;
  }

  try {
    const perfil = new Perfil(req.body);

    perfil.country = "MX";
    perfil.email = user.email;

    perfilGuardado = await perfil.save();

    const userUpdate = await Usuario.findByIdAndUpdate(
      uid,
      { profile: perfilGuardado._id },
      { new: true }
    ).populate("profile");

    res.status(201).json({
      ok: true,
      perfil: perfilGuardado,
    });
  } catch (error) {
    console.log("Crear perfil:", error);
    return res.status(500).json({
      ok: false,
      msg: "pongase en contacto con su administrador de BD",
    });
  }
};

const actualizarPerfil = async (req, res = response) => {
  const perfilId = req.params.id;

  try {
    const perfil = await Perfil.findById(perfilId);

    if (!perfil) {
      console.log("Error:  No se encontro perfil con id: ", perfilId);
      return res.status(404).json({
        ok: true,
        msg: "Pongase en contacto con su administrador de BD",
      });
    }

    const nuevoPerfil = {
      ...req.body,
    };

    const perfilActulizado = await Perfil.findByIdAndUpdate(
      perfilId,
      nuevoPerfil,
      { new: true }
    );

    res.status(201).json({
      ok: true,
      perfil: perfilActulizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: true,
      msg: "Pongase en contacto con su administrador de BD",
    });
  }
};

module.exports = { crearPerfil, actualizarPerfil };
