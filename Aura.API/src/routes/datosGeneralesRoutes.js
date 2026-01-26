const express = require('express');
const router = express.Router();
const controller = require('../controllers/datosGeneralesController');

router.get('/', controller.obtenerTodos);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);

module.exports = router;