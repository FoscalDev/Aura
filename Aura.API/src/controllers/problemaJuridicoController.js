const ProblemaJuridico = require('../models/ProblemaJuridico');

exports.getProblemas = async (req, res) => {
  try {
    const registros = await ProblemaJuridico.find().sort({ createdAt: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener registros", error: error.message });
  }
};

exports.createProblema = async (req, res) => {
  try {
    const nuevo = new ProblemaJuridico(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: "Error al crear", error: error.message });
  }
};

exports.updateProblema = async (req, res) => {
  try {
    const actualizado = await ProblemaJuridico.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!actualizado) return res.status(404).json({ message: "Registro no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar", error: error.message });
  }
};

exports.toggleEstado = async (req, res) => {
  try {
    const pj = await ProblemaJuridico.findById(req.params.id);
    if (!pj) return res.status(404).json({ message: "No encontrado" });

    pj.estado = pj.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    await pj.save();
    
    res.json(pj);
  } catch (error) {
    res.status(400).json({ message: "Error al cambiar estado", error: error.message });
  }
};