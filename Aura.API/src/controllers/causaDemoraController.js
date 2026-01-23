const CausaDemora = require('../models/CausaDemora');

const getCausas = async (req, res) => {
  try {
    const causas = await CausaDemora.find().sort({ nombre: 1 });
    res.json(causas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las causas de demora" });
  }
};

const createCausa = async (req, res) => {
  try {
    const nuevaCausa = new CausaDemora(req.body);
    await nuevaCausa.save();
    res.status(201).json(nuevaCausa);
  } catch (error) {
    res.status(400).json({ mensaje: "El código ya existe o los datos son inválidos" });
  }
};

const updateCausa = async (req, res) => {
  try {
    const actualizada = await CausaDemora.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar la causa" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const registro = await CausaDemora.findById(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "Causa no encontrada" });
    
    registro.estado = !registro.estado;
    await registro.save();
    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar el estado" });
  }
};

module.exports = {
  getCausas,
  createCausa,
  updateCausa,
  toggleEstado
};