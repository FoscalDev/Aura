const PoblacionEspecial = require('../models/PoblacionEspecial');

exports.obtenerTodos = async (req, res) => {
    try {
        const poblaciones = await PoblacionEspecial.find().sort({ createdAt: -1 });
        res.json(poblaciones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener poblaciones' });
    }
};

exports.crear = async (req, res) => {
    try {
        const nueva = new PoblacionEspecial(req.body);
        await nueva.save();
        res.status(201).json(nueva);
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ mensaje: 'El código ya existe' });
        res.status(400).json({ mensaje: error.message });
    }
};

exports.actualizar = async (req, res) => {
    try {
        const actualizada = await PoblacionEspecial.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar' });
    }
};

exports.toggleEstado = async (req, res) => {
    try {
        const poblacion = await PoblacionEspecial.findById(req.params.id);
        poblacion.estado = !poblacion.estado;
        await poblacion.save();
        res.json(poblacion);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al cambiar estado' });
    }
};