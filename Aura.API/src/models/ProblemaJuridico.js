const mongoose = require('mongoose');

const ProblemaJuridicoSchema = new mongoose.Schema({
  numeroRadicacionTutela: { type: String, required: true },
  tipoIdentificacion: { type: String, required: true },
  numeroIdentificacionEntidad: { type: String, required: true },
  tipoDocumentoBeneficiario: String,
  numeroIdentificacionBeneficiario: String,
  codigoProblemaJuridico: { type: String, required: true },
  codigoFuenteFinanciacion: String,
  codigoCausaDemora: String,
  codigoDescripcionCausaDemora: String,
  idDatosGenerales: String,
  diagnosticoPrincipal: String,
  otroDiagnosticoRelacionado: String,
  diagnosticoEnfermedad: String,
  indicadorActualizacionRequisitos: { type: String, default: 'NO' },
  indicadorActualizacionRegistro: { type: String, default: 'NO' }
}, { timestamps: true });

module.exports = mongoose.model('ProblemaJuridico', ProblemaJuridicoSchema);