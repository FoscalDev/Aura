const Peticion = require('../models/Peticion');

// Obtener todas las peticiones
exports.obtenerPeticiones = async (req, res) => {
    try {
        // Buscamos todas y ordenamos por la fecha de creación más reciente
        const peticiones = await Peticion.find().sort({ createdAt: -1 });
        res.status(200).json(peticiones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener la lista de peticiones", error: error.message });
    }
};

// Crear nueva petición
exports.crearPeticion = async (req, res) => {
    try {
        const nuevaPeticion = new Peticion(req.body);
        await nuevaPeticion.save();
        res.status(201).json(nuevaPeticion);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ mensaje: "Error: El código de la petición ya existe" });
        }
        res.status(500).json({ mensaje: "Error al registrar la petición", error: error.message });
    }
};

// Actualizar petición por ID
exports.actualizarPeticion = async (req, res) => {
    try {
        const { id } = req.params;
        const peticionActualizada = await Peticion.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!peticionActualizada) {
            return res.status(404).json({ mensaje: "Petición no encontrada" });
        }
        
        res.status(200).json(peticionActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la petición", error: error.message });
    }
};

// Cambiar el estado (Activo/Inactivo) - Esta es la que usa tu botón del Frontend
exports.toggleEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const peticion = await Peticion.findById(id);
        
        if (!peticion) {
            return res.status(404).json({ mensaje: "Petición no encontrada" });
        }

        peticion.estado = !peticion.estado;
        await peticion.save();

        res.status(200).json(peticion);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cambiar el estado", error: error.message });
    }
};

// Eliminar petición (Físico)
exports.eliminarPeticion = async (req, res) => {
    try {
        const { id } = req.params;
        const peticionEliminada = await Peticion.findByIdAndDelete(id);
        
        if (!peticionEliminada) {
            return res.status(404).json({ mensaje: "Petición no encontrada" });
        }
        
        res.status(200).json({ mensaje: "Petición eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la petición", error: error.message });
    }
};