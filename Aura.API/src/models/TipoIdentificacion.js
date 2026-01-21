const mongoose = require('mongoose');

const TipoIdentificacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    unique: true
  },
  estado: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true, 
  versionKey: false 
});

module.exports = mongoose.model('TipoIdentificacion', TipoIdentificacionSchema);