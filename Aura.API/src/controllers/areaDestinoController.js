const AreaDestino = require('../models/AreaDestino');

// Obtener todas las áreas
exports.getAreas = async (req, res) => {
  try {
    const areas = await AreaDestino.find().sort({ nombre: 1 });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las áreas" });
  }
};

// Crear nueva área
exports.createArea = async (req, res) => {
  try {
    const { nombre } = req.body;
    const nuevaArea = new AreaDestino({ nombre });
    await nuevaArea.save();
    res.status(201).json(nuevaArea);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Esa área ya existe" });
    }
    res.status(400).json({ message: error.message });
  }
};

// Actualizar área
exports.updateArea = async (req, res) => {
  try {
    const areaActualizada = await AreaDestino.findByIdAndUpdate(
      req.params.id,
      { nombre: req.body.nombre },
      { new: true }
    );
    res.json(areaActualizada);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar" });
  }
};

// Cambiar estado (Toggle)
exports.toggleEstado = async (req, res) => {
  try {
    const area = await AreaDestino.findById(req.params.id);
    if (!area) return res.status(404).json({ message: "No encontrada" });

    area.estado = !area.estado;
    await area.save();
    res.json(area);
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar estado" });
  }
};