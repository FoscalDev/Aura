const express = require('express');
const router = express.Router();

// Controller
const pretensionesController = require('../controllers/pretensionesTutelaModulo.controller');

// Middleware (igual que los demás routes)
const auth = require('../middlewares/auth');
const verificarToken = auth.verificarToken || auth;

// Rutas
router.get('/', verificarToken, pretensionesController.getAll);
router.post('/', verificarToken, pretensionesController.create);
router.put('/:id', verificarToken, pretensionesController.update);
router.delete('/:id', verificarToken, pretensionesController.remove);

module.exports = router;
