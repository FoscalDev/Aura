const DatosAccionTutela = require('../models/DatosAccionTutela');

exports.getAll = async (req, res) => {
  try {
    const registros = await DatosAccionTutela.find()
      .populate('idDatosGenerales') 
      .sort({ createdAt: -1 });
    res.json(registros);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos de tutela", error });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevoRegistro = new DatosAccionTutela(req.body);
    const guardado = await nuevoRegistro.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el registro", error });
  }
};

exports.update = async (req, res) => {
  try {
    const actualizado = await DatosAccionTutela.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar", error });
  }
};