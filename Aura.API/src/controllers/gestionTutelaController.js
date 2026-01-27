const GestionTutela = require('../models/GestionTutela');

exports.obtenerGestiones = async (req, res) => {
  try {
    const gestiones = await GestionTutela.find()
      .sort({ createdAt: -1 });
    
    res.json(gestiones);
  } catch (error) {
    res.status(500).json({ 
      mensaje: "Error al obtener las gestiones", 
      error: error.message 
    });
  }
};


exports.crearGestion = async (req, res) => {
  try {
    const nuevaGestion = new GestionTutela(req.body);
    const guardado = await nuevaGestion.save();
    
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ 
      mensaje: "Error al crear el registro de gestión", 
      error: error.message 
    });
  }
};

exports.actualizarGestion = async (req, res) => {
  try {
    const gestionActualizada = await GestionTutela.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );

    if (!gestionActualizada) {
      return res.status(404).json({ mensaje: "No se encontró el registro para actualizar" });
    }

    res.json(gestionActualizada);
  } catch (error) {
    res.status(400).json({ 
      mensaje: "Error al actualizar el registro", 
      error: error.message 
    });
  }
};


exports.eliminarGestion = async (req, res) => {
  try {
    const eliminado = await GestionTutela.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: "El registro no existe" });
    }
    res.json({ mensaje: "Gestión eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
  }
};