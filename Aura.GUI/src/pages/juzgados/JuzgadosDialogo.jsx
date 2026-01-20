import React, { useState } from 'react';

const JuzgadosDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [nombre, setNombre] = useState(dataParaEditar ? dataParaEditar.nombre : '');
  const [guardando, setGuardando] = useState(false);


  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    
    setGuardando(true);
    await onGuardar({ nombre: nombre.trim() });
    
    setNombre(''); 
    setGuardando(false);
  };

  const handleClose = () => {
    setNombre('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{dataParaEditar ? 'Editar Juzgado' : 'Registrar Juzgado'}</h3>
          <button type="button" className="close-x" onClick={handleClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label>Nombre del Despacho Judicial</label>
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
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={guardando}>
              {guardando ? 'Procesando...' : 'Confirmar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JuzgadosDialogo;