const express = require('express');
const router = express.Router();
const controller = require('../controllers/caracterizacionController');

const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, controller.obtenerTodos);
router.post('/', verificarToken, controller.crear);
router.put('/:id', verificarToken, controller.actualizar);

module.exports = router;