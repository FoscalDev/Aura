import React, { useState, useEffect, useCallback } from 'react';
import './DatosGeneralesPage.css'; 
import DatosGeneralesDialogo from './DatosGeneralesDialogo.jsx';

// Configuración de URLs
const API_BASE_URL = import.meta.env.VITE_API_URL; 
const cleanBaseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;

const ENDPOINT = `${cleanBaseUrl}/admin/tutelas`; 
const DOWNLOAD_URL = `${cleanBaseUrl}/admin/exportar-tutelas-txt`;
const PAGE_SIZE = 10;

const DatosGeneralesPage = () => {
  /* ================= ESTADOS DE DATOS ================= */
  const [records, setRecords] = useState([]); 
  const [filteredRecords, setFilteredRecords] = useState([]); 
  const [visibleRecords, setVisibleRecords] = useState([]); 

  /* ================= UI & FILTROS ================= */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [filtroTexto, setFiltroTexto] = useState(""); 
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  
  /* ================= CARGA Y PAGINACIÓN ================= */
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  /* ================= FETCH DATOS (GET) ================= */
  const fetchDatos = useCallback(async () => {
    const token = localStorage.getItem('aura_token');
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await fetch(ENDPOINT, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Ordenar por fecha de creación (más recientes primero)
        const sorted = Array.isArray(data) 
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
          : [];
        setRecords(sorted);
        setFilteredRecords(sorted); 
      }
    } catch (error) {
      console.error("Error al obtener tutelas:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  /* ================= LÓGICA DE DESCARGA TXT ================= */
  const handleDownloadTxt = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem('aura_token');
      
      const response = await fetch(DOWNLOAD_URL, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Error al descargar el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'REPORTE_TUTELAS_AURA.txt'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error en descarga:", error);
      alert("No se pudo descargar el archivo.");
    } finally {
      setIsDownloading(false);
    }
  };

  /* ================= FILTRADO DINÁMICO (Texto + Fechas) ================= */
  useEffect(() => {
    setLoadingTable(true);
    const timeoutId = setTimeout(() => {
      let result = [...records];

      // Filtro por texto
      if (filtroTexto) {
        const term = filtroTexto.toLowerCase();
        result = result.filter(r => 
          r.numeroRadicacionTutela?.toLowerCase().includes(term) ||
          `${r.nombreBeneficiario} ${r.apellidoBeneficiario}`.toLowerCase().includes(term) ||
          r.juzgado?.toLowerCase().includes(term)
        );
      }

      // Filtro por rango de fechas (Fecha de Fallo)
      if (fechaInicio) {
        const fi = new Date(fechaInicio);
        result = result.filter(r => r.fechaFallo && new Date(r.fechaFallo) >= fi);
      }

      if (fechaFin) {
        const ff = new Date(fechaFin);
        ff.setHours(23, 59, 59);
        result = result.filter(r => r.fechaFallo && new Date(r.fechaFallo) <= ff);
      }

      setFilteredRecords(result);
      setCurrentPage(1);
      setLoadingTable(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filtroTexto, fechaInicio, fechaFin, records]);

  /* ================= PAGINACIÓN ================= */
  useEffect(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    setVisibleRecords(filteredRecords.slice(start, start + PAGE_SIZE));
  }, [currentPage, filteredRecords]);

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);

  /* ================= GUARDAR (POST) ================= */
  const handleGuardar = async (datosFormulario) => {
    const token = localStorage.getItem('aura_token');
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosFormulario)
      });

      if (response.ok) {
        await fetchDatos(); 
        setIsModalOpen(false);
        setEditando(null);
        return true; 
      } else {
        const err = await response.json();
        throw new Error(err.mensaje || "Error al guardar");
      }
    } catch (error) {
      alert(error.message);
      return false; 
    }
  };

  return (
    <div className="mui-container">
      <header className="mui-header-flex">
        <div className="title-group">
          <h1 className="mui-title">Módulo de Tutelas</h1>
          <p className="mui-subtitle">Gestión Integral AURA 2026</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="mui-btn-primary" 
            style={{ backgroundColor: '#217346' }} 
            onClick={handleDownloadTxt}
            disabled={isDownloading}
          >
            {isDownloading ? 'Generando...' : '↓ Exportar TXT'}
          </button>

          <button className="mui-btn-primary" onClick={() => { setEditando(null); setIsModalOpen(true); }}>
            + Nuevo Registro
          </button>
        </div>
      </header>

      {/* TOOLBAR DE BÚSQUEDA Y FECHAS */}
      <div className="acta-toolbar">
        <input
          className="acta-search-input"
          placeholder="Buscar por radicado, beneficiario o juzgado..."
          value={filtroTexto}
          onChange={e => setFiltroTexto(e.target.value)}
        />
        
        <div className="acta-date-group">
          <input
            type="date"
            className="acta-date-input"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            title="Fecha inicio fallo"
          />
          <span className="date-separator">a</span>
          <input
            type="date"
            className="acta-date-input"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            title="Fecha fin fallo"
          />
        </div>

        {(filtroTexto || fechaInicio || fechaFin) && (
          <button className="btn-clear-filters" onClick={() => { setFiltroTexto(""); setFechaInicio(""); setFechaFin(""); }}>
            Limpiar
          </button>
        )}
      </div>

      <div className="mui-card">
        <div className="mui-card-header">
          {filteredRecords.length > 0 
            ? `Mostrando ${visibleRecords.length} de ${filteredRecords.length} registros encontrados` 
            : "No se encontraron resultados"}
        </div>

        <div className="mui-card-body">
          {(isLoading || loadingTable) ? (
            <div className="orion-table-loader">
              <div className="orion-spinner" />
              <span>Sincronizando con Aura DB...</span>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Acciones</th>
                      <th>Radicado</th>
                      <th>Beneficiario</th>
                      <th>Juzgado</th>
                      <th>Fecha Fallo</th>
                      <th>Organización</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRecords.length > 0 ? (
                      visibleRecords.map(item => (
                        <tr key={item._id}>
                          <td>
                            <button 
                              className="orion-eye-btn" 
                              title="Editar registro"
                              onClick={() => { setEditando(item); setIsModalOpen(true); }} 
                            />
                          </td>
                          <td className="font-bold">{item.numeroRadicacionTutela}</td>
                          <td>{`${item.nombreBeneficiario || ''} ${item.apellidoBeneficiario || ''}`}</td>
                          <td style={{ fontSize: '0.85rem' }}>{item.juzgado}</td>
                          <td>{item.fechaFallo ? new Date(item.fechaFallo).toLocaleDateString() : '---'}</td>
                          <td>
                            <span className="badge-org">
                              {item.organizacion || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="table-empty-msg">
                          No hay tutelas que coincidan con los filtros.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINACIÓN NUMERADA */}
              {totalPages > 1 && (
                <div className="orion-pagination">
                  <button 
                    className="orion-page-btn" 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Anterior
                  </button>
                  
                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`orion-page-btn ${currentPage === i + 1 ? "active" : ""}`}
                        style={currentPage === i + 1 ? { backgroundColor: '#8DC63F', color: 'white' } : {}}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    className="orion-page-btn" 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <DatosGeneralesDialogo 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditando(null); }} 
          onGuardar={handleGuardar} 
          dataParaEditar={editando} 
        />
      )}
    </div>
  );
};

export default DatosGeneralesPage;