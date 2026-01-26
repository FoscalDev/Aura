const mongoose = require('mongoose');

const DatosGeneralesSchema = new mongoose.Schema({
  juzgado: { type: String, required: true },
  accionado: { type: String, required: true },
  fechaFallo: { type: Date, required: true },
  terminoRespuesta: { type: String },
  respuestaTermino: { type: String },
  tipoFallo: { type: String },
  areaDestino: { type: String },
  organizacion: { type: String },
  peticion: { type: String },
  fallo: { type: String },
  comentarios: { type: String },
  estado: { type: Boolean, default: true }, 
}, { timestamps: true });

module.exports = mongoose.model('DatosGenerales', DatosGeneralesSchema);