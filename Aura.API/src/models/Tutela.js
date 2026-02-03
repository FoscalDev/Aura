const mongoose = require('mongoose');

const TutelaSchema = new mongoose.Schema({
  juzgado: String,
  accionado: String,
  fechaFallo: Date,
  terminoRespuesta: String,
  respuestaTermino: String,
  tipoFallo: String,
  areaDestino: String,
  organizacion: String,
  peticion: String,
  fallo: String,
  comentarios: String,

  tipoIdentificacionEntidad: String,
  numeroIdentificacionEntidad: String,
  tipoDocumentoBeneficiario: String,
  numeroDocumentoBeneficiario: String,
  nombreBeneficiario: String,
  apellidoBeneficiario: String,
  codigoPaisOrigen: String,
  codigoMigrante: String,
  codigoRegimenAfiliado: String,
  codigoHabilitacion: String,
  fechaNacimiento: Date,
  idDatosGenerales: { type: mongoose.Schema.Types.ObjectId, ref: 'DatoGeneral' }, 
  codigoEtnia: String,
  codigoPoblacionEspecial: String,
  codigoTipoAfiliado: String,
  codigoMunicipioResidencia: String,
  sexo: { type: String, enum: ['M', 'F', 'O', ''] },

  numeroRadicacionTutela: { type: String, required: true },
  fechaRadicacionTutela: Date,
  codigoMunicipioTutela: String,
  codigoDecisionPrimeraInstancia: String,
  impugnacion: String,
  codigoDecisionSegundaInstancia: String,
  incidenteDesacato: String,
  indicadorActualizacionRequisitos: { type: String, default: 'NO' },

  codigoProblemaJuridico: String,
  codigoFuenteFinanciacion: String,
  codigoCausaDemora: String,
  codigoDescripcionCausaDemora: String,
  diagnosticoPrincipal: String,
  otroDiagnosticoRelacionado: String,
  diagnosticoEnfermedad: String,
  indicadorActualizacionRegistro: { type: String, default: 'NO' },
  codigoPretension: String,

  fechaCreacion: { type: Date, default: Date.now },
  usuarioCrea: String
}, { timestamps: true });

module.exports = mongoose.model('Tutela', TutelaSchema);