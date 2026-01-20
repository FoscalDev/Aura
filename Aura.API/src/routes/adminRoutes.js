const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const auth = require('../middlewares/auth'); 
const { checkRole } = require('../middlewares/roleMiddleware'); 

// --- GESTIÓN DE USUARIOS ---
router.get('/usuarios', auth, checkRole(['ADMIN']), adminController.getUsuarios);
router.put('/usuarios/:id', auth, checkRole(['ADMIN']), adminController.updateUsuario);
router.delete('/usuarios/:id', auth, checkRole(['ADMIN']), adminController.deleteUsuario);

// --- GESTIÓN DE JUZGADOS ---
router.get('/juzgados', auth, checkRole(['ADMIN']), adminController.getJuzgados);
router.post('/juzgados', auth, checkRole(['ADMIN']), adminController.crearJuzgado);
router.put('/juzgados/:id', auth, checkRole(['ADMIN']), adminController.updateJuzgado);
router.patch('/juzgados/:id/estado', auth, checkRole(['ADMIN']), adminController.toggleEstadoJuzgado);

// --- GESTIÓN DE ACCIONADOS ---
router.get('/accionados', auth, checkRole(['ADMIN']), adminController.getAccionados);
router.post('/accionados', auth, checkRole(['ADMIN']), adminController.crearAccionado);
router.put('/accionados/:id', auth, checkRole(['ADMIN']), adminController.updateAccionado);
router.patch('/accionados/:id/estado', auth, checkRole(['ADMIN']), adminController.toggleEstadoAccionado);


module.exports = router;