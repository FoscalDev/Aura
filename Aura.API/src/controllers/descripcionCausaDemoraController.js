const DescripcionCausaDemora = require('../models/DescripcionCausaDemora');

const getDescripciones = async (req, res) => {
  try {
    const lista = await DescripcionCausaDemora.find().sort({ nombre: 1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las descripciones" });
  }
};

const createDescripcion = async (req, res) => {
  try {
    const nueva = new DescripcionCausaDemora(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ mensaje: "El código ya existe o los datos son inválidos" });
  }
};

const updateDescripcion = async (req, res) => {
  try {
    const actualizada = await DescripcionCausaDemora.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar el registro" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const registro = await DescripcionCausaDemora.findById(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "No encontrado" });
    
    registro.estado = !registro.estado;
    await registro.save();
    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar el estado" });
  }
};

module.exports = {
  getDescripciones,
  createDescripcion,
  updateDescripcion,
  toggleEstado
};