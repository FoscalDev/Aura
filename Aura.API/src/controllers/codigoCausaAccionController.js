const CodigoCausaAccion = require('../models/CodigoCausaAccion');

exports.obtenerTodos = async (req, res) => {
  try {
    const lista = await CodigoCausaAccion.find().sort({ createdAt: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los registros" });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevo = new CodigoCausaAccion(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: "El código ya existe en el sistema" });
    }
    res.status(400).json({ mensaje: "Error al crear el registro", detalle: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const actualizado = await CodigoCausaAccion.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar" });
  }
};

exports.toggleEstado = async (req, res) => {
  try {
    const item = await CodigoCausaAccion.findById(req.params.id);
    if (!item) return res.status(404).json({ mensaje: "No encontrado" });
    
    item.estado = !item.estado;
    await item.save();
    res.json({ mensaje: "Estado actualizado", estado: item.estado });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar estado" });
  }
};