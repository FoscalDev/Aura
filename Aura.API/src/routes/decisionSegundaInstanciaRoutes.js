const express = require('express');
const router = express.Router();
const decision2daController = require('../controllers/decisionSegundaInstanciaController');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

console.log('--- Validación de Seguridad ---');
console.log('Middleware verificarToken:', typeof verificarToken === 'function' ? 'OK (Función)' : 'ERROR (Undefined)');
console.log('Controlador getDecisiones:', typeof decision2daController.getDecisiones === 'function' ? 'OK (Función)' : 'ERROR (Undefined)');

const safeAuth = typeof verificarToken === 'function' ? verificarToken : (req, res, next) => next();

router.get('/', safeAuth, decision2daController.getDecisiones);
router.post('/', safeAuth, decision2daController.createDecision);
router.put('/:id', safeAuth, decision2daController.updateDecision);
router.patch('/:id/estado', safeAuth, decision2daController.toggleEstado);

module.exports = router;