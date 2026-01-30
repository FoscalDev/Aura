const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // 🔍 Header de autorización
    const authHeader = req.headers.authorization;

    // ❌ No hay header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // 🎟️ Extraer token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token no válido' });
    }

    // 🔐 Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👤 Buscar usuario
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Usuario no válido' });
    }

    // 📌 Adjuntar usuario a la request
    req.user = user;

    next();

  } catch (error) {
    console.error('❌ AUTH ERROR:', error.message);
    return res.status(401).json({ message: 'Token inválido' });
  }
};
