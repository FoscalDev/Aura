const mongoose = require('mongoose');

const CausaJuridicaSchema = new mongoose.Schema({
    tipoIdentificacionEntidad: { type: String, required: true },
    numeroIdentificacionEntidad: { type: String, required: true },
    tipoDocumentoBeneficiario: { type: String },
    numeroIdentificacionBeneficiario: { type: String },
    numeroRadicacionTutela: { type: String, required: true },
    codigoProblemaJuridico: { type: String },
    codigoCausaAccionTutela: { type: String },
    idDatosGenerales: { type: String },
    indicadorActualizacionRegistro: { type: String, default: 'N' }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('CausaJuridica', CausaJuridicaSchema);