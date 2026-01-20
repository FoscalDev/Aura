import React, { useState, useEffect } from 'react';

const TerminoRespuestaDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
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
      await onGuardar({
        nombre: nombre.trim()
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{dataParaEditar ? 'Editar Término' : 'Registrar Término'}</h3>
          <button
            type="button"
            className="close-x"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label>Descripción del Término</label>
            <input
              type="text"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="aura-input"
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={guardando}
            >
              {guardando ? 'Procesando...' : 'Confirmar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TerminoRespuestaDialogo;
