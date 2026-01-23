const express = require('express');
const router = express.Router();
const controller = require('../controllers/descripcionCausaDemoraController');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, controller.getDescripciones);
router.post('/', verificarToken, controller.createDescripcion);
router.put('/:id', verificarToken, controller.updateDescripcion);
router.patch('/:id/estado', verificarToken, controller.toggleEstado);

module.exports = router;