const CausaJuridica = require('../models/CausaJuridica');

exports.getCausas = async (req, res) => {
    try {
        const causas = await CausaJuridica.find().sort({ createdAt: -1 });
        res.json(causas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener causas", error });
    }
};

exports.createCausa = async (req, res) => {
    try {
        const nuevaCausa = new CausaJuridica(req.body);
        const guardado = await nuevaCausa.save();
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ message: "Error al crear registro", error });
    }
};

exports.updateCausa = async (req, res) => {
    try {
        const actualizado = await CausaJuridica.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error });
    }
};