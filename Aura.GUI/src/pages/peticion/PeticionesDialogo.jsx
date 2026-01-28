import React, { useState, useEffect } from 'react';

const PeticionesDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [formData, setFormData] = useState({ codigo: '', nombre: '' });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        codigo: dataParaEditar?.codigo || '',
        nombre: dataParaEditar?.nombre || ''
      });
    }
  }, [isOpen, dataParaEditar]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await onGuardar({
        codigo: formData.codigo.trim().toUpperCase(),
        nombre: formData.nombre.trim()
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{dataParaEditar ? 'Editar Petición' : 'Registrar Petición'}</h3>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label>Código de Petición</label>
            <input 
              name="codigo" 
              value={formData.codigo} 
              onChange={handleChange} 
              required 
              className="aura-input" 
            />
          </div>
          <div className="input-group">
            <label>Nombre / Descripción</label>
            <input 
              name="nombre" 
              value={formData.nombre} 
              onChange={handleChange} 
              required 
              className="aura-input" 
            />
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

export default PeticionesDialogo;