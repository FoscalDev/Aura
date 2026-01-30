import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './CausasJuridicasDialogo.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= COMPONENTE BUSCADOR (SearchableSelect) ================= */
const SearchableSelect = ({ label, options = [], value, onChange, name, placeholder = "Buscar...", required = false, fieldToStore = "text" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return options.filter((opt) => {
      const text = `${opt.nombre || ""} ${opt.codigo || ""} ${opt.descripcion || ""} ${opt._id || ""}`.toLowerCase();
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
          value={isOpen ? searchTerm : (value || "")}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => { setIsOpen(true); setSearchTerm(""); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          autoComplete="off"
          required={required && !value}
        />
        {isOpen && (
          <ul className="searchable-results" style={{ position: 'absolute', zIndex: 100, width: '100%', background: 'white', border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
            <li onMouseDown={() => { onChange({ target: { name, value: "" } }); setSearchTerm(""); }} style={{ padding: '8px', cursor: 'pointer' }}>
              -- Seleccione --
            </li>
            {filteredOptions.map((opt, index) => {
              let valorParaGuardar;
              if (fieldToStore === "id") valorParaGuardar = opt._id;
              else if (fieldToStore === "codigo") valorParaGuardar = opt.codigo;
              else valorParaGuardar = opt.nombre || opt.descripcion;

              return (
                <li 
                  key={opt._id || `opt-${name}-${index}`}
                  onMouseDown={() => {
                    onChange({ target: { name, value: valorParaGuardar } });
                    setSearchTerm(valorParaGuardar);
                    setIsOpen(false);
                  }}
                  style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                >
                  {opt.codigo ? `[${opt.codigo}] ` : ""}{opt.nombre || opt.descripcion || opt._id}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ================= COMPONENTE PRINCIPAL DIÁLOGO ================= */
const CausasJuridicasDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [formData, setFormData] = useState({});
  const [catalogos, setCatalogos] = useState({
    tiposId: [],
    problemasJuridicos: [],
    causasAccion: [],
    datosGrales: []
  });
  const [status, setStatus] = useState('idle');

  const cargarCatalogos = useCallback(async () => {
    const token = localStorage.getItem('aura_token');
    if (!token) return;
    try {
      const endpoints = [
        'tipo-identificacion',           // Para Tipo ID Entidad y Beneficiario
        'codigo-problema-juridico',      // Para Cód. Problema Jurídico
        'codigo-causa-accion-tutela',    // Para Causa Acción
        'datos-generales'                // Para ID Datos Generales
      ];
      
      const responses = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE_URL}/admin/${ep}`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }).then(res => res.json()))
      );
      
      setCatalogos({
        tiposId: Array.isArray(responses[0]) ? responses[0] : [],
        problemasJuridicos: Array.isArray(responses[1]) ? responses[1] : [],
        causasAccion: Array.isArray(responses[2]) ? responses[2] : [],
        datosGrales: Array.isArray(responses[3]) ? responses[3] : []
      });
    } catch (error) {
      console.error("Error al cargar catálogos:", error);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const inicializar = async () => {
      setStatus('idle');
      await cargarCatalogos();
      
      if (dataParaEditar && Object.keys(dataParaEditar).length > 0) {
        setFormData({ ...dataParaEditar });
      } else {
        setFormData({ 
          indicadorActualizacionRegistro: '', // Campo vacío por defecto como solicitaste
          tipoIdentificacionEntidad: '',
          numeroIdentificacionEntidad: '',
          tipoDocumentoBeneficiario: '',
          numeroIdentificacionBeneficiario: '',
          numeroRadicacionTutela: '',
          codigoProblemaJuridico: '',
          codigoCausaAccionTutela: '',
          idDatosGenerales: ''
        });
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
    try {
      await onGuardar(formData);
      setStatus('success');
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error("Error al guardar causa:", err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={status === 'idle' ? onClose : null}>
      <div className="modal-content" style={{ maxWidth: '900px' }} onClick={e => e.stopPropagation()}>
        
        {status !== 'idle' && (
          <div className={`status-overlay ${status}`}>
            <div className="status-content">
              {status === 'loading' && <div className="spinner"></div>}
              {status === 'success' && <p>✅ Registro Guardado</p>}
              {status === 'error' && <p>❌ Error al Procesar</p>}
            </div>
          </div>
        )}

        <div className="modal-header">
          <div>
            <h3>{dataParaEditar ? 'Editar Causa Jurídica' : 'Nueva Causa Jurídica'}</h3>
            <p className="modal-subtitle-top">Administración de Maestros 2026</p>
          </div>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-wrapper">
          <div className="form-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            
            <SearchableSelect 
              label="Tipo ID Entidad" 
              name="tipoIdentificacionEntidad" 
              options={catalogos.tiposId} 
              value={formData.tipoIdentificacionEntidad} 
              onChange={handleChange} 
              fieldToStore="nombre"
              required 
            />

            <div className="input-group">
              <label>No. ID Entidad</label>
              <input 
                name="numeroIdentificacionEntidad" 
                value={formData.numeroIdentificacionEntidad || ''} 
                onChange={handleChange} 
                required 
              />
            </div>

            <SearchableSelect 
              label="Tipo Doc Beneficiario" 
              name="tipoDocumentoBeneficiario" 
              options={catalogos.tiposId} 
              value={formData.tipoDocumentoBeneficiario} 
              onChange={handleChange} 
              fieldToStore="nombre"
            />

            <div className="input-group">
              <label>No. ID Beneficiario</label>
              <input 
                name="numeroIdentificacionBeneficiario" 
                value={formData.numeroIdentificacionBeneficiario || ''} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label>No. Radicación Tutela</label>
              <input 
                name="numeroRadicacionTutela" 
                value={formData.numeroRadicacionTutela || ''} 
                onChange={handleChange} 
                required 
              />
            </div>

            <SearchableSelect 
              label="Cód. Problema Jurídico" 
              name="codigoProblemaJuridico" 
              options={catalogos.problemasJuridicos} 
              value={formData.codigoProblemaJuridico} 
              onChange={handleChange} 
              fieldToStore="codigo"
            />

            <SearchableSelect 
              label="Cód. Causa Acción" 
              name="codigoCausaAccionTutela" 
              options={catalogos.causasAccion} 
              value={formData.codigoCausaAccionTutela} 
              onChange={handleChange} 
              fieldToStore="codigo"
            />

            <SearchableSelect 
              label="ID Datos Generales" 
              name="idDatosGenerales" 
              options={catalogos.datosGrales} 
              value={formData.idDatosGenerales} 
              onChange={handleChange} 
              fieldToStore="id" 
            />

            <div className="input-group">
              <label>Indicador Actualización</label>
              <input 
                name="indicadorActualizacionRegistro" 
                value={formData.indicadorActualizacionRegistro || ''} 
                onChange={handleChange} 
              />
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

export default CausasJuridicasDialogo;