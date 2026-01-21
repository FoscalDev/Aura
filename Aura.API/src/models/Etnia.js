const mongoose = require('mongoose');

const EtniaSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true, uppercase: true },
  nombre: { type: String, required: true },
  estado: { type: Boolean, default: true }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Etnia', EtniaSchema);