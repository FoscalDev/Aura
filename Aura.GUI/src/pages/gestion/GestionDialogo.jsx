import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './GestionDialogo.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= COMPONENTE BUSCADOR (CORREGIDO PARA VALORES REALES) ================= */
const SearchableSelect = ({ label, options = [], value, onChange, name, placeholder = "Buscar...", required = false, isIdField = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filtro de búsqueda: Busca en todos los campos pero el usuario verá resultados simplificados
  const filteredOptions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return options.filter((opt) => {
      const text = `${opt.codigo || ""} ${opt.nombre || ""} ${opt.descripcion || ""} ${opt.numeroRadicado || ""} ${opt._id || ""}`.toLowerCase();
      return text.includes(term);
    });
  }, [options, searchTerm]);

  // Valor a mostrar en el input: 
  // Si está abierto, muestra lo que el usuario escribe.
  // Si está cerrado, muestra el valor real guardado (ID o Código).
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
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                // LÓGICA DE VALOR REAL:
                // Si es el campo de Datos Generales (isIdField), usamos el _id.
                // Para los demás maestros, usamos el campo 'codigo'.
                const valorReal = isIdField ? opt._id : (opt.codigo || opt._id);
                
                return (
                  <li 
                    key={opt._id}
                    onMouseDown={() => {
                      onChange({ target: { name, value: valorReal } });
                      setIsOpen(false);
                    }}
                  >
                    {valorReal} {opt.nombre ? `- ${opt.nombre}` : ""}
                  </li>
                );
              })
            ) : (
              <li className="no-results">No se encontraron resultados</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ================= COMPONENTE PRINCIPAL ================= */
const GestionDialogo = ({ isOpen, onClose, onGuardar, dataParaEditar }) => {
  const [formData, setFormData] = useState({ indicadorActualizacion: 'NO' });
  const [catalogos, setCatalogos] = useState({
    etnias: [], poblaciones: [], tiposAfiliado: [], municipios: [], datosGenerales: []
  });
  const [status, setStatus] = useState('idle');

  const cargarCatalogos = useCallback(async () => {
    const token = localStorage.getItem('aura_token');
    if (!token) return;

    try {
      const endpoints = ['etnia', 'poblacionespacial', 'tipo-afiliado', 'municipio', 'datos-generales'];
      const responses = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE_URL}/admin/${ep}`, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        }).then(r => r.json()))
      );

      setCatalogos({
        etnias: Array.isArray(responses[0]) ? responses[0] : [],
        poblaciones: Array.isArray(responses[1]) ? responses[1] : [],
        tiposAfiliado: Array.isArray(responses[2]) ? responses[2] : [],
        municipios: Array.isArray(responses[3]) ? responses[3] : [],
        datosGenerales: Array.isArray(responses[4]) ? responses[4] : []
      });
    } catch (err) { 
      console.error("Error cargando catálogos:", err); 
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const inicializar = async () => {
      setStatus('idle');
      await cargarCatalogos();
      
      if (dataParaEditar) {
        // Al editar, extraemos solo los valores planos (ID o Código) para evitar [object Object]
        setFormData({
          ...dataParaEditar,
          idDatosGenerales: dataParaEditar.idDatosGenerales?._id || dataParaEditar.idDatosGenerales || "",
          codigoEtnia: dataParaEditar.codigoEtnia?.codigo || dataParaEditar.codigoEtnia || "",
          codigoPoblacionEspecial: dataParaEditar.codigoPoblacionEspecial?.codigo || dataParaEditar.codigoPoblacionEspecial || "",
          codigoTipoAfiliado: dataParaEditar.codigoTipoAfiliado?.codigo || dataParaEditar.codigoTipoAfiliado || "",
          codigoMunicipioResidencia: dataParaEditar.codigoMunicipioResidencia?.codigo || dataParaEditar.codigoMunicipioResidencia || "",
        });
      } else {
        setFormData({ indicadorActualizacion: 'NO' });
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
      console.error("Error al guardar:", err);
      setStatus('error'); 
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={status === 'idle' ? onClose : null}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        {status !== 'idle' && (
          <div className={`status-overlay ${status}`}>
            <div className="status-content">
              {status === 'loading' && <div className="spinner"></div>}
              {status === 'success' && (
                <div className="success-wrapper">
                  <div className="success-circle"><div className="checkmark-draw"></div></div>
                  <p>Gestión guardada con éxito</p>
                </div>
              )}
              {status === 'error' && (
                <div className="error-wrapper">
                  <div className="error-circle">×</div>
                  <p>Error al guardar gestión</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="modal-header">
          <div>
            <h3>{dataParaEditar ? 'Editar Gestión' : 'Nueva Gestión de Tutela'}</h3>
            <p className="modal-subtitle-top">FOSCAL 2026 - Control de Información</p>
          </div>
          <button type="button" className="close-x" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-wrapper">
          <div className="form-grid-container">
            
            <SearchableSelect 
              label="ID Datos Generales" 
              name="idDatosGenerales" 
              options={catalogos.datosGenerales} 
              value={formData.idDatosGenerales}
              onChange={handleChange} 
              required 
              isIdField={true}
              placeholder="Buscar por ID..."
            />
            
            <SearchableSelect 
              label="Código Etnia" 
              name="codigoEtnia" 
              options={catalogos.etnias} 
              value={formData.codigoEtnia}
              onChange={handleChange} 
            />

            <SearchableSelect 
              label="Código Población Especial" 
              name="codigoPoblacionEspecial" 
              options={catalogos.poblaciones} 
              value={formData.codigoPoblacionEspecial}
              onChange={handleChange} 
            />

            <SearchableSelect 
              label="Código Tipo Afiliado" 
              name="codigoTipoAfiliado" 
              options={catalogos.tiposAfiliado} 
              value={formData.codigoTipoAfiliado}
              onChange={handleChange} 
            />

            <SearchableSelect 
              label="Código Municipio Residencia" 
              name="codigoMunicipioResidencia" 
              options={catalogos.municipios} 
              value={formData.codigoMunicipioResidencia}
              onChange={handleChange} 
            />

            <div className="input-group">
              <label>Indicador Actualización</label>
              <select name="indicadorActualizacion" value={formData.indicadorActualizacion} onChange={handleChange}>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={status !== 'idle'}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={status !== 'idle'}>
              {status === 'loading' ? 'Guardando...' : 'Confirmar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GestionDialogo;