const express = require('express');
const router = express.Router();
const controller = require('../controllers/diagnosticoController');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, controller.getDiagnosticos);
router.post('/', verificarToken, controller.createDiagnostico);
router.put('/:id', verificarToken, controller.updateDiagnostico);
router.patch('/:id/estado', verificarToken, controller.toggleEstado);

module.exports = router;