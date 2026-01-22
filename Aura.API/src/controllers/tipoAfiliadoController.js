const TipoAfiliado = require('../models/TipoAfiliado');

const getTipos = async (req, res) => {
    try {
        const tipos = await TipoAfiliado.find().sort({ createdAt: -1 });
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener tipos" });
    }
};

const createTipo = async (req, res) => {
    try {
        const nuevoTipo = new TipoAfiliado(req.body);
        await nuevoTipo.save();
        res.status(201).json(nuevoTipo);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear" });
    }
};

const updateTipo = async (req, res) => {
    try {
        const actualizado = await TipoAfiliado.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar" });
    }
};

const toggleEstado = async (req, res) => {
    try {
        const tipo = await TipoAfiliado.findById(req.params.id);
        tipo.estado = !tipo.estado;
        await tipo.save();
        res.json(tipo);
    } catch (error) {
        res.status(400).json({ mensaje: "Error estado" });
    }
};

module.exports = {
    getTipos,
    createTipo,
    updateTipo,
    toggleEstado
};