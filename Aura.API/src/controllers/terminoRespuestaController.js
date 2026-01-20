const TerminoRespuesta = require('../models/TerminoRespuesta');

exports.getTerminos = async (req, res) => {
  try {
    const terminos = await TerminoRespuesta.find().sort({ nombre: 1 });
    res.json(terminos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener términos de respuesta" });
  }
};

exports.createTermino = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const nuevoTermino = new TerminoRespuesta({
      nombre: nombre.trim()
    });

    await nuevoTermino.save();
    res.status(201).json(nuevoTermino);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Este término ya existe" });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.updateTermino = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        message: 'El nombre del término es obligatorio'
      });
    }

    const termino = await TerminoRespuesta.findByIdAndUpdate(
      id,
      { nombre: nombre.trim() },
      { new: true }
    );

    if (!termino) {
      return res.status(404).json({
        message: 'Término no encontrado'
      });
    }

    res.json(termino);
  } catch (error) {
    console.error('Error updateTermino:', error);
    res.status(500).json({
      message: 'Error al actualizar el término'
    });
  }
};

exports.toggleEstado = async (req, res) => {
  try {
    const termino = await TerminoRespuesta.findById(req.params.id);
    if (!termino) {
      return res.status(404).json({ message: "Término no encontrado" });
    }

    termino.estado = !termino.estado;
    await termino.save();
    res.json(termino);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};
