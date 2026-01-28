const express = require('express');
const router = express.Router();
const controller = require('../controllers/problemaJuridicoController');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, controller.getProblemas);
router.post('/', verificarToken, controller.createProblema);
router.put('/:id', verificarToken, controller.updateProblema);
router.patch('/:id/estado', verificarToken, controller.toggleEstado);

module.exports = router;