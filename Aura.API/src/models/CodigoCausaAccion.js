const mongoose = require('mongoose');

const CodigoCausaAccionSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  codigoProblemaJuridico: {
    type: String,
    required: [true, 'El código del problema jurídico es obligatorio'],
    trim: true,
    uppercase: true
  },
  estado: {
    type: Boolean,
    default: true
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('CodigoCausaAccion', CodigoCausaAccionSchema);