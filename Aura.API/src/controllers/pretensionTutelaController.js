const PretensionTutela = require('../models/PretensionTutela');

const getPretensiones = async (req, res) => {
  try {
    const lista = await PretensionTutela.find().sort({ nombre: 1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las pretensiones" });
  }
};

const createPretension = async (req, res) => {
  try {
    const nueva = new PretensionTutela(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ mensaje: "El código ya existe o los datos son inválidos" });
  }
};

const updatePretension = async (req, res) => {
  try {
    const actualizada = await PretensionTutela.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar la pretensión" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const registro = await PretensionTutela.findById(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "Registro no encontrado" });
    
    registro.estado = !registro.estado;
    await registro.save();
    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar el estado" });
  }
};

module.exports = {
  getPretensiones,
  createPretension,
  updatePretension,
  toggleEstado
};