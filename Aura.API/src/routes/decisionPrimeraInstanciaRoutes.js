const express = require('express');
const router = express.Router();
const decisionController = require('../controllers/decisionPrimeraInstanciaController');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

console.log('Verificando controlador:', decisionController.getDecisiones);

router.get('/', verificarToken, decisionController.getDecisiones);
router.post('/', verificarToken, decisionController.createDecision);
router.put('/:id', verificarToken, decisionController.updateDecision);
router.patch('/:id/estado', verificarToken, decisionController.toggleEstado);

module.exports = router;