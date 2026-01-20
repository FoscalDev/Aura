const mongoose = require('mongoose');

const PoblacionEspecialSchema = new mongoose.Schema({
    codigo: { 
        type: String, 
        required: [true, 'El código es obligatorio'], 
        unique: true, 
        uppercase: true,
        trim: true 
    },
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'],
        trim: true 
    },
    estado: { 
        type: Boolean, 
        default: true 
    }
}, { 
    timestamps: true, 
    versionKey: false 
});

module.exports = mongoose.model('PoblacionEspecial', PoblacionEspecialSchema);