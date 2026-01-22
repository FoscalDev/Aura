const ProblemaJuridico = require('../models/CodigoProblemaJuridico');

const getProblemas = async (req, res) => {
  try {
    const lista = await ProblemaJuridico.find().sort({ nombre: 1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener problemas jurídicos" });
  }
};

const createProblema = async (req, res) => {
  try {
    const nuevo = new ProblemaJuridico(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: "Error: El código ya existe o datos inválidos" });
  }
};

const updateProblema = async (req, res) => {
  try {
    const actualizado = await ProblemaJuridico.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const registro = await ProblemaJuridico.findById(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "No encontrado" });
    
    registro.estado = !registro.estado;
    await registro.save();
    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar estado" });
  }
};

module.exports = {
  getProblemas,
  createProblema,
  updateProblema,
  toggleEstado
};