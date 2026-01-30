const PretensionTutelaModulo = require('../models/PretensionTutelaModulo');


const normalizarIndicador = (valor) => {
  if (valor === 'S' || valor === 'N') return valor;
  return ''; 
};


exports.getAll = async (req, res) => {
  try {
    const registros = await PretensionTutelaModulo
      .find()
      .sort({ createdAt: -1 });

    res.json(registros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener pretensiones' });
  }
};


exports.create = async (req, res) => {
  try {
    const data = { ...req.body };

    // 🔐 Normalización segura del enum
    data.indicadorActualizacionRegistro =
      normalizarIndicador(data.indicadorActualizacionRegistro);

    const nuevo = new PretensionTutelaModulo(data);
    const saved = await nuevo.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message || 'Error al crear pretensión'
    });
  }
};


exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if ('indicadorActualizacionRegistro' in data) {
      data.indicadorActualizacionRegistro =
        normalizarIndicador(data.indicadorActualizacionRegistro);
    }

    const updated = await PretensionTutelaModulo.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message || 'Error al actualizar pretensión'
    });
  }
};


exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await PretensionTutelaModulo.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    res.json({ message: 'Registro eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar pretensión' });
  }
};
