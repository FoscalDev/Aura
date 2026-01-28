import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './DatosGeneralesDialogo.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= COMPONENTE BUSCADOR PARA TEXTO (NO ID) ================= */
const SearchableSelect = ({ label, options = [], value, onChange, name, placeholder = "Buscar...", required = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // El valor ahora es directamente el texto guardado
  const filteredOptions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return options.filter((opt) => {
      const text = (opt.nombre || opt.descripcion || "").toLowerCase();
      return text.includes(term);
    });
  }, [options, searchTerm]);

  return (
    <div className="input-group">
      <label>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
      <div className="searchable-container" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder={placeholder}
          // Mostramos el valor guardado (que es el nombre) si no estamos buscando
          value={isOpen ? searchTerm : (value || "")}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm(""); 
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          autoComplete="off"
          required={required && !value}
        />
        {isOpen && (
          <ul className="searchable-results">
            <li onMouseDown={() => { onChange({ target: { name, value: "" } }); setSearchTerm(""); }}>
              -- Seleccione --
            </li>
            {filteredOptions.map((opt, index) => (
              <li 
                key={opt._id || `opt-${name}-${index}`}
                onMouseDown={() => {
                  // GUARDAMOS EL NOMBRE/DESCRIPCIÓN DIRECTO
                  const textoSeleccionado = opt.nombre || opt.descripcion;
                  onChange({ target: { name, value: textoSeleccionado } });
                  setSearchTerm(textoSeleccionado);
                  setIsOpen(false);
                }}
              >
                {opt.nombre || opt.descripcion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ================= COMPONENTE PRINCIPAL CORREGIDO ================= */
const DatosGeneralesDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [formData, setFormData] = useState({});
  const [catalogos, setCatalogos] = useState({
    juzgados: [], terminos: [], areas: [], accionados: [], peticiones: [], organizaciones: []
  });
  const [status, setStatus] = useState('idle');

  const cargarCatalogos = useCallback(async () => {
    const token = localStorage.getItem('aura_token');
    if (!token) return;
    try {
      const endpoints = ['juzgados', 'terminos-respuesta', 'areas-destino', 'accionados', 'peticion', 'organizacion'];
      const responses = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE_URL}/admin/${ep}`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }).then(r => r.json()))
      );
      
      setCatalogos({
        juzgados: Array.isArray(responses[0]) ? responses[0] : [],
        terminos: Array.isArray(responses[1]) ? responses[1] : [],
        areas: Array.isArray(responses[2]) ? responses[2] : [],
        accionados: Array.isArray(responses[3]) ? responses[3] : [],
        peticiones: Array.isArray(responses[4]) ? responses[4] : [],
        organizaciones: Array.isArray(responses[5]) ? responses[5] : []
      });
    } catch (err) { 
      console.error("Error catálogos:", err); 
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const inicializar = async () => {
      setStatus('idle');
      await cargarCatalogos();
      
      if (dataParaEditar) {
        const d = dataParaEditar;
        setFormData({
          ...d,
          // Al editar, simplemente cargamos el texto que ya viene de la DB
          fechaFallo: d.fechaFallo ? d.fechaFallo.split('T')[0] : '',
        });
      } else {
        setFormData({});
      }
    };

    inicializar();
  }, [isOpen, dataParaEditar, cargarCatalogos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const cleanedData = { ...formData };

    // Formatear fecha para el backend
    if (cleanedData.fechaFallo) {
        cleanedData.fechaFallo = new Date(cleanedData.fechaFallo).toISOString();
    }

    try {
      // Enviamos la información como texto puro
      await onGuardar(cleanedData);
      setStatus('success');
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error("Error al guardar:", err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={status === 'idle' ? onClose : null}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {status !== 'idle' && (
          <div className={`status-overlay ${status}`}>
            <div className="status-content">
              {status === 'loading' && <div className="spinner"></div>}
              {status === 'success' && (
                <div className="success-wrapper">
                  <div className="success-circle"><div className="checkmark-draw"></div></div>
                  <p>Información guardada</p>
                </div>
              )}
              {status === 'error' && (
                <div className="error-wrapper">
                  <div className="error-circle">×</div>
                  <p>Error al guardar</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="modal-header">
          <div>
            <h3>{dataParaEditar ? 'Editar Registro' : 'Nuevo Registro General'}</h3>
            <p className="modal-subtitle-top">FOSCAL 2026 - Almacenamiento de Texto</p>
          </div>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-wrapper">
          <div className="form-grid-container">
            <SearchableSelect label="Juzgado" name="juzgado" options={catalogos.juzgados} value={formData.juzgado} onChange={handleChange} required />
            <SearchableSelect label="Accionado" name="accionado" options={catalogos.accionados} value={formData.accionado} onChange={handleChange} required />
            
            <div className="input-group">
              <label>Fecha Fallo</label>
              <input type="date" name="fechaFallo" value={formData.fechaFallo || ''} onChange={handleChange} required />
            </div>

            <SearchableSelect label="Término Respuesta" name="terminoRespuesta" options={catalogos.terminos} value={formData.terminoRespuesta} onChange={handleChange} />

            <div className="input-group">
              <label>Respuesta Término</label>
              <input type="text" name="respuestaTermino" value={formData.respuestaTermino || ''} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Tipo Fallo</label>
              <input type="text" name="tipoFallo" value={formData.tipoFallo || ''} onChange={handleChange} />
            </div>

            <SearchableSelect label="Área Destino" name="areaDestino" options={catalogos.areas} value={formData.areaDestino} onChange={handleChange} />
            <SearchableSelect label="Organización" name="organizacion" options={catalogos.organizaciones} value={formData.organizacion} onChange={handleChange} />

            <div className="full-width">
              <SearchableSelect label="Petición" name="peticion" options={catalogos.peticiones} value={formData.peticion} onChange={handleChange} />
            </div>

            <div className="input-group full-width">
              <label>Fallo</label>
              <input type="text" name="fallo" value={formData.fallo || ''} onChange={handleChange} />
            </div>

            <div className="input-group full-width">
              <label>COMENTARIOS / OBSERVACIONES</label>
              <textarea name="comentarios" value={formData.comentarios || ''} onChange={handleChange} rows="3"></textarea>
            </div>
          </div>

           <div className="modal-actions">
            <button type="submit" className="btn-primary" title="Guardar">
              {status === 'loading' ? '...' : '💾'}
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

export default DatosGeneralesDialogo;