const mongoose = require('mongoose');

const TerminoRespuestaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    unique: true
  },
  estado: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TerminoRespuesta', TerminoRespuestaSchema);