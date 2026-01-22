const express = require('express');
const router = express.Router();
const municipioController = require('../controllers/municipioController');
const auth = require('../middlewares/auth'); 

const verificarToken = auth.verificarToken || auth;

if (typeof verificarToken !== 'function') {
    console.error('❌ ERROR CRÍTICO: verificarToken no es una función en municipioRoutes');
}

if (!municipioController.getMunicipios) {
    console.error('❌ ERROR CRÍTICO: getMunicipios no existe en municipioController');
}

router.get('/', verificarToken, municipioController.getMunicipios);
router.post('/', verificarToken, municipioController.createMunicipio);
router.put('/:id', verificarToken, municipioController.updateMunicipio);
router.patch('/:id/estado', verificarToken, municipioController.toggleEstado);

module.exports = router;