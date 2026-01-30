import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './DatosAccionTutelaDialogo.css'; 

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= COMPONENTE BUSCADOR MEJORADO ================= */
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
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm(""); 
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          autoComplete="off"
          required={required && !value}
        />
        {isOpen && (
          <ul className="searchable-results" style={{ position: 'absolute', zIndex: 100, width: '100%', background: 'white', border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
            <li onMouseDown={() => { onChange({ target: { name, value: "" } }); setSearchTerm(""); }} style={{ padding: '8px', cursor: 'pointer' }}>
              -- Seleccione --
            </li>
            {filteredOptions.map((opt, index) => (
              <li 
                key={opt._id || `opt-${name}-${index}`}
                onMouseDown={() => {
                  // Si fieldToStore es "id", guardamos el _id, si no, el código/nombre
                  const valorParaGuardar = fieldToStore === "id" ? opt._id : (opt.codigo || opt.nombre || opt.descripcion);
                  onChange({ target: { name, value: valorParaGuardar } });
                  setSearchTerm(valorParaGuardar);
                  setIsOpen(false);
                }}
                style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
              >
                {opt.codigo ? `[${opt.codigo}] ` : ""}{opt.nombre || opt.descripcion || opt._id}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ================= COMPONENTE PRINCIPAL ================= */
const DatosAccionTutelaDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [formData, setFormData] = useState({});
  const [catalogos, setCatalogos] = useState({
    tiposId: [], municipios: [], decision1: [], decision2: [], datosGrales: []
  });
  const [status, setStatus] = useState('idle');

  const cargarCatalogos = useCallback(async () => {
    const token = localStorage.getItem('aura_token');
    if (!token) return;
    try {
      const endpoints = [
        'tipo-identificacion', 'municipio', 'decision-primera-instancia',
        'decision-segunda-instancia', 'datos-generales'
      ];
      
      const responses = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE_URL}/admin/${ep}`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }).then(r => r.json()))
      );
      
      setCatalogos({
        tiposId: Array.isArray(responses[0]) ? responses[0] : [],
        municipios: Array.isArray(responses[1]) ? responses[1] : [],
        decision1: Array.isArray(responses[2]) ? responses[2] : [],
        decision2: Array.isArray(responses[3]) ? responses[3] : [],
        datosGrales: Array.isArray(responses[4]) ? responses[4] : []
      });
    } catch (err) { 
      console.error("Error catálogos Tutela:", err); 
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const inicializar = async () => {
      setStatus('idle');
      await cargarCatalogos();
      
      if (dataParaEditar) {
        setFormData({
          ...dataParaEditar,
          fechaRadicacionTutela: dataParaEditar.fechaRadicacionTutela ? dataParaEditar.fechaRadicacionTutela.split('T')[0] : '',
        });
      } else {
        setFormData({
          impugnacion: '',
          incidenteDesacato: '',
          indicadorActualizacionRequisito: ''
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

    const cleanedData = { ...formData };
    if (cleanedData.fechaRadicacionTutela) {
        cleanedData.fechaRadicacionTutela = new Date(cleanedData.fechaRadicacionTutela).toISOString();
    }

    try {
      await onGuardar(cleanedData);
      setStatus('success');
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error("Error al guardar tutela:", err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={status === 'idle' ? onClose : null}>
      <div className="modal-content" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
        
        {status !== 'idle' && (
          <div className={`status-overlay ${status}`}>
            <div className="status-content">
              {status === 'loading' && <div className="spinner"></div>}
              {status === 'success' && <p>✅ Registro Guardado</p>}
              {status === 'error' && <p>❌ Error al Guardar</p>}
            </div>
          </div>
        )}

        <div className="modal-header">
          <div>
            <h3>{dataParaEditar ? 'Editar Acción Tutela' : 'Nueva Acción Tutela'}</h3>
            <p className="modal-subtitle-top">FOSCAL 2026 - Gestión de Procesos</p>
          </div>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-wrapper">
          <div className="form-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            
            <SearchableSelect label="Tipo ID Entidad" name="tipoIdentificacionEntidad" options={catalogos.tiposId} value={formData.tipoIdentificacionEntidad} onChange={handleChange} required />
            
            <div className="input-group">
              <label>No. Doc Entidad</label>
              <input name="numeroDocumentoEntidad" value={formData.numeroDocumentoEntidad || ''} onChange={handleChange} required />
            </div>

            <SearchableSelect label="Tipo Doc Beneficiario" name="tipoDocumentoBeneficiario" options={catalogos.tiposId} value={formData.tipoDocumentoBeneficiario} onChange={handleChange} />

            <div className="input-group">
              <label>No. ID Beneficiario</label>
              <input name="numeroIdentificacionBeneficiario" value={formData.numeroIdentificacionBeneficiario || ''} onChange={handleChange} />
            </div>

            <SearchableSelect label="Municipio Tutela" name="codigoMunicipioTutela" options={catalogos.municipios} value={formData.codigoMunicipioTutela} onChange={handleChange} />

            <div className="input-group">
              <label>No. Radicación</label>
              <input name="numeroRadicacionTutela" value={formData.numeroRadicacionTutela || ''} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Fecha Radicación</label>
              <input type="date" name="fechaRadicacionTutela" value={formData.fechaRadicacionTutela || ''} onChange={handleChange} required />
            </div>

            <SearchableSelect label="Decisión 1ra Instancia" name="codigoDecisionPrimeraInstancia" options={catalogos.decision1} value={formData.codigoDecisionPrimeraInstancia} onChange={handleChange} />

            <div className="input-group">
              <label>Impugnación</label>
              <input type="text" name="impugnacion" placeholder="" value={formData.impugnacion || ''} onChange={handleChange} />
            </div>

            <SearchableSelect label="Decisión 2da Instancia" name="codigoDecisionSegundaInstancia" options={catalogos.decision2} value={formData.codigoDecisionSegundaInstancia} onChange={handleChange} />

            <div className="input-group">
              <label>Incidente Desacato</label>
              <input type="text" name="incidenteDesacato" placeholder="" value={formData.incidenteDesacato || ''} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Act. Requisito</label>
              <input type="text" name="indicadorActualizacionRequisito" placeholder="" value={formData.indicadorActualizacionRequisito || ''} onChange={handleChange} />
            </div>

            <SearchableSelect 
              label="ID Datos Generales" 
              name="idDatosGenerales" 
              options={catalogos.datosGrales} 
              value={formData.idDatosGenerales} 
              onChange={handleChange} 
              fieldToStore="id" 
            />
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

export default DatosAccionTutelaDialogo;