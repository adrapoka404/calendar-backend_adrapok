const { response } = require("express");
const Usuario = require("../models/Usuario");

const getUsuarios = async (req, res = response) => {
  const usuarios = await Usuario.find({ admin: false }, "name _id");
  res.status(200).json({
    ok: true,
    usuarios,
  });
};

module.exports = { getUsuarios };
