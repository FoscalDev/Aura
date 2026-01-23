const RegimenAfiliacion = require('../models/RegimenAfiliacion');

const getRegimenes = async (req, res) => {
  try {
    const lista = await RegimenAfiliacion.find().sort({ nombre: 1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los regímenes de afiliación" });
  }
};

const createRegimen = async (req, res) => {
  try {
    const nuevo = new RegimenAfiliacion(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: "El código ya existe o faltan datos requeridos" });
  }
};

const updateRegimen = async (req, res) => {
  try {
    const actualizado = await RegimenAfiliacion.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar el régimen" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const registro = await RegimenAfiliacion.findById(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "Régimen no encontrado" });
    
    registro.estado = !registro.estado;
    await registro.save();
    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar el estado del régimen" });
  }
};

module.exports = {
  getRegimenes,
  createRegimen,
  updateRegimen,
  toggleEstado
};