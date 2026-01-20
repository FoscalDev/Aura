const Organizacion = require('../models/Organizacion');

exports.obtenerTodos = async (req, res) => {
    try {
        const organizaciones = await Organizacion.find().sort({ createdAt: -1 });
        res.json(organizaciones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener organizaciones' });
    }
};

exports.crear = async (req, res) => {
    try {
        const nueva = new Organizacion(req.body);
        await nueva.save();
        res.status(201).json(nueva);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ mensaje: 'El código de la organización ya existe' });
        }
        res.status(400).json({ mensaje: error.message });
    }
};

exports.actualizar = async (req, res) => {
    try {
        const actualizada = await Organizacion.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!actualizada) return res.status(404).json({ mensaje: 'No encontrada' });
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar' });
    }
};

exports.toggleEstado = async (req, res) => {
    try {
        const org = await Organizacion.findById(req.params.id);
        if (!org) return res.status(404).json({ mensaje: 'No encontrada' });
        
        org.estado = !org.estado;
        await org.save();
        res.json(org);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al cambiar estado' });
    }
};