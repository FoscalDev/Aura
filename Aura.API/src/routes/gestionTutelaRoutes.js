const express = require('express');
const router = express.Router();
const controller = require('../controllers/gestionTutelaController');

const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, controller.obtenerGestiones);
router.post('/', verificarToken, controller.crearGestion);
router.put('/:id', verificarToken, controller.actualizarGestion);

module.exports = router;