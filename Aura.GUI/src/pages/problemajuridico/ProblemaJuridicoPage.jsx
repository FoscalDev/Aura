import React, { useState, useEffect, useCallback } from 'react';
import './ProblemaJuridicoPage.css'; 
import ProblemaJuridicoDialogo from './ProblemaJuridicoDialogo.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ENDPOINT = `${API_BASE_URL}/admin/problema-juridico`; 

const PAGE_SIZE = 5;

const ProblemaJuridicoPage = () => {
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
      console.error("Error cargando problemas jurídicos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  /* ================= LÓGICA DE FILTRADO DINÁMICO ================= */
  useEffect(() => {
    setLoadingTable(true);
    const timeoutId = setTimeout(() => {
      let result = [...records];

      if (filtroTexto) {
        const search = filtroTexto.toLowerCase();
        result = result.filter(r => {
          const beneficiarioId = r.numeroIdentificacionBeneficiario?.toString().toLowerCase() || "";
          const entidadId = r.numeroIdentificacionEntidad?.toString().toLowerCase() || "";
          const radicado = r.numeroRadicacionTutela?.toLowerCase() || "";
          const idInterno = r._id?.toLowerCase() || "";

          return (
            beneficiarioId.includes(search) ||
            entidadId.includes(search) ||
            radicado.includes(search) ||
            idInterno.includes(search)
          );
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
          <h1 className="mui-title">Maestro Problema Jurídico</h1>
          <p className="mui-subtitle">Gestión de diagnósticos y causas de demora 2026</p>
        </div>
        <button className="mui-btn-primary" onClick={() => { setEditando(null); setIsModalOpen(true); }}>
          + Nuevo Problema
        </button>
      </header>

      <div className="acta-toolbar">
        <input
          className="acta-search-input"
          placeholder="Buscar por ID, Radicado o Beneficiario..."
          value={filtroTexto}
          onChange={e => setFiltroTexto(e.target.value)}
        />
        <div className="acta-date-group">
          <input
            type="date"
            className="acta-date-input"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
          />
          <span className="date-separator">a</span>
          <input
            type="date"
            className="acta-date-input"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
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
            ? `Mostrando ${visibleRecords.length} de ${filteredRecords.length} registros` 
            : "No se encontraron registros."}
        </div>

        <div className="mui-card-body">
          {(isLoading || loadingTable) ? (
            <div className="orion-table-loader">
              <div className="orion-spinner" />
              <span>Sincronizando con Orion...</span>
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
                      <th>Prob. Jurídico</th>
                      <th>Diagnóstico</th>
                      <th>Actualización</th>
                      <th>Fecha</th>
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
                                onClick={() => { 
                                  setEditando(item); 
                                  setIsModalOpen(true); 
                                }} 
                            />
                          </td>
                          <td className="font-bold">
                            {item.numeroRadicacionTutela || 'N/A'}
                          </td>
                          <td>{item.numeroIdentificacionBeneficiario}</td>
                          <td>{item.codigoProblemaJuridico?.codigo || item.codigoProblemaJuridico || 'N/A'}</td>
                          <td>{item.diagnosticoPrincipal || 'Sin diagnóstico'}</td>
                          <td>
                            <span className={`badge ${item.indicadorActualizacionRegistro === 'SI' ? 'bg-success' : 'bg-secondary'}`}>
                              {item.indicadorActualizacionRegistro}
                            </span>
                          </td>
                          <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="table-empty-msg">
                          No hay problemas jurídicos registrados.
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
        <ProblemaJuridicoDialogo 
          isOpen={isModalOpen} 
          onClose={() => {setIsModalOpen(false); setEditando(null);}} 
          onGuardar={handleGuardar} 
          dataParaEditar={editando} 
        />
      )}
    </div>
  );
};

export default ProblemaJuridicoPage;