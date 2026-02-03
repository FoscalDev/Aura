const Tutela = require('../models/Tutela');

/**
 * @desc    Crear o actualizar una tutela
 * @route   POST /api/admin/tutelas
 */
exports.crearOActualizarTutela = async (req, res) => {
    try {
        const data = req.body;

        // Si viene un _id, realizamos una actualización
        if (data._id) {
            const actualizada = await Tutela.findByIdAndUpdate(
                data._id, 
                { $set: data }, // Usamos $set para mayor seguridad
                { new: true, runValidators: true } // runValidators asegura que respete el esquema
            );

            if (!actualizada) {
                return res.status(404).json({ mensaje: "No se encontró la tutela para actualizar" });
            }

            return res.json(actualizada);
        }

        // Si no hay _id, creamos un registro nuevo
        const nueva = new Tutela(data);
        await nueva.save();
        res.status(201).json(nueva);

    } catch (error) {
        console.error("❌ Error en crearOActualizarTutela:", error); // Ver en consola de Node
        res.status(500).json({ 
            mensaje: "Error al guardar el registro", 
            error: error.message 
        });
    }
};

/**
 * @desc    Obtener todas las tutelas (con orden descendente por fecha de creación)
 * @route   GET /api/admin/tutelas
 */
exports.obtenerTutelas = async (req, res) => {
    try {
        // Buscamos todas las tutelas y ordenamos por las más recientes primero
        const tutelas = await Tutela.find().sort({ createdAt: -1 });
        res.json(tutelas);
    } catch (error) {
        console.error("❌ Error en obtenerTutelas:", error); // Ver en consola de Node
        res.status(500).json({ 
            mensaje: "Error al obtener el listado de tutelas",
            error: error.message 
        });
    }
};

/**
 * @desc    Obtener una tutela específica por su ID
 * @route   GET /api/admin/tutelas/:id
 */
exports.obtenerTutelaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificación básica de ID antes de consultar
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ mensaje: "ID de tutela no válido" });
        }

        const tutela = await Tutela.findById(id);
        
        if (!tutela) {
            return res.status(404).json({ mensaje: "Tutela no encontrada" });
        }
        
        res.json(tutela);
    } catch (error) {
        console.error("❌ Error en obtenerTutelaPorId:", error); // Ver en consola de Node
        res.status(500).json({ 
            mensaje: "Error al buscar la tutela",
            error: error.message
        });
    }
};