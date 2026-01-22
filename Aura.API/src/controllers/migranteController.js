const Migrante = require('../models/Migrante');

const getMigrantes = async (req, res) => {
  try {
    const registros = await Migrante.find().sort({ nombre: 1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la lista de migrantes" });
  }
};

const createMigrante = async (req, res) => {
  try {
    const nuevoRegistro = new Migrante(req.body);
    await nuevoRegistro.save();
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(400).json({ mensaje: "El código ya existe o los datos son inválidos" });
  }
};

const updateMigrante = async (req, res) => {
  try {
    const actualizado = await Migrante.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar el registro" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const registro = await Migrante.findById(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "Registro no encontrado" });
    
    registro.estado = !registro.estado;
    await registro.save();
    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar el estado" });
  }
};

module.exports = {
  getMigrantes,
  createMigrante,
  updateMigrante,
  toggleEstado
};