const TipoIdentificacion = require('../models/TipoIdentificacion');

exports.getTipos = async (req, res) => {
  try {
    const tipos = await TipoIdentificacion.find().sort({ nombre: 1 });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los datos" });
  }
};

exports.crearTipo = async (req, res) => {
  try {
    const nuevo = new TipoIdentificacion(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ mensaje: error.code === 11000 ? "Ya existe este tipo" : "Error al crear" });
  }
};

exports.actualizarTipo = async (req, res) => {
  try {
    const actualizado = await TipoIdentificacion.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar" });
  }
};

exports.toggleEstado = async (req, res) => {
  try {
    const item = await TipoIdentificacion.findById(req.params.id);
    item.estado = !item.estado;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al cambiar estado" });
  }
};