import React, { useState, useEffect, useCallback } from 'react';
import './PretensionesPage.css';
import PretensionesDialogo from './PretensionesDialogo.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ENDPOINT = `${API_BASE_URL}/admin/pretensionestutelamodulo`;
const DOWNLOAD_URL = `${API_BASE_URL}/admin/exportar-tutelas-txt`;
const PAGE_SIZE = 5;

const PretensionesPage = () => {
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
  const [isDownloading, setIsDownloading] = useState(false); // Estado para el botón de descarga

  /* ================= OBTENER DATOS DEL BACKEND ================= */
  const fetchDatos = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('aura_token');
      if (!token) return;

      const response = await fetch(ENDPOINT, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const sorted = Array.isArray(data) 
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
          : [];
        setRecords(sorted);
        setFilteredRecords(sorted); 
      }
    } catch (error) {
      console.error("Error cargando pretensiones:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  /* ================= LÓGICA DE DESCARGA ================= */
  const handleDownloadTxt = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem('aura_token');
      
      const response = await fetch(DOWNLOAD_URL, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) throw new Error("Error al descargar el archivo");

      // Convertir la respuesta a un archivo (Blob)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Crear un link temporal y simular click
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'IVC170TIDS.txt'); // Nombre sugerido del archivo
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error en descarga:", error);
      alert("No se pudo descargar el archivo.");
    } finally {
      setIsDownloading(false);
    }
  };

  /* ================= LÓGICA DE FILTRADO DINÁMICO ================= */
  useEffect(() => {
    setLoadingTable(true);
    const timeoutId = setTimeout(() => {
      let result = [...records];

      if (filtroTexto) {
        const search = filtroTexto.toLowerCase();
        result = result.filter(r => 
          r.numeroIdentificacionBeneficiario?.toString().toLowerCase().includes(search) ||
          r.numeroRadicacionTutela?.toLowerCase().includes(search) ||
          r.codigoPretension?.toLowerCase().includes(search)
        );
      }

      if (fechaInicio) {
        const fi = new Date(fechaInicio);
        result = result.filter(r => r.createdAt && new Date(r.createdAt) >= fi);
      }

      if (fechaFin) {
        const ff = new Date(fechaFin);
        ff.setHours(23, 59, 59);
        result = result.filter(r => r.createdAt && new Date(r.createdAt) <= ff);
      }

      setFilteredRecords(result);
      setCurrentPage(1); 
      setLoadingTable(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filtroTexto, fechaInicio, fechaFin, records]);

  /* ================= CONTROL DE PAGINACIÓN ================= */
  useEffect(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setVisibleRecords(filteredRecords.slice(start, end));
  }, [currentPage, filteredRecords]);

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);

  /* ================= GUARDAR / EDITAR ================= */
  const handleGuardar = async (payload) => {
    const token = localStorage.getItem('aura_token');
    const url = editando ? `${ENDPOINT}/${editando._id}` : ENDPOINT;
    
    try {
      const response = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchDatos();
        setIsModalOpen(false);
        setEditando(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al guardar:", error);
      return false;
    }
  };

  return (
    <div className="mui-container">
      <header className="mui-header-flex">
        <div className="title-group">
          <h1 className="mui-title">Pretensiones</h1>
          <p className="mui-subtitle">Gestión de pretensiones de tutelas, FOSCAL 2026</p>
        </div>
        
        {/* GRUPO DE BOTONES ALINEADOS */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="mui-btn-primary" 
            style={{ backgroundColor: '#217346' }} // Color tipo Excel para el botón de TXT/Datos
            onClick={handleDownloadTxt}
            disabled={isDownloading}
          >
            {isDownloading ? 'Generando...' : '↓ Descargar TXT'}
          </button>
          
          <button className="mui-btn-primary" onClick={() => { setEditando(null); setIsModalOpen(true); }}>
            + Nueva Pretensión
          </button>
        </div>
      </header>

      {/* Resto del código se mantiene igual... */}
      <div className="acta-toolbar">
        <input
          className="acta-search-input"
          placeholder="Buscar por Radicado, Pretensión o Beneficiario..."
          value={filtroTexto}
          onChange={e => setFiltroTexto(e.target.value)}
        />
        <div className="acta-date-group">
          <input type="date" className="acta-date-input" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
          <span className="date-separator">a</span>
          <input type="date" className="acta-date-input" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
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
            ? `Mostrando ${visibleRecords.length} de ${filteredRecords.length} registros` 
            : "No se encontraron registros."}
        </div>

        <div className="mui-card-body">
          {(isLoading || loadingTable) ? (
            <div className="orion-table-loader">
              <div className="orion-spinner" />
              <span>Sincronizando Aura...</span>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Acciones</th>
                      <th>Radicado Tutela</th>
                      <th>ID Beneficiario</th>
                      <th>Cód. Pretensión</th>
                      <th>Indicador Act.</th>
                      <th>Fecha Creación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRecords.length > 0 ? (
                      visibleRecords.map(item => (
                        <tr key={item._id}>
                          <td>
                            <button 
                                className="orion-eye-btn" 
                                title="Editar"
                                onClick={() => { setEditando(item); setIsModalOpen(true); }} 
                            />
                          </td>
                          <td className="font-bold">{item.numeroRadicacionTutela || 'N/A'}</td>
                          <td>{item.numeroIdentificacionBeneficiario || 'N/A'}</td>
                          <td>{item.codigoPretension || 'N/A'}</td>
                          <td>
                            <span className={`badge ${item.indicadorActualizacionRegistro === 'S' ? 'bg-success' : 'bg-secondary'}`}>
                              {item.indicadorActualizacionRegistro === 'S' ? 'SÍ' : 'NO'}
                            </span>
                          </td>
                          <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="table-empty-msg">
                          No hay registros de pretensiones encontrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="orion-pagination">
                  <button 
                    className="orion-page-btn" 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Anterior
                  </button>
                  
                  <div className="page-numbers" style={{ display: 'flex', gap: '5px' }}>
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
        <PretensionesDialogo 
          isOpen={isModalOpen} 
          onClose={() => {setIsModalOpen(false); setEditando(null);}} 
          onGuardar={handleGuardar} 
          dataParaEditar={editando} 
        />
      )}
    </div>
  );
};

export default PretensionesPage;