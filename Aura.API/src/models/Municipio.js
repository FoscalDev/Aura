const mongoose = require('mongoose');

const MunicipioSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  estado: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Municipio', MunicipioSchema);