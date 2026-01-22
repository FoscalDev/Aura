const express = require('express');
const router = express.Router();
const controller = require('../controllers/fuenteFinanciacionController');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, controller.getFuentes);
router.post('/', verificarToken, controller.createFuente);
router.put('/:id', verificarToken, controller.updateFuente);
router.patch('/:id/estado', verificarToken, controller.toggleEstado);

module.exports = router;