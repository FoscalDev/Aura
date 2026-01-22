const Decision2da = require('../models/DecisionSegundaInstancia');

const getDecisiones = async (req, res) => {
  try {
    const registros = await Decision2da.find().sort({ createdAt: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las decisiones" });
  }
};

const createDecision = async (req, res) => {
  try {
    const nuevoRegistro = new Decision2da(req.body);
    await nuevoRegistro.save();
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(400).json({ mensaje: "El código ya existe o los datos son inválidos" });
  }
};

const updateDecision = async (req, res) => {
  try {
    const actualizado = await Decision2da.findByIdAndUpdate(
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
    const registro = await Decision2da.findById(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: "Registro no encontrado" });
    
    registro.estado = !registro.estado;
    await registro.save();
    res.json(registro);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar el estado" });
  }
};

module.exports = {
  getDecisiones,
  createDecision,
  updateDecision,
  toggleEstado
};