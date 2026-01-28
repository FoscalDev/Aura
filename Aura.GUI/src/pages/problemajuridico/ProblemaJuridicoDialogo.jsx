import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ProblemaJuridicoDialogo.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= COMPONENTE BUSCADOR DINÁMICO ================= */
const SearchableSelect = ({ label, options = [], value, onChange, name, placeholder = "Buscar...", required = false, fieldToStore = "nombre" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return options.filter((opt) => {
      const text = `${opt.codigo || ""} ${opt.nombre || ""} ${opt.descripcion || ""} ${opt._id || ""}`.toLowerCase();
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
          <ul className="searchable-results" style={{ position: 'absolute', zIndex: 100, width: '100%', background: 'white', border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto', listStyle: 'none', padding: 0, margin: 0 }}>
            <li 
              onMouseDown={() => { onChange({ target: { name, value: "" } }); setSearchTerm(""); }} 
              style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#666' }}
            >
              -- Seleccione --
            </li>
            {filteredOptions.map((opt, index) => {
              const valorAGuardar = fieldToStore === 'id' ? opt._id : (opt[fieldToStore] || opt.codigo || opt.nombre);
              const textoMostrar = `${opt.codigo ? opt.codigo + ' - ' : ''}${opt.nombre || opt.descripcion || opt._id}`;

              return (
                <li 
                  key={opt._id || `opt-${index}`}
                  onMouseDown={() => {
                    onChange({ target: { name, value: valorAGuardar } });
                    setSearchTerm(valorAGuardar);
                    setIsOpen(false);
                  }}
                  style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9' }}
                >
                  {textoMostrar}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ================= COMPONENTE PRINCIPAL ================= */
const ProblemaJuridicoDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [formData, setFormData] = useState({ 
    indicadorActualizacionRegistro: 'NO',
    indicadorActualizacionRequisitos: 'NO' 
  });
  
  const [catalogos, setCatalogos] = useState({
    tiposId: [], fuentes: [], causasDemora: [], descDemora: [], datosGrales: [], codProblemas: []
  });
  
  const [status, setStatus] = useState('idle');

  const cargarCatalogos = useCallback(async () => {
    const token = localStorage.getItem('aura_token');
    if (!token) return;

    const endpoints = [
      'tipo-identificacion', 'fuente-financiacion', 'causa-demora', 
      'descripcion-causa-demora', 'datos-generales', 'codigo-problema-juridico'
    ];

    try {
      const responses = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE_URL}/admin/${ep}`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }).then(r => r.json()))
      );
      
      setCatalogos({
        tiposId: Array.isArray(responses[0]) ? responses[0] : [],
        fuentes: Array.isArray(responses[1]) ? responses[1] : [],
        causasDemora: Array.isArray(responses[2]) ? responses[2] : [],
        descDemora: Array.isArray(responses[3]) ? responses[3] : [],
        datosGrales: Array.isArray(responses[4]) ? responses[4] : [],
        codProblemas: Array.isArray(responses[5]) ? responses[5] : []
      });
    } catch {
      // Manejo silencioso
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    if (isOpen) {
      const inicializar = async () => {
        if (!isMounted) return;
        await cargarCatalogos();
        
        setFormData(dataParaEditar ? { ...dataParaEditar } : { 
          indicadorActualizacionRegistro: 'NO',
          indicadorActualizacionRequisitos: 'NO'
        });
        setStatus('idle');
      };
      inicializar();
    }

    return () => { isMounted = false; };
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
      setTimeout(onClose, 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={status === 'idle' ? onClose : null}>
      <div className="modal-content" style={{ maxWidth: '1000px' }} onClick={(e) => e.stopPropagation()}>
        
        {status !== 'idle' && (
          <div className={`status-overlay ${status}`}>
            <div className="status-content">
              {status === 'loading' && <div className="spinner"></div>}
              {status === 'success' && (
                <div className="success-wrapper">
                  <div className="success-circle"><div className="checkmark-draw"></div></div>
                  <p>Información Guardada</p>
                </div>
              )}
              {status === 'error' && (
                <div className="error-wrapper">
                  <div className="error-circle">×</div>
                  <p>Error al Guardar</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="modal-header">
          <div>
            <h3>{dataParaEditar ? 'Editar' : 'Nuevo'} Problema Jurídico</h3>
            <p className="modal-subtitle-top">FOSCAL 2026 - Gestión de Tutelas</p>
          </div>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-wrapper">
          <div className="form-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            
            <div className="input-group">
              <label>No. Radicación Tutela <span style={{ color: 'red' }}>*</span></label>
              <input 
                name="numeroRadicacionTutela" 
                value={formData.numeroRadicacionTutela || ''} 
                onChange={handleChange} 
                placeholder="Ingrese radicado"
                required 
              />
            </div>

            <SearchableSelect label="Tipo Identificación" name="tipoIdentificacion" options={catalogos.tiposId} value={formData.tipoIdentificacion} onChange={handleChange} fieldToStore="nombre" required />
            
            <div className="input-group">
              <label>No. Identificación Entidad</label>
              <input name="numeroIdentificacionEntidad" value={formData.numeroIdentificacionEntidad || ''} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Tipo Doc Beneficiario</label>
              <input name="tipoDocumentoBeneficiario" value={formData.tipoDocumentoBeneficiario || ''} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>No. ID Beneficiario</label>
              <input name="numeroIdentificacionBeneficiario" value={formData.numeroIdentificacionBeneficiario || ''} onChange={handleChange} />
            </div>

            <SearchableSelect label="Cód. Problema Jurídico" name="codigoProblemaJuridico" options={catalogos.codProblemas} value={formData.codigoProblemaJuridico} onChange={handleChange} fieldToStore="codigo" required />

            <SearchableSelect label="Fuente Financiación" name="codigoFuenteFinanciacion" options={catalogos.fuentes} value={formData.codigoFuenteFinanciacion} onChange={handleChange} fieldToStore="codigo" />

            <SearchableSelect label="Causa Demora" name="codigoCausaDemora" options={catalogos.causasDemora} value={formData.codigoCausaDemora} onChange={handleChange} fieldToStore="codigo" />

            <SearchableSelect label="Desc. Causa Demora" name="codigoDescripcionCausaDemora" options={catalogos.descDemora} value={formData.codigoDescripcionCausaDemora} onChange={handleChange} fieldToStore="codigo" />

            <SearchableSelect label="ID Datos Generales" name="idDatosGenerales" options={catalogos.datosGrales} value={formData.idDatosGenerales} onChange={handleChange} fieldToStore="id" />

            <div className="input-group">
              <label>Diagnóstico Principal</label>
              <input name="diagnosticoPrincipal" value={formData.diagnosticoPrincipal || ''} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Otro Diagnóstico</label>
              <input name="otroDiagnosticoRelacionado" value={formData.otroDiagnosticoRelacionado || ''} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Diagnóstico Enfermedad</label>
              <input name="diagnosticoEnfermedad" value={formData.diagnosticoEnfermedad || ''} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Actualización Requisitos</label>
              <select name="indicadorActualizacionRequisitos" value={formData.indicadorActualizacionRequisitos} onChange={handleChange}>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>

            <div className="input-group">
              <label>Actualización Registro</label>
              <select name="indicadorActualizacionRegistro" value={formData.indicadorActualizacionRegistro} onChange={handleChange}>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
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

export default ProblemaJuridicoDialogo;