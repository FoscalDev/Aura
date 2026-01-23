const express = require('express');
const router = express.Router();
const controller = require('../controllers/causaDemoraController');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, controller.getCausas);
router.post('/', verificarToken, controller.createCausa);
router.put('/:id', verificarToken, controller.updateCausa);
router.patch('/:id/estado', verificarToken, controller.toggleEstado);

module.exports = router;