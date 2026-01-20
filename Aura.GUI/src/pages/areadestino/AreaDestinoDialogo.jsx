import React, { useState, useEffect } from 'react';
import './AreaDestinoDialogo.css'; // Importación del CSS del diálogo

const AreaDestinoDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [nombre, setNombre] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNombre(dataParaEditar?.nombre || '');
    }
  }, [isOpen, dataParaEditar]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setGuardando(true);
    try {
      // Enviamos el objeto con el campo 'nombre'
      await onGuardar({
        nombre: nombre.trim()
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{dataParaEditar ? 'Editar Área Destino' : 'Registrar Nueva Área'}</h3>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label>Nombre de la Dependencia</label>
            <input 
              name="nombre" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              className="aura-input" 
              autoFocus
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={guardando}>
              {guardando ? 'Procesando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AreaDestinoDialogo;