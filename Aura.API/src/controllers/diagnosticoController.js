const Diagnostico = require('../models/Diagnostico');

const getDiagnosticos = async (req, res) => {
  try {
    const lista = await Diagnostico.find().sort({ codigo: 1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los diagnósticos" });
  }
};

const createDiagnostico = async (req, res) => {
  try {
    const nuevo = new Diagnostico(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: "El código de diagnóstico ya existe" });
  }
};

const updateDiagnostico = async (req, res) => {
  try {
    const actualizado = await Diagnostico.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar el diagnóstico" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const registro = await Diagnostico.findById(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "No encontrado" });
    
    registro.estado = !registro.estado;
    await registro.save();
    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar estado" });
  }
};

module.exports = {
  getDiagnosticos,
  createDiagnostico,
  updateDiagnostico,
  toggleEstado
};