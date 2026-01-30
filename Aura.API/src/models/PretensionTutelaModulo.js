const mongoose = require('mongoose');

const PretensionTutelaModuloSchema = new mongoose.Schema(
  {
    tipoIdentificacionEntidad: {
      type: String,
      required: true,
      trim: true
    },
    numeroIdentificacionEntidad: {
      type: String,
      required: true,
      trim: true
    },
    tipoDocumentoBeneficiario: {
      type: String,
      required: true,
      trim: true
    },
    numeroIdentificacionBeneficiario: {
      type: String,
      required: true,
      trim: true
    },
    numeroRadicacionTutela: {
      type: String,
      required: true,
      trim: true
    },
    codigoProblemaJuridico: {
      type: String,
      required: true,
      trim: true
    },
    codigoCausaAccionTutela: {
      type: String,
      required: true,
      trim: true
    },
    codigoPretension: {
      type: String,
      required: true,
      trim: true
    },
    indicadorActualizacionRegistro: {
      type: String,
      enum: ['S', 'N', ''],
      default: ''
    }
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model(
  'PretensionTutelaModulo',
  PretensionTutelaModuloSchema
);
