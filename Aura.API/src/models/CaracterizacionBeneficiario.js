const mongoose = require('mongoose');

const CaracterizacionBeneficiarioSchema = new mongoose.Schema({
  tipoIdentificacionEntidad: { type: String, required: true },
  numeroIdentificacionEntidad: { type: String, required: true },
  tipoDocumentoBeneficiario: { type: String, required: true },
  numeroDocumentoBeneficiario: { type: String, required: true, unique: true },
  nombreBeneficiario: { type: String, required: true },
  apellidoBeneficiario: { type: String, required: true },
  codigoPaisOrigen: { type: String },
  codigoMigrante: { type: String },
  codigoRegimenAfiliado: { type: String },
  codigoHabilitacion: { type: String },
  fechaNacimiento: { 
    type: Date,
    set: (v) => v === '' ? null : v 
  },
  sexo: { type: String, enum: ['M', 'F', 'O', ''] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { 
  timestamps: true 
});


module.exports = mongoose.model('CaracterizacionBeneficiario', CaracterizacionBeneficiarioSchema);