const express = require('express');
const router = express.Router();
const etniaController = require('../controllers/etniaController');
const auth = require('../middlewares/auth'); 

// Si usaste destructuring { verificarToken } y en el middleware 
// exportaste con module.exports = verificarToken (sin objeto), dará error.
// Esta línea asegura que siempre tengamos la función:
const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, etniaController.getEtnias);
router.post('/', verificarToken, etniaController.createEtnia);
router.put('/:id', verificarToken, etniaController.updateEtnia);
router.patch('/:id/estado', verificarToken, etniaController.toggleEstado);

module.exports = router;