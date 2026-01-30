const express = require('express');
const router = express.Router();
const causaController = require('../controllers/causasJuridicasController');

const auth = require('../middlewares/auth'); 

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, causaController.getCausas);
router.post('/', verificarToken, causaController.createCausa);
router.put('/:id', verificarToken, causaController.updateCausa);

module.exports = router;