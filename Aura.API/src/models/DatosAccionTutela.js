const mongoose = require('mongoose');

const DatosAccionTutelaSchema = new mongoose.Schema({
  tipoIdentificacionEntidad: { type: String, required: true },
  numeroDocumentoEntidad: { type: String, required: true },
  tipoDocumentoBeneficiario: { type: String },
  numeroIdentificacionBeneficiario: { type: String },
  codigoMunicipioTutela: { type: String },
  numeroRadicacionTutela: { type: String, required: true },
  fechaRadicacionTutela: { type: Date, required: true },
  codigoDecisionPrimeraInstancia: { type: String },
  impugnacion: { type: String }, // SI / NO
  codigoDecisionSegundaInstancia: { type: String },
  incidenteDesacato: { type: String },
  indicadorActualizacionRequisito: { type: String },
  idDatosGenerales: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DatosGenerales' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('DatosAccionTutela', DatosAccionTutelaSchema);