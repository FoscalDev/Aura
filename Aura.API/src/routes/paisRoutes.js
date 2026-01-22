const express = require('express');
const router = express.Router();
const paisController = require('../controllers/paisController');

const { verificarToken } = require('../middlewares/auth');

const authMiddleware = verificarToken || require('../middlewares/auth');

const protectedRoute = typeof authMiddleware === 'function' ? authMiddleware : (req, res, next) => next();

if (typeof authMiddleware !== 'function') {
    console.log("⚠️ Alerta: verificarToken no se cargó correctamente, revisa src/middlewares/auth.js");
}

router.get('/', protectedRoute, paisController.getPaises);
router.post('/', protectedRoute, paisController.createPais);
router.put('/:id', protectedRoute, paisController.updatePais);
router.patch('/:id/estado', protectedRoute, paisController.toggleEstado);

module.exports = router;