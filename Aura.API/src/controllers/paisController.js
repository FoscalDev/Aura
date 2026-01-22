const Pais = require('../models/Pais');

const getPaises = async (req, res) => {
  try {
    const paises = await Pais.find().sort({ nombre: 1 });
    res.json(paises);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener países" });
  }
};

const createPais = async (req, res) => {
  try {
    const nuevoPais = new Pais(req.body);
    await nuevoPais.save();
    res.status(201).json(nuevoPais);
  } catch (error) {
    res.status(400).json({ mensaje: "Error: El código ya existe o datos inválidos" });
  }
};

const updatePais = async (req, res) => {
  try {
    const actualizado = await Pais.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar país" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const pais = await Pais.findById(req.params.id);
    if (!pais) return res.status(404).json({ mensaje: "No encontrado" });
    
    pais.estado = !pais.estado;
    await pais.save();
    res.json(pais);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar estado" });
  }
};

module.exports = {
  getPaises,
  createPais,
  updatePais,
  toggleEstado
};