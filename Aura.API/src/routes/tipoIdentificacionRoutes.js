const express = require('express');
const router = express.Router();
const controller = require('../controllers/tipoIdentificacionController');

router.get('/', controller.getTipos);
router.post('/', controller.crearTipo);
router.put('/:id', controller.actualizarTipo);
router.patch('/:id/estado', controller.toggleEstado);

module.exports = router;