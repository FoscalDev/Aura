const express = require('express');
const router = express.Router();
const controller = require('../controllers/regimenAfiliacionController');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, controller.getRegimenes);
router.post('/', verificarToken, controller.createRegimen);
router.put('/:id', verificarToken, controller.updateRegimen);
router.patch('/:id/estado', verificarToken, controller.toggleEstado);

module.exports = router;