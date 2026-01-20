const User = require('../models/User');
const Juzgado = require('../models/Juzgado');
const Accionado = require('../models/Accionado');
const TerminoRespuesta = require('../models/TerminoRespuesta'); 

// --- GESTIÓN DE USUARIOS ---
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().sort({ createdAt: -1 });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { role, permisos, name } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role, permisos, name },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

// --- GESTIÓN DE JUZGADOS ---
exports.getJuzgados = async (req, res) => {
  try {
    const juzgados = await Juzgado.find().sort({ nombre: 1 });
    res.json(juzgados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener juzgados' });
  }
};

exports.crearJuzgado = async (req, res) => {
  try {
    const { nombre } = req.body;
    const existe = await Juzgado.findOne({ nombre: nombre.trim() });
    if (existe) {
      return res.status(400).json({ message: 'Este juzgado ya está registrado' });
    }
    const nuevoJuzgado = new Juzgado({
      nombre: nombre.trim(),
      estado: true
    });
    await nuevoJuzgado.save();
    res.status(201).json(nuevoJuzgado);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el juzgado' });
  }
};

exports.updateJuzgado = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const juzgado = await Juzgado.findByIdAndUpdate(
      id,
      { nombre: nombre.trim() },
      { new: true }
    );
    if (!juzgado) return res.status(404).json({ message: 'Juzgado no encontrado' });
    res.json({ message: 'Juzgado actualizado correctamente', juzgado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el juzgado' });
  }
};

exports.toggleEstadoJuzgado = async (req, res) => {
  const { id } = req.params;
  try {
    const juzgado = await Juzgado.findById(id);
    if (!juzgado) return res.status(404).json({ message: 'Juzgado no encontrado' });

    juzgado.estado = !juzgado.estado;
    await juzgado.save();

    res.json({
      message: `Juzgado ${juzgado.estado ? 'activado' : 'desactivado'} correctamente`,
      juzgado
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado del juzgado' });
  }
};

// --- GESTIÓN DE ACCIONADOS ---
exports.getAccionados = async (req, res) => {
  try {
    const accionados = await Accionado.find().sort({ nombre: 1 });
    res.json(accionados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener accionados' });
  }
};

exports.crearAccionado = async (req, res) => {
  try {
    const { codigo, nombre } = req.body;
    const existe = await Accionado.findOne({ codigo: codigo.trim().toUpperCase() });
    if (existe) return res.status(400).json({ message: 'Este código ya existe' });

    const nuevoAccionado = new Accionado({
      codigo: codigo.trim().toUpperCase(),
      nombre: nombre.trim(),
      estado: true
    });
    await nuevoAccionado.save();
    res.status(201).json(nuevoAccionado);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el accionado' });
  }
};

exports.updateAccionado = async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre } = req.body;
  try {
    const accionado = await Accionado.findByIdAndUpdate(
      id,
      { codigo: codigo.trim().toUpperCase(), nombre: nombre.trim() },
      { new: true }
    );
    if (!accionado) return res.status(404).json({ message: 'Accionado no encontrado' });
    res.json({ message: 'Accionado actualizado correctamente', accionado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el accionado' });
  }
};

exports.toggleEstadoAccionado = async (req, res) => {
  const { id } = req.params;
  try {
    const accionado = await Accionado.findById(id);
    if (!accionado) return res.status(404).json({ message: 'Accionado no encontrado' });
    accionado.estado = !accionado.estado;
    await accionado.save();
    res.json({ message: 'Estado del accionado actualizado', accionado });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado' });
  }
};

// --- GESTIÓN DE TÉRMINOS RESPUESTA (Actualizado con campo 'Nombre') ---
exports.getTerminosRespuesta = async (req, res) => {
  try {
    // Se cambia 'descripcion' por 'Nombre'
    const terminos = await TerminoRespuesta.find().sort({ Nombre: 1 });
    res.json(terminos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener términos' });
  }
};

exports.crearTerminoRespuesta = async (req, res) => {
  try {
    // Capturamos 'Nombre' desde el body enviado por el Dialogo.jsx
    const { Nombre } = req.body;
    
    if (!Nombre) {
      return res.status(400).json({ message: 'El nombre del término es requerido' });
    }

    const existe = await TerminoRespuesta.findOne({ Nombre: Nombre.trim() });
    if (existe) return res.status(400).json({ message: 'Este término ya existe' });

    const nuevoTermino = new TerminoRespuesta({
      Nombre: Nombre.trim(),
      estado: true
    });

    await nuevoTermino.save();
    res.status(201).json(nuevoTermino);
  } catch (error) {
    console.error("Error en crearTermino:", error);
    res.status(500).json({ message: 'Error al registrar el término en el servidor' });
  }
};

exports.updateTerminoRespuesta = async (req, res) => {
  const { id } = req.params;
  const { Nombre } = req.body;
  try {
    const termino = await TerminoRespuesta.findByIdAndUpdate(
      id,
      { Nombre: Nombre.trim() },
      { new: true }
    );
    if (!termino) return res.status(404).json({ message: 'Término no encontrado' });
    res.json({ message: 'Término actualizado correctamente', termino });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el término' });
  }
};

exports.toggleEstadoTermino = async (req, res) => {
  const { id } = req.params;
  try {
    const termino = await TerminoRespuesta.findById(id);
    if (!termino) return res.status(404).json({ message: 'Término no encontrado' });
    
    termino.estado = !termino.estado;
    await termino.save();
    
    res.json({ message: 'Estado del término actualizado', termino });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar el estado' });
  }
};