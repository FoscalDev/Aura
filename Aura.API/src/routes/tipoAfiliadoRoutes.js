const express = require('express');
const router = express.Router();
const tipoAfiliadoController = require('../controllers/tipoAfiliadoController');
const authMiddleware = require('../middlewares/auth');

const verificarToken = authMiddleware.verificarToken || authMiddleware;

router.get('/', verificarToken, tipoAfiliadoController.getTipos);
router.post('/', verificarToken, tipoAfiliadoController.createTipo);
router.put('/:id', verificarToken, tipoAfiliadoController.updateTipo);
router.patch('/:id/estado', verificarToken, tipoAfiliadoController.toggleEstado);

module.exports = router;