const express = require('express');
const router = express.Router();
const peticionesController = require('../controllers/peticionesController');

router.get('/', peticionesController.obtenerPeticiones);

router.post('/', peticionesController.crearPeticion);

router.put('/:id', peticionesController.actualizarPeticion);

router.patch('/:id/estado', peticionesController.toggleEstado);

router.delete('/:id', peticionesController.eliminarPeticion);

module.exports = router;