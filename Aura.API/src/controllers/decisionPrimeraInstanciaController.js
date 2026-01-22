const Decision = require('../models/DecisionPrimeraInstancia');

const getDecisiones = async (req, res) => {
  try {
    const decisiones = await Decision.find().sort({ createdAt: -1 });
    res.json(decisiones);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener decisiones" });
  }
};

const createDecision = async (req, res) => {
  try {
    const nuevaDecision = new Decision(req.body);
    await nuevaDecision.save();
    res.status(201).json(nuevaDecision);
  } catch (error) {
    res.status(400).json({ mensaje: "Error: El código ya existe o datos inválidos" });
  }
};

const updateDecision = async (req, res) => {
  try {
    const actualizada = await Decision.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar la decisión" });
  }
};

const toggleEstado = async (req, res) => {
  try {
    const decision = await Decision.findById(req.params.id);
    if (!decision) return res.status(404).json({ mensaje: "No encontrado" });
    
    decision.estado = !decision.estado;
    await decision.save();
    res.json(decision);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar estado" });
  }
};

module.exports = {
  getDecisiones,
  createDecision,
  updateDecision,
  toggleEstado
};