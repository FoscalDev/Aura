const Municipio = require('../models/Municipio');

const getMunicipios = async (req, res) => {
  try {
    const municipios = await Municipio.find().sort({ nombre: 1 });
    res.json(municipios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener municipios" });
  }
};

const createMunicipio = async (req, res) => {
  try {
    const nuevoMunicipio = new Municipio(req.body);
    await nuevoMunicipio.save();
    res.status(201).json(nuevoMunicipio);
  } catch (error) {
    res.status(400).json({ mensaje: "Error: El código ya existe o datos inválidos" });
  }
};

const updateMunicipio = async (req, res) => {
  try {
    const actualizado = await Municipio.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar municipio" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const municipio = await Municipio.findById(req.params.id);
    if (!municipio) return res.status(404).json({ mensaje: "No encontrado" });
    
    municipio.estado = !municipio.estado;
    await municipio.save();
    res.json(municipio);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar estado" });
  }
};

module.exports = {
  getMunicipios,
  createMunicipio,
  updateMunicipio,
  toggleEstado
};