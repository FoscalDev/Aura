const express = require('express');
const router = express.Router();
const migranteController = require('../controllers/migranteController');
const auth = require('../middlewares/auth');

const verificarToken = auth.verificarToken || auth;

router.get('/', verificarToken, migranteController.getMigrantes);
router.post('/', verificarToken, migranteController.createMigrante);
router.put('/:id', verificarToken, migranteController.updateMigrante);
router.patch('/:id/estado', verificarToken, migranteController.toggleEstado);

module.exports = router;