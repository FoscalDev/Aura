const DatosGenerales = require('../models/DatosGenerales');

exports.obtenerTodos = async (req, res) => {
  try {
    const registros = await DatosGenerales.find()
      .populate('juzgado accionado areaDestino peticion organizacion terminoRespuesta')
      .sort({ createdAt: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener registros", error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const nuevo = new DatosGenerales(req.body);
    await nuevo.save();
    const poblado = await DatosGenerales.findById(nuevo._id)
      .populate('juzgado accionado areaDestino peticion organizacion terminoRespuesta');
    res.status(201).json(poblado);
  } catch (error) {
    res.status(400).json({ message: "Error al crear", error: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const actualizado = await DatosGenerales.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('juzgado accionado areaDestino peticion organizacion terminoRespuesta');
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar", error: error.message });
  }
};