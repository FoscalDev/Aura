const mongoose = require('mongoose');

const GestionTutelaSchema = new mongoose.Schema({
  idDatosGenerales: { 
    type: String, 
    required: true 
  },
  codigoEtnia: { 
    type: String 
  },
  codigoPoblacionEspecial: { 
    type: String 
  },
  codigoTipoAfiliado: { 
    type: String 
  },
  codigoMunicipioResidencia: { 
    type: String 
  },
  indicadorActualizacion: { 
    type: String, 
    enum: ['SI', 'NO'], 
    default: 'NO' 
  }
}, { timestamps: true });

module.exports = mongoose.model('GestionTutela', GestionTutelaSchema);