const express = require('express');
const router = express.Router();
const controller = require('../controllers/pretensionTutelaController');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, controller.getPretensiones);
router.post('/', verificarToken, controller.createPretension);
router.put('/:id', verificarToken, controller.updatePretension);
router.patch('/:id/estado', verificarToken, controller.toggleEstado);

module.exports = router;