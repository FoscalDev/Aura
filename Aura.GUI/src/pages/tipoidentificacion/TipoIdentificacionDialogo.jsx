import React, { useState, useEffect } from 'react';

const TipoIdentificacionDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [nombre, setNombre] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNombre(dataParaEditar ? dataParaEditar.nombre : '');
    }
  }, [isOpen, dataParaEditar]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    
    setGuardando(true);
    try {
      await onGuardar({ nombre: nombre.trim() });
    } finally {
      setGuardando(false);
    }
  };

  const handleClose = () => {
    setNombre('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{dataParaEditar ? 'Editar Tipo' : 'Registrar Tipo de Identificación'}</h3>
          <button type="button" className="close-x" onClick={handleClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label>Nombre</label>
            <input 
              name="nombre" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              autoFocus
              className="aura-input"
              autoComplete="off"
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

export default TipoIdentificacionDialogo;