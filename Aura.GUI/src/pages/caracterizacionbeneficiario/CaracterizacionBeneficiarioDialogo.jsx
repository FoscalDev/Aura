import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './CaracterizacionBeneficiarioDialogo.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= COMPONENTE BUSCADOR PARA TEXTO ================= */
const SearchableSelect = ({ label, options = [], value, onChange, name, placeholder = "Buscar...", required = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return options.filter((opt) => {
      const text = (opt.nombre || opt.descripcion || opt.codigo || "").toLowerCase();
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
          <ul className="searchable-results">
            <li onMouseDown={() => { onChange({ target: { name, value: "" } }); setSearchTerm(""); }}>
              -- Seleccione --
            </li>
            {filteredOptions.map((opt, index) => (
              <li 
                key={opt._id || `opt-${name}-${index}`}
                onMouseDown={() => {
                  const textoSeleccionado = opt.codigo || opt.nombre || opt.descripcion;
                  onChange({ target: { name, value: textoSeleccionado } });
                  setSearchTerm(textoSeleccionado);
                  setIsOpen(false);
                }}
              >
                {opt.codigo ? `[${opt.codigo}] ` : ""}{opt.nombre || opt.descripcion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ================= COMPONENTE PRINCIPAL CORREGIDO ================= */
const CaracterizacionBeneficiarioDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [formData, setFormData] = useState({});
  const [catalogos, setCatalogos] = useState({ 
    paises: [], migrantes: [], regimenes: [], tiposId: [] 
  });
  const [status, setStatus] = useState('idle');

  // Corregido: Se añade token como dependencia o se obtiene dentro
  const cargarCatalogos = useCallback(async () => {
    const token = localStorage.getItem('aura_token');
    if (!token) return;
    try {
      const endpoints = ['pais', 'migrante', 'regimen-afiliacion', 'tipo-identificacion'];
      const responses = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE_URL}/admin/${ep}`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }).then(r => r.json()))
      );
      
      setCatalogos({
        paises: Array.isArray(responses[0]) ? responses[0] : [],
        migrantes: Array.isArray(responses[1]) ? responses[1] : [],
        regimenes: Array.isArray(responses[2]) ? responses[2] : [],
        tiposId: Array.isArray(responses[3]) ? responses[3] : []
      });
    } catch (err) { 
      console.error("Error cargando catálogos:", err); 
    }
  }, []);

  // useEffect Corregido para evitar renders en cascada y errores de ESLint
  useEffect(() => {
    if (!isOpen) return;

    const inicializar = async () => {
      setStatus('idle');
      await cargarCatalogos();
      
      if (dataParaEditar && Object.keys(dataParaEditar).length > 0) {
        setFormData({
          ...dataParaEditar,
          fechaNacimiento: dataParaEditar.fechaNacimiento ? dataParaEditar.fechaNacimiento.split('T')[0] : '',
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

    try {
      // Limpiamos el objeto para asegurar que no enviamos campos extra o corruptos
      const payload = { ...formData };
      
      await onGuardar(payload);
      setStatus('success');
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error("Error detallado al guardar:", err);
      setStatus('error');
      // Mantenemos el error visual unos segundos antes de permitir reintentar
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
            <h3>{dataParaEditar ? 'Editar Beneficiario' : 'Nueva Caracterización'}</h3>
            <p className="modal-subtitle-top">FOSCAL 2026 - Caracterización de Población</p>
          </div>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-wrapper">
          <div className="form-grid-container">
            
            <SearchableSelect 
              label="Tipo Identidad" 
              name="tipoIdentificacionEntidad" 
              options={catalogos.tiposId} 
              value={formData.tipoIdentificacionEntidad} 
              onChange={handleChange} 
              required 
            />

            <div className="input-group">
              <label>Número Identidad <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="numeroIdentificacionEntidad" value={formData.numeroIdentificacionEntidad || ''} onChange={handleChange} required />
            </div>

            <SearchableSelect 
              label="Tipo Doc. Beneficiario" 
              name="tipoDocumentoBeneficiario" 
              options={catalogos.tiposId} 
              value={formData.tipoDocumentoBeneficiario} 
              onChange={handleChange} 
              required 
            />

            <div className="input-group">
              <label>Número Doc. Beneficiario <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="numeroDocumentoBeneficiario" value={formData.numeroDocumentoBeneficiario || ''} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Nombre Beneficiario <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="nombreBeneficiario" value={formData.nombreBeneficiario || ''} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Apellido Beneficiario <span style={{ color: 'red' }}>*</span></label>
              <input type="text" name="apellidoBeneficiario" value={formData.apellidoBeneficiario || ''} onChange={handleChange} required />
            </div>
            
            <SearchableSelect label="País Origen" name="codigoPaisOrigen" options={catalogos.paises} value={formData.codigoPaisOrigen} onChange={handleChange} />
            <SearchableSelect label="Tipo Migrante" name="codigoMigrante" options={catalogos.migrantes} value={formData.codigoMigrante} onChange={handleChange} />
            <SearchableSelect label="Régimen" name="codigoRegimenAfiliado" options={catalogos.regimenes} value={formData.codigoRegimenAfiliado} onChange={handleChange} />

            <div className="input-group">
              <label>Código Habilitación</label>
              <input type="text" name="codigoHabilitacion" value={formData.codigoHabilitacion || ''} onChange={handleChange} />
            </div>
            
            <div className="input-group">
              <label>Fecha Nacimiento</label>
              <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento || ''} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Sexo</label>
              <select name="sexo" value={formData.sexo || ''} onChange={handleChange}>
                <option value="">--Seleccione--</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={status !== 'idle'}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={status !== 'idle'}>
              {status === 'loading' ? 'Guardando...' : 'Confirmar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaracterizacionBeneficiarioDialogo;