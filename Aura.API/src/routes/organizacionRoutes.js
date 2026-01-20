const express = require('express');
const router = express.Router();
const controller = require('../controllers/organizacionController');

router.get('/', controller.obtenerTodos);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.patch('/:id/estado', controller.toggleEstado);

module.exports = router;