import React, { useState, useEffect } from 'react';
import './AccionadosPage.css'; 
import AccionadosDialogo from './AccionadosDialogo.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ENDPOINT_ACCIONADOS = `${API_BASE_URL}/admin/accionados`;

const AccionadosPage = () => {
  const [accionados, setAccionados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accionadoEditando, setAccionadoEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchAccionados();
  }, []);

  const fetchAccionados = async () => {
    try {
      const token = localStorage.getItem('aura_token'); 
      if (!token) return console.error("No hay token en el storage");

      const response = await fetch(ENDPOINT_ACCIONADOS, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccionados(data);
      }
    } catch (error) {
      console.error("Error cargando accionados:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleToggleEstado = async (id) => {
    const token = localStorage.getItem('aura_token');
    try {
      const response = await fetch(`${ENDPOINT_ACCIONADOS}/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setAccionados(prev => prev.map(a => 
          a._id === id ? { ...a, estado: !a.estado } : a
        ));
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleGuardar = async (datosFormulario) => {
    const token = localStorage.getItem('aura_token');
    const url = accionadoEditando 
      ? `${ENDPOINT_ACCIONADOS}/${accionadoEditando._id}` 
      : ENDPOINT_ACCIONADOS;

    try {
      const response = await fetch(url, {
        method: accionadoEditando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosFormulario)
      });

      if (response.ok) {
        await fetchAccionados();
        setIsModalOpen(false);
        setAccionadoEditando(null);
      } else {
        const error = await response.json();
        alert(error.message || "Error al guardar accionado");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="admin-page-container">
      <header className="admin-page-header">
        <div>
          <h2 className="admin-title">Accionados</h2>
          <p className="admin-subtitle">FOSCAL 2026</p>
        </div>
        <button className="aura-btn-add" onClick={() => { setAccionadoEditando(null); setIsModalOpen(true); }}>
          + Nuevo Accionado
        </button>
      </header>

      <div className="aura-table-container">
        {cargando ? (
          <div className="loading-spinner">Cargando accionados AURA...</div>
        ) : (
          <table className="aura-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre / Razón Social</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {accionados.map((a) => (
                <tr key={a._id}>
                  <td className="font-mono text-sm">{a.codigo}</td>
                  <td className="font-bold">{a.nombre}</td>
                  <td>
                    <span 
                      className={`badge-status ${a.estado ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleEstado(a._id)}
                      style={{ cursor: 'pointer' }}
                      title="Click para cambiar estado"
                    >
                      {a.estado ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </td>
                  <td className="actions-cell text-center">
                    <button 
                      className="action-btn edit" 
                      onClick={() => { setAccionadoEditando(a); setIsModalOpen(true); }}
                      title="Editar"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AccionadosDialogo 
        key={isModalOpen ? (accionadoEditando?._id || 'nuevo') : 'closed'}
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setAccionadoEditando(null); }} 
        onGuardar={handleGuardar} 
        dataParaEditar={accionadoEditando} 
      />
    </div>
  );
};

export default AccionadosPage;