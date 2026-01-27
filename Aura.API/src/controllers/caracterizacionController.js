const Caracterizacion = require('../models/CaracterizacionBeneficiario');

exports.obtenerTodos = async (req, res) => {
  try {
    const registros = await Caracterizacion.find().sort({ createdAt: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ 
      mensaje: "Error al obtener beneficiarios", 
      error: error.message 
    });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevoRegistro = new Caracterizacion(req.body);
    await nuevoRegistro.save();
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        mensaje: "El número de documento ya existe en la base de datos" 
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        mensaje: "Error de validación: faltan campos obligatorios", 
        detalles: error.message 
      });
    }

    res.status(500).json({ 
      mensaje: "Error interno al crear el registro", 
      error: error.message 
    });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ mensaje: "No se proporcionaron datos para actualizar" });
    }

    const actualizado = await Caracterizacion.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true } 
    );

    if (!actualizado) {
      return res.status(404).json({ mensaje: "Registro no encontrado" });
    }

    res.json(actualizado);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: "El nuevo número de documento ya pertenece a otro registro" });
    }

    res.status(500).json({ 
      mensaje: "Error al actualizar el registro", 
      error: error.message 
    });
  }
};