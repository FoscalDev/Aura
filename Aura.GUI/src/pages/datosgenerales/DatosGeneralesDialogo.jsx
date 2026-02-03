import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './DatosGeneralesDialogo.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= COMPONENTE BUSCADOR DINÁMICO ================= */
const SearchableSelect = ({ label, options = [], value, onChange, name, placeholder = "Buscar...", required = false, isIdField = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return options.filter((opt) => {
      const text = `${opt.codigo || ""} ${opt.nombre || ""} ${opt.descripcion || ""} ${opt.numeroRadicado || ""} ${opt._id || ""}`.toLowerCase();
      return text.includes(term);
    });
  }, [options, searchTerm]);

  const displayValue = isOpen ? searchTerm : (value || "");

  return (
    <div className="input-group">
      <label>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
      <div className="searchable-container" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder={placeholder}
          value={displayValue}
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
              const valorReal = isIdField ? opt._id : (opt.codigo || opt.nombre || opt.descripcion);
              return (
                <li 
                  key={opt._id || `opt-${name}-${index}`}
                  onMouseDown={() => {
                    onChange({ target: { name, value: valorReal } });
                    setSearchTerm(valorReal);
                    setIsOpen(false);
                  }}
                  style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                >
                  {opt.codigo ? `[${opt.codigo}] ` : ""}{opt.nombre || opt.descripcion || opt.numeroRadicado || opt._id}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ================= COMPONENTE PRINCIPAL CONSOLIDADO ================= */
const DatosGeneralesDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [activeTab, setActiveTab] = useState('generales');
  const [formData, setFormData] = useState({ 
    indicadorActualizacion: 'NO',
    indicadorActualizacionRegistro: 'NO',
    indicadorActualizacionRequisitos: 'NO'
  });
  const [status, setStatus] = useState('idle');
  
  const [catalogos, setCatalogos] = useState({
    juzgados: [], terminos: [], areas: [], accionados: [], peticiones: [], organizaciones: [],
    paises: [], migrantes: [], regimenes: [], tiposId: [], etnias: [], poblaciones: [], 
    tiposAfiliado: [], municipios: [], datosGenerales: [], decision1: [], decision2: [],
    fuentes: [], causasDemora: [], descDemora: [], codProblemas: []
  });

  const cargarCatalogos = useCallback(async () => {
    const token = localStorage.getItem('aura_token');
    if (!token) return;
    try {
      const endpoints = [
        'juzgados', 'terminos-respuesta', 'areas-destino', 'accionados', 'peticion', 'organizacion',
        'pais', 'migrante', 'regimen-afiliacion', 'tipo-identificacion', 'etnia', 
        'poblacionespacial', 'tipo-afiliado', 'municipio', 'datos-generales',
        'decision-primera-instancia', 'decision-segunda-instancia',
        'fuente-financiacion', 'causa-demora', 'descripcion-causa-demora', 'codigo-problema-juridico'
      ];
      
      const responses = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE_URL}/admin/${ep}`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }).then(r => r.json()))
      );
      
      setCatalogos({
        juzgados: responses[0] || [], terminos: responses[1] || [], areas: responses[2] || [],
        accionados: responses[3] || [], peticiones: responses[4] || [], organizaciones: responses[5] || [],
        paises: responses[6] || [], migrantes: responses[7] || [], regimenes: responses[8] || [],
        tiposId: responses[9] || [], etnias: responses[10] || [], poblaciones: responses[11] || [],
        tiposAfiliado: responses[12] || [], municipios: responses[13] || [],
        datosGenerales: responses[14] || [], decision1: responses[15] || [], decision2: responses[16] || [],
        fuentes: responses[17] || [], causasDemora: responses[18] || [], descDemora: responses[19] || [],
        codProblemas: responses[20] || []
      });
    } catch (error) { 
      console.error("Error cargando catálogos:", error); 
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const inicializar = async () => {
      setStatus('idle');
      setActiveTab('generales');
      await cargarCatalogos();
      if (dataParaEditar) {
        setFormData({
          ...dataParaEditar,
          fechaFallo: dataParaEditar.fechaFallo ? dataParaEditar.fechaFallo.split('T')[0] : '',
          fechaNacimiento: dataParaEditar.fechaNacimiento ? dataParaEditar.fechaNacimiento.split('T')[0] : '',
          fechaRadicacionTutela: dataParaEditar.fechaRadicacionTutela ? dataParaEditar.fechaRadicacionTutela.split('T')[0] : '',
          idDatosGenerales: dataParaEditar.idDatosGenerales?._id || dataParaEditar.idDatosGenerales || "",
        });
      } else {
        setFormData({ 
            indicadorActualizacion: 'NO',
            indicadorActualizacionRegistro: 'NO',
            indicadorActualizacionRequisitos: 'NO',
            impugnacion: '',
            incidenteDesacato: '',
            numeroIdentificacionEntidad: '',
            numeroDocumentoBeneficiario: '',
            codigoHabilitacion: ''
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
    
    // Formateo de fechas para que la BD las acepte
    if (cleanedData.fechaFallo) cleanedData.fechaFallo = new Date(cleanedData.fechaFallo).toISOString();
    if (cleanedData.fechaNacimiento) cleanedData.fechaNacimiento = new Date(cleanedData.fechaNacimiento).toISOString();
    if (cleanedData.fechaRadicacionTutela) cleanedData.fechaRadicacionTutela = new Date(cleanedData.fechaRadicacionTutela).toISOString();

    try {
      await onGuardar(cleanedData);
      setStatus('success');
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Error al guardar:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={status === 'idle' ? onClose : null}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        
        {status !== 'idle' && (
          <div className={`status-overlay ${status}`}>
            <div className="status-content">
              {status === 'loading' && <div className="spinner"></div>}
              {status === 'success' && <div className="success-wrapper"><div className="success-circle"><div className="checkmark-draw"></div></div><p>Guardado con éxito</p></div>}
              {status === 'error' && <div className="error-wrapper"><div className="error-circle">×</div><p>Error al guardar</p></div>}
            </div>
          </div>
        )}

        <div className="modal-header">
          <div>
            <h3>{dataParaEditar ? 'Editar Registro' : 'Nueva Tutela'}</h3>
            <p className="modal-subtitle-top">FOSCAL 2026 - Gestión Procesos </p>
          </div>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>

        <div className="tabs-navigation">
          <button type="button" className={activeTab === 'generales' ? 'active' : ''} onClick={() => setActiveTab('generales')}>Datos Generales</button>
          <button type="button" className={activeTab === 'accion' ? 'active' : ''} onClick={() => setActiveTab('accion')}>Datos Acción Tutela</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-wrapper scrollable-tabs-body">
                   
          {/* SECCIÓN DATOS GENERALES */}
        {activeTab === 'generales' && (
            <div className="form-grid-container">
              
              <div className="full-width section-separator" style={{ gridColumn: '1 / -1', margin: '10px 0', borderBottom: '2px solid #0056b3', paddingBottom: '5px' }}>
                <h4 style={{ color: '#0056b3', margin: 0, textTransform: 'uppercase', fontSize: '1.1rem' }}>Datos Generales</h4>
              </div>
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
                <label>Comentarios</label>
                <textarea name="comentarios" value={formData.comentarios || ''} onChange={handleChange} rows="2"></textarea>
              </div>

              <div className="full-width section-separator" style={{ gridColumn: '1 / -1', margin: '20px 0 10px 0', borderBottom: '2px solid #0056b3', paddingBottom: '5px' }}>
                <h4 style={{ color: '#0056b3', margin: 0, textTransform: 'uppercase', fontSize: '1.1rem' }}>Caracterización del Beneficiario</h4>
              </div>
              <SearchableSelect label="Tipo ID Entidad" name="tipoIdentificacionEntidad" options={catalogos.tiposId} value={formData.tipoIdentificacionEntidad} onChange={handleChange}  />
              <div className="input-group">
                <label>Número ID Entidad</label>
                <input type="text" name="numeroIdentificacionEntidad" value={formData.numeroIdentificacionEntidad || ''} onChange={handleChange}  />
              </div>
              <SearchableSelect label="Tipo Doc. Beneficiario" name="tipoDocumentoBeneficiario" options={catalogos.tiposId} value={formData.tipoDocumentoBeneficiario} onChange={handleChange}  />
              <div className="input-group">
                <label>Número Doc. Beneficiario</label>
                <input type="text" name="numeroDocumentoBeneficiario" value={formData.numeroDocumentoBeneficiario || ''} onChange={handleChange}  />
              </div>
              <div className="input-group">
                <label>Nombres</label>
                <input type="text" name="nombreBeneficiario" value={formData.nombreBeneficiario || ''} onChange={handleChange}  />
              </div>
              <div className="input-group">
                <label>Apellidos</label>
                <input type="text" name="apellidoBeneficiario" value={formData.apellidoBeneficiario || ''} onChange={handleChange}/>
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
              <SearchableSelect label="ID Datos Generales" name="idDatosGenerales" options={catalogos.datosGenerales} value={formData.idDatosGenerales} onChange={handleChange} required isIdField={true} placeholder="Buscar radicado..." />
              <SearchableSelect label="Etnia" name="codigoEtnia" options={catalogos.etnias} value={formData.codigoEtnia} onChange={handleChange} />
              <SearchableSelect label="Población Especial" name="codigoPoblacionEspecial" options={catalogos.poblaciones} value={formData.codigoPoblacionEspecial} onChange={handleChange} />
              <SearchableSelect label="Tipo Afiliado" name="codigoTipoAfiliado" options={catalogos.tiposAfiliado} value={formData.codigoTipoAfiliado} onChange={handleChange} />
              <SearchableSelect label="Municipio Residencia" name="codigoMunicipioResidencia" options={catalogos.municipios} value={formData.codigoMunicipioResidencia} onChange={handleChange} />
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
          )}

{activeTab === 'accion' && (
  <div className="form-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
    
    {/* --- SECCIÓN 1: DATOS ACCIÓN Y SENTENCIA --- */}
    <div className="full-width section-separator" style={{ gridColumn: '1 / -1', margin: '10px 0', borderBottom: '2px solid #0056b3', paddingBottom: '5px' }}>
      <h4 style={{ color: '#0056b3', margin: 0, textTransform: 'uppercase', fontSize: '1.1rem' }}>Datos Acción Tutela</h4>
    </div>

    <div className="input-group">
      <label>No. Radicación <span style={{ color: 'red' }}>*</span></label>
      <input name="numeroRadicacionTutela" value={formData.numeroRadicacionTutela || ''} onChange={handleChange} placeholder="Ingrese radicado" />
    </div>
    <div className="input-group">
      <label>Fecha Radicación</label>
      <input type="date" name="fechaRadicacionTutela" value={formData.fechaRadicacionTutela || ''} onChange={handleChange}  />
    </div>
    <SearchableSelect label="Municipio Tutela" name="codigoMunicipioTutela" options={catalogos.municipios} value={formData.codigoMunicipioTutela} onChange={handleChange} />
    
    <SearchableSelect label="Tipo ID Entidad" name="tipoIdentificacionEntidad" options={catalogos.tiposId} value={formData.tipoIdentificacionEntidad} onChange={handleChange} />
    <div className="input-group">
      <label>No. Doc Entidad</label>
      <input name="numeroIdentificacionEntidad" value={formData.numeroIdentificacionEntidad || ''} onChange={handleChange} />
    </div>
    <SearchableSelect label="Tipo Doc Beneficiario" name="tipoDocumentoBeneficiario" options={catalogos.tiposId} value={formData.tipoDocumentoBeneficiario} onChange={handleChange} />
    
    <div className="input-group">
      <label>No. ID Beneficiario</label>
      <input name="numeroDocumentoBeneficiario" value={formData.numeroDocumentoBeneficiario || ''} onChange={handleChange} />
    </div>
    <SearchableSelect label="Decisión 1ra Instancia" name="codigoDecisionPrimeraInstancia" options={catalogos.decision1} value={formData.codigoDecisionPrimeraInstancia} onChange={handleChange} />
    <div className="input-group">
      <label>Impugnación</label>
      <input type="text" name="impugnacion" value={formData.impugnacion || ''} onChange={handleChange} />
    </div>

    <SearchableSelect label="Decisión 2da Instancia" name="codigoDecisionSegundaInstancia" options={catalogos.decision2} value={formData.decision2} onChange={handleChange} />
    <div className="input-group">
      <label>Incidente Desacato</label>
      <input type="text" name="incidenteDesacato" value={formData.incidenteDesacato || ''} onChange={handleChange} />
    </div>
    <div className="input-group">
      <label>Act. Requisitos</label>
      <input type="text" name="indicadorActualizacionRequisitos" value={formData.indicadorActualizacionRequisitos || ''} onChange={handleChange} placeholder="SI / NO" />
    </div>

    {/* --- SECCIÓN 2: DETALLE PROBLEMA JURÍDICO --- */}
    <div className="full-width section-separator" style={{ gridColumn: '1 / -1', margin: '20px 0 10px 0', borderBottom: '2px solid #0056b3', paddingBottom: '5px' }}>
      <h4 style={{ color: '#0056b3', margin: 0, textTransform: 'uppercase', fontSize: '1.1rem' }}>Problema Jurídico</h4>
    </div>

    <SearchableSelect label="Cód. Problema Jurídico" name="codigoProblemaJuridico" options={catalogos.codProblemas} value={formData.codigoProblemaJuridico} onChange={handleChange} />
    <SearchableSelect label="Fuente Financiación" name="codigoFuenteFinanciacion" options={catalogos.fuentes} value={formData.codigoFuenteFinanciacion} onChange={handleChange} />
    <SearchableSelect label="Causa Demora" name="codigoCausaDemora" options={catalogos.causasDemora} value={formData.codigoCausaDemora} onChange={handleChange} />
    
    <SearchableSelect label="Desc. Causa Demora" name="codigoDescripcionCausaDemora" options={catalogos.descDemora} value={formData.codigoDescripcionCausaDemora} onChange={handleChange} />
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
      <label>Act. Registro</label>
      <input type="text" name="indicadorActualizacionRegistro" value={formData.indicadorActualizacionRegistro || ''} onChange={handleChange} placeholder="SI / NO" />
    </div>
    <SearchableSelect label="ID Datos Generales" name="idDatosGenerales" options={catalogos.datosGenerales} value={formData.idDatosGenerales} onChange={handleChange} isIdField={true} />

    {/* --- SECCIÓN 3: CAUSA DE LA ACCIÓN --- */}
    <div className="full-width section-separator" style={{ gridColumn: '1 / -1', margin: '20px 0 10px 0', borderBottom: '2px solid #0056b3', paddingBottom: '5px' }}>
      <h4 style={{ color: '#0056b3', margin: 0, textTransform: 'uppercase', fontSize: '1.1rem' }}>Causa Juridica</h4>
    </div>
    {/* Nota: Se usan los mismos names para mantener el estado sincronizado entre secciones */}
    <SearchableSelect label="Municipio Tutela" name="codigoMunicipioTutela" options={catalogos.municipios || []} value={formData.codigoMunicipioTutela} onChange={handleChange} />
    <div className="input-group">
      <label>No. Radicación</label>
      <input name="numeroRadicacionTutela" value={formData.numeroRadicacionTutela || ''} onChange={handleChange}  />
    </div>
    <div className="input-group">
      <label>Fecha Radicación</label>
      <input type="date" name="fechaRadicacionTutela" value={formData.fechaRadicacionTutela || ''} onChange={handleChange} />
    </div>
    <SearchableSelect label="Decisión 1ra Instancia" name="codigoDecisionPrimeraInstancia" options={catalogos.decision1 || []} value={formData.codigoDecisionPrimeraInstancia} onChange={handleChange} />
    <div className="input-group">
      <label>Impugnación</label>
      <input name="impugnacion" value={formData.impugnacion || ''} onChange={handleChange} />
    </div>
    <SearchableSelect label="Decisión 2da Instancia" name="codigoDecisionSegundaInstancia" options={catalogos.decision2 || []} value={formData.codigoDecisionSegundaInstancia} onChange={handleChange} />
    <div className="input-group">
      <label>Incidente Desacato</label>
      <input name="incidenteDesacato" value={formData.incidenteDesacato || ''} onChange={handleChange} />
    </div>
    <div className="input-group">
      <label>Act. Requisito</label>
      <input name="indicadorActualizacionRequisitos" value={formData.indicadorActualizacionRequisitos || ''} onChange={handleChange} />
    </div>
    <SearchableSelect label="Cód. Problema Jurídico" name="codigoProblemaJuridico" options={catalogos.codProblemas} value={formData.codigoProblemaJuridico} onChange={handleChange} />
    <SearchableSelect label="Cód. Causa Acción" name="codigoCausaDemora" options={catalogos.causasDemora} value={formData.codigoCausaDemora} onChange={handleChange} />
    <SearchableSelect label="ID Datos Generales" name="idDatosGenerales" options={catalogos.datosGenerales} value={formData.idDatosGenerales} onChange={handleChange} isIdField={true} />


    {/* --- SECCIÓN 4: PRETENSIÓN --- */}
    <div className="full-width section-separator" style={{ gridColumn: '1 / -1', margin: '20px 0 10px 0', borderBottom: '2px solid #0056b3', paddingBottom: '5px' }}>
      <h4 style={{ color: '#0056b3', margin: 0, textTransform: 'uppercase', fontSize: '1.1rem' }}>Pretensión</h4>
    </div>

    <SearchableSelect label="Tipo ID Entidad" name="tipoIdentificacionEntidad" options={catalogos.tiposId} value={formData.tipoIdentificacionEntidad} onChange={handleChange}  />
    <div className="input-group">
      <label>No. ID Entidad</label>
      <input name="numeroIdentificacionEntidad" value={formData.numeroIdentificacionEntidad || ''} onChange={handleChange} />
    </div>
    <SearchableSelect label="Tipo Doc Beneficiario" name="tipoDocumentoBeneficiario" options={catalogos.tiposId} value={formData.tipoDocumentoBeneficiario} onChange={handleChange}  />
    <div className="input-group">
      <label>No. ID Beneficiario</label>
      <input name="numeroDocumentoBeneficiario" value={formData.numeroDocumentoBeneficiario || ''} onChange={handleChange}  />
    </div>
    <div className="input-group">
      <label>No. Radicación Tutela</label>
      <input name="numeroRadicacionTutela" value={formData.numeroRadicacionTutela || ''} onChange={handleChange} required />
    </div>
    <SearchableSelect label="Cód. Problema Jurídico" name="codigoProblemaJuridico" options={catalogos.codProblemas} value={formData.codigoProblemaJuridico} onChange={handleChange}  />
    <SearchableSelect label="Cód. Causa Acción" name="codigoCausaDemora" options={catalogos.causasDemora} value={formData.codigoCausaDemora} onChange={handleChange}  />
    <SearchableSelect label="Código Pretensión" name="codigoPretension" options={catalogos.peticiones} value={formData.codigoPretension} onChange={handleChange}  />

  </div>
)}
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