const checkRole = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: 'Usuario no autenticado o sin rol'
      });
    }

    const userRole = req.user.role.toUpperCase();
    const rolesPermitidosUpper = rolesPermitidos.map(r => r.toUpperCase());

    if (!rolesPermitidosUpper.includes(userRole)) {
      return res.status(403).json({
        message: 'Acceso denegado: permisos insuficientes'
      });
    }

    next();
  };
};

module.exports = {
  checkRole,
  admin: checkRole(['ADMIN'])
};
