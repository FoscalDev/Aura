const Etnia = require('../models/Etnia');

const getEtnias = async (req, res) => {
  try {
    const etnias = await Etnia.find().sort({ createdAt: -1 });
    res.json(etnias);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener etnias" });
  }
};

const createEtnia = async (req, res) => {
  try {
    const nuevaEtnia = new Etnia(req.body);
    await nuevaEtnia.save();
    res.status(201).json(nuevaEtnia);
  } catch (error) {
    res.status(400).json({ mensaje: "Error: El código ya existe o datos inválidos" });
  }
};

const updateEtnia = async (req, res) => {
  try {
    const etniaActualizada = await Etnia.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(etniaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const etnia = await Etnia.findById(req.params.id);
    etnia.estado = !etnia.estado;
    await etnia.save();
    res.json(etnia);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar estado" });
  }
};

// EXPORTACIÓN UNIFICADA (Esto evita el error de undefined)
module.exports = {
  getEtnias,
  createEtnia,
  updateEtnia,
  toggleEstado
};