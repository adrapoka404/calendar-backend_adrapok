const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya se encuentra registrado",
      });
    }

    usuario = new Usuario(req.body);

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();

    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "mamo!",
    });
  }
};
//loginUsuario
const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    console.log(usuario);
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario y/o contraseña incorrectos",
      });
    }
    //confirmar pass
    const valid_pass = bcrypt.compareSync(password, usuario.password);

    if (!valid_pass) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecta",
      });
    }
    //Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(200).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "mamo!",
    });
  }
};
//revalidarToken
const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;
  // Generar Token
  const token = await generarJWT(uid, name);
  res.status(200).json({
    ok: true,
    token,
  });
};
module.exports = { crearUsuario, loginUsuario, revalidarToken };
