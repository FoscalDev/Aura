import React, { useState, useEffect } from 'react';
import './OrganizacionDialogo.css';
const OrganizacionDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    tipoIdentificacion: '',
    numeroIdentificacion: '',
    codigoHabilitacion: ''
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        codigo: dataParaEditar?.codigo || '',
        nombre: dataParaEditar?.nombre || '',
        tipoIdentificacion: dataParaEditar?.tipoIdentificacion || '',
        numeroIdentificacion: dataParaEditar?.numeroIdentificacion || '',
        codigoHabilitacion: dataParaEditar?.codigoHabilitacion || ''
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
        ...formData,
        codigo: formData.codigo.trim().toUpperCase()
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{dataParaEditar ? 'Editar Organización' : 'Registrar Nueva Organización'}</h3>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="input-group">
              <label>Código Interno</label>
              <input name="codigo" value={formData.codigo} onChange={handleChange} required className="aura-input" />
            </div>
            <div className="input-group">
              <label>Nombre de la Organización</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required className="aura-input" />
            </div>
            <div className="input-group">
              <label>Tipo Identificación</label>
              <select name="tipoIdentificacion" value={formData.tipoIdentificacion} onChange={handleChange} required className="aura-input">
                <option value="">Seleccione...</option>
                <option value="NIT">NIT</option>
                <option value="CC">Cédula de Ciudadanía</option>
              </select>
            </div>
            <div className="input-group">
              <label>Número Identificación</label>
              <input name="numeroIdentificacion" value={formData.numeroIdentificacion} onChange={handleChange} required className="aura-input" />
            </div>
            <div className="input-group full-width">
              <label>Código de Habilitación</label>
              <input name="codigoHabilitacion" value={formData.codigoHabilitacion} onChange={handleChange} className="aura-input" placeholder="" />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Confirmar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizacionDialogo;