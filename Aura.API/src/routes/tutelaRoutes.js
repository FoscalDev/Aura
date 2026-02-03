const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const tutelaController = require('../controllers/tutelaController');

// Nota: Asegúrate de que los modelos de los catálogos existan 
// o usa un modelo genérico si las estructuras son iguales.

/* =========================================================
    RUTAS PARA EL MÓDULO DE TUTELAS
   ========================================================= */

// Crear o actualizar (POST maneja ambos casos según tu lógica del controlador)
router.post('/', tutelaController.crearOActualizarTutela);

// Listado general
router.get('/', tutelaController.obtenerTutelas);

// Detalle por ID (Útil para cargar datos en el diálogo de edición)
router.get('/:id', tutelaController.obtenerTutelaPorId);


/* =========================================================
    RUTAS PARA CATÁLOGOS (ADMIN)
    Sincronizado con: cargarCatalogos() del frontend
   ========================================================= */

router.get('/admin/:catalogo', async (req, res) => {
    const { catalogo } = req.params;
    
    try {
        /**
         * LÓGICA DINÁMICA:
         * Intentamos obtener el modelo de Mongoose que coincida con el nombre del endpoint.
         * Si tus modelos se llaman 'juzgados', 'municipio', etc., esto funcionará solo.
         */
        let Datos;
        try {
            Datos = mongoose.model(catalogo);
        } catch (e) {
            // Si el modelo no está registrado, devolvemos array vacío para no romper el frontend
            console.warn(`Modelo no encontrado para el catálogo: ${catalogo}`);
            return res.json([]);
        }

        const registros = await Datos.find().sort({ nombre: 1 }); // Ordenado alfabéticamente
        res.json(registros);
        
    } catch (error) {
        console.error(`Error al cargar catálogo ${catalogo}:`, error);
        res.status(500).json({ error: 'Error interno del servidor al cargar catálogo' });
    }
});

module.exports = router;