const mongoose = require('mongoose');

const AreaDestinoSchema = new mongoose.Schema({
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
  timestamps: true 
});

module.exports = mongoose.model('AreaDestino', AreaDestinoSchema);