const { response } = require("express");
const Evento = require("../models/Evento");

const getEventos = async (req, res = response) => {
  const eventos = await Evento.find().populate("user", "name");
  res.status(200).json({
    ok: true,
    eventos,
  });
};

const crearEvento = async (req, res = response) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    eventoGuardado = await evento.save();

    res.status(201).json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log("Crear evento:", error);
    return res.status(500).json({
      ok: false,
      msg: "pongase en contacto con su administrador de BD",
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      console.log("Error:  No se encontro el evento con id: ", eventoId);
      return res.status(404).json({
        ok: true,
        msg: "Pongase en contacto con su administrador de BD",
      });
    }

    //que sea el mismo user que la creo
    if (evento.user.toString() !== uid) {
      console.log("Error:  no es el mismo usuario el que actualiza");
      return res.status(401).json({
        ok: true,
        msg: "Privilegios insuficientes",
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActulizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );

    res.status(201).json({
      ok: true,
      evento: eventoActulizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: true,
      msg: "Pongase en contacto con su administrador de BD",
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      console.log("Error:  No se encontro el evento con id: ", eventoId);
      return res.status(404).json({
        ok: true,
        msg: "Pongase en contacto con su administrador de BD",
      });
    }

    //que sea el mismo user que la creo
    if (evento.user.toString() !== uid) {
      console.log("Error:  no es el mismo usuario el que elimina");
      return res.status(401).json({
        ok: true,
        msg: "Privilegios insuficientes",
      });
    }

    await Evento.findByIdAndDelete(eventoId);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: true,
      msg: "Pongase en contacto con su administrador de BD",
    });
  }
};

module.exports = { getEventos, crearEvento, actualizarEvento, eliminarEvento };
