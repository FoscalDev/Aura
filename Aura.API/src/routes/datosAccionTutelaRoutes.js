const express = require('express');
const router = express.Router();
const causaController = require('../controllers/causasJuridicasController');

// ESTA ES LA LÍNEA QUE DEBES CORREGIR (Línea 4):
const auth = require('../middlewares/auth'); 

// El resto del código para que funcione con tu lógica:
const verificarToken = auth.verificarToken ? auth.verificarToken : auth;

router.get('/', verificarToken, causaController.getCausas);
router.post('/', verificarToken, causaController.createCausa);
router.put('/:id', verificarToken, causaController.updateCausa);

module.exports = router;