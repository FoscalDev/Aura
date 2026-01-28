import React, { useState, useEffect } from 'react';
import './OrganizacionDialogo.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ENDPOINT_TIPOS = `${API_BASE_URL}/admin/tipo-identificacion`;

const OrganizacionDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    tipoIdentificacion: '',
    numeroIdentificacion: '',
    codigoHabilitacion: ''
  });
  
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
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
      fetchTipos(); 
    }
  }, [isOpen, dataParaEditar]);

  const fetchTipos = async () => {
    try {
      const token = localStorage.getItem('aura_token');
      const response = await fetch(ENDPOINT_TIPOS, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTiposIdentificacion(Array.isArray(data) ? data.filter(t => t.estado !== false) : []);
      }
    } catch (error) {
      console.error("Error cargando tipos maestros:", error);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tipoIdentificacion) {
      alert("Por favor seleccione un tipo de identificación");
      return;
    }

    setGuardando(true);
    try {
      const datosAEnviar = {
        codigo: formData.codigo.trim().toUpperCase(),
        nombre: formData.nombre.trim(),
        tipoIdentificacion: formData.tipoIdentificacion,
        numeroIdentificacion: formData.numeroIdentificacion.trim(),
        codigoHabilitacion: formData.codigoHabilitacion?.trim() || ''
      };

      await onGuardar(datosAEnviar);
    } catch (error) {
      console.error("Error al guardar organización:", error);
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
              <label>Código</label>
              <input 
                name="codigo" 
                value={formData.codigo} 
                onChange={handleChange} 
                required 
                className="aura-input" 
                autoComplete="off"
              />
            </div>
            
            <div className="input-group">
              <label>Nombre</label>
              <input 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
                className="aura-input" 
                autoComplete="off"
              />
            </div>
            
            <div className="input-group">
              <label>Tipo Identificación</label>
              <select 
                name="tipoIdentificacion" 
                value={formData.tipoIdentificacion} 
                onChange={handleChange} 
                required 
                className="aura-input"
              >
                <option value="">Seleccione...</option>
                {tiposIdentificacion.map((tipo) => (
                  <option key={tipo._id} value={tipo.nombre}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <label>Número Identificación</label>
              <input 
                name="numeroIdentificacion" 
                value={formData.numeroIdentificacion} 
                onChange={handleChange} 
                required 
                className="aura-input" 
                autoComplete="off"
              />
            </div>
            
            <div className="input-group full-width">
              <label>Código de Habilitación</label>
              <input 
                name="codigoHabilitacion" 
                value={formData.codigoHabilitacion} 
                onChange={handleChange} 
                className="aura-input" 
                placeholder="Opcional"
                autoComplete="off"
              />
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

export default OrganizacionDialogo;