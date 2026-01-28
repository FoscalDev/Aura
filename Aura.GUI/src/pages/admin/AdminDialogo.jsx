import React, { useState } from 'react';
import './AdminDialogo.css';

const cleanState = {
  nombre: '',
  email: '',
  rol: 'LECTOR',
  permisos: { tutelas: false, gestionDocumental: false, auditoria: false }
};

const AdminDialogo = ({ isOpen, onClose, onGuardar, usuarioParaEditar }) => {
  // Inicialización directa y segura para evitar errores de renderizado
  const [formData, setFormData] = useState(() => {
    if (usuarioParaEditar) {
      return {
        nombre: usuarioParaEditar.name || usuarioParaEditar.nombre || '',
        email: usuarioParaEditar.email || '',
        rol: usuarioParaEditar.role || usuarioParaEditar.rol || 'LECTOR',
        permisos: usuarioParaEditar.permisos || { ...cleanState.permisos }
      };
    }
    return { ...cleanState };
  });

  const [guardando, setGuardando] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rol' && value === 'ADMIN') {
      setFormData(prev => ({
        ...prev,
        rol: value,
        permisos: { tutelas: true, gestionDocumental: true, auditoria: true }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTogglePermiso = (modulo) => {
    if (formData.rol === 'ADMIN') return;
    setFormData(prev => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [modulo]: !prev.permisos?.[modulo]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await onGuardar(formData);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{usuarioParaEditar ? 'Editar Usuario' : 'Asignar Nuevo Acceso'}</h3>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label>Nombre Completo</label>
            <input 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleChange} 
              required 
              className="aura-input"
            />
          </div>

          <div className="input-group">
            <label>Email Institucional</label>
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              disabled={!!usuarioParaEditar} 
              required 
              className="aura-input"
            />
          </div>

          <div className="input-group">
            <label>Rol de Usuario</label>
            <select name="rol" value={formData.rol} onChange={handleChange} className="aura-input">
              <option value="ADMIN">ADMIN</option>
              <option value="TECNICO">TECNICO</option>
              <option value="LECTOR">LECTOR</option>
            </select>
          </div>

          <div className="permissions-section">
            <label className="section-subtitle">Permisos de Módulos</label>
            <div className="permissions-grid">
              {Object.keys(formData.permisos).map((mod) => (
                <div 
                  key={mod} 
                  className={`perm-item ${formData.permisos[mod] ? 'active' : ''}`}
                  onClick={() => handleTogglePermiso(mod)}
                >
                  <span className="perm-info">
                    {mod === 'gestionDocumental' ? 'Gestión Doc.' : mod.toUpperCase()}
                  </span>
                  <div className={`aura-switch ${formData.permisos[mod] ? 'active' : ''}`}></div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary" title="Guardar">
              {guardando === 'loading' ? '...' : '💾'}
            </button>
            <button type="button" className="btn-secondary" title="Cerrar" onClick={onClose}>
              ✕
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDialogo;