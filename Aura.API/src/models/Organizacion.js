const mongoose = require('mongoose');

const OrganizacionSchema = new mongoose.Schema({
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
    tipoIdentificacion: {
        type: String,
        required: [true, 'El tipo de identificación es obligatorio'],
        enum: ['NIT', 'CC'] // Solo permite estos valores según tu select
    },
    numeroIdentificacion: {
        type: String,
        required: [true, 'El número de identificación es obligatorio'],
        trim: true
    },
    codigoHabilitacion: {
        type: String,
        trim: true,
        default: ''
    },
    estado: { 
        type: Boolean, 
        default: true 
    }
}, { 
    timestamps: true, 
    versionKey: false 
});

module.exports = mongoose.model('Organizacion', OrganizacionSchema);