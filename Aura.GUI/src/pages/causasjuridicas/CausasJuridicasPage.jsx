import React, { useState, useEffect, useCallback } from 'react';
import './CausasJuridicasPage.css'; 
import CausasJuridicasDialogo from './CausasJuridicasDialogo.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ENDPOINT = `${API_BASE_URL}/admin/causasjuridicas`;
const DOWNLOAD_URL = `${API_BASE_URL}/admin/exportar-tutelas-txt`;
const PAGE_SIZE = 5;

const CausasJuridicasPage = () => {
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
      console.error("Error cargando causas jurídicas:", error);
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
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Error al descargar el archivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'IVC170TIDS.txt'); 
      document.body.appendChild(link);
      link.click();
      
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
        result = result.filter(r => {
          const beneficiarioId = r.numeroIdentificacionBeneficiario?.toString().toLowerCase() || "";
          const radicado = r.numeroRadicacionTutela?.toLowerCase() || "";
          const codProblema = r.codigoProblemaJuridico?.toLowerCase() || "";
          return beneficiarioId.includes(search) || radicado.includes(search) || codProblema.includes(search);
        });
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
    } catch (error) {
      console.error("Error al guardar:", error);
      return false;
    }
  };

  return (
    <div className="mui-container">
      <header className="mui-header-flex">
        <div className="title-group">
          <h1 className="mui-title">Causas Jurídicas</h1>
          <p className="mui-subtitle">Administración de causas y problemas jurídicos, FOSCAL 2026</p>
        </div>

        {/* CONTENEDOR DE BOTONES CON EL MISMO DISEÑO */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="mui-btn-primary" 
            style={{ backgroundColor: '#217346' }} 
            onClick={handleDownloadTxt}
            disabled={isDownloading}
          >
            {isDownloading ? 'Procesando...' : '↓ Descargar TXT'}
          </button>

          <button className="mui-btn-primary" onClick={() => { setEditando(null); setIsModalOpen(true); }}>
            + Nuevo Registro
          </button>
        </div>
      </header>

      {/* TOOLBAR */}
      <div className="acta-toolbar">
        <input
          className="acta-search-input"
          placeholder="Buscar por Radicado, Cód. Problema o Beneficiario..."
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
                      <th>Radicado</th>
                      <th>ID Beneficiario</th>
                      <th>Cód. Problema Jurídico</th>
                      <th>Cód. Causa Acción</th>
                      <th>Actualización</th>
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
                          <td>{item.codigoProblemaJuridico || 'N/A'}</td>
                          <td>{item.codigoCausaAccionTutela || 'N/A'}</td>
                          <td>
                            <span className={`badge ${item.indicadorActualizacionRegistro === 'S' ? 'bg-success' : 'bg-secondary'}`}>
                              {item.indicadorActualizacionRegistro === 'S' ? 'SI' : 'NO'}
                            </span>
                          </td>
                          <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="table-empty-msg">
                          No hay registros de causas jurídicas encontrados.
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
        <CausasJuridicasDialogo 
          isOpen={isModalOpen} 
          onClose={() => {setIsModalOpen(false); setEditando(null);}} 
          onGuardar={handleGuardar} 
          dataParaEditar={editando} 
        />
      )}
    </div>
  );
};

export default CausasJuridicasPage;