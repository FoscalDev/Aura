const FuenteFinanciacion = require('../models/FuenteFinanciacion');

const getFuentes = async (req, res) => {
  try {
    const lista = await FuenteFinanciacion.find().sort({ nombre: 1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener fuentes de financiación" });
  }
};

const createFuente = async (req, res) => {
  try {
    const nueva = new FuenteFinanciacion(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ mensaje: "El código ya existe o los datos son inválidos" });
  }
};

const updateFuente = async (req, res) => {
  try {
    const actualizada = await FuenteFinanciacion.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar la fuente" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const registro = await FuenteFinanciacion.findById(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "No encontrado" });
    
    registro.estado = !registro.estado;
    await registro.save();
    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar el estado" });
  }
};

module.exports = {
  getFuentes,
  createFuente,
  updateFuente,
  toggleEstado
};