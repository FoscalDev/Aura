import React, { useState, useEffect } from 'react';
import './AreaDestinoPage.css'; // Importación del CSS de la página
import AreaDestinoDialogo from './AreaDestinoDialogo.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ENDPOINT_AREAS = `${API_BASE_URL}/admin/areas-destino`;

const AreaDestinoPage = () => {
  const [areas, setAreas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [areaEditando, setAreaEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const token = localStorage.getItem('aura_token');
      if (!token) return;

      const response = await fetch(ENDPOINT_AREAS, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAreas(data);
      }
    } catch (error) {
      console.error("Error cargando áreas destino:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleToggleEstado = async (id) => {
    const token = localStorage.getItem('aura_token');
    try {
      const response = await fetch(`${ENDPOINT_AREAS}/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setAreas(prev => prev.map(a => 
          a._id === id ? { ...a, estado: !a.estado } : a
        ));
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleGuardar = async (datosFormulario) => {
    const token = localStorage.getItem('aura_token');
    const url = areaEditando 
      ? `${ENDPOINT_AREAS}/${areaEditando._id}` 
      : ENDPOINT_AREAS;

    try {
      const response = await fetch(url, {
        method: areaEditando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosFormulario)
      });

      if (response.ok) {
        await fetchAreas();
        setIsModalOpen(false);
        setAreaEditando(null);
      } else {
        const error = await response.json();
        alert(error.message || "Error al procesar la solicitud");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="admin-page-container">
      <header className="admin-page-header">
        <div>
          <h2 className="admin-title">Áreas Destino</h2>
          <p className="admin-subtitle">FOSCAL 2026</p>
        </div>
        <button className="aura-btn-add" onClick={() => { setAreaEditando(null); setIsModalOpen(true); }}>
          + Nueva Área
        </button>
      </header>

      <div className="aura-table-container">
        {cargando ? (
          <div className="loading-spinner">Sincronizando con AURA...</div>
        ) : (
          <table className="aura-table">
            <thead>
              <tr>
                <th>Nombre de la Dependencia / Área</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.length > 0 ? (
                areas.map((area) => (
                  <tr key={area._id}>
                    <td className="font-bold">{area.nombre}</td>
                    <td>
                      <span 
                        className={`badge-status ${area.estado ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleEstado(area._id)}
                        style={{ cursor: 'pointer' }}
                        title="Clic para cambiar estado"
                      >
                        {area.estado ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td className="actions-cell text-center">
                      <button 
                        className="action-btn edit" 
                        onClick={() => { setAreaEditando(area); setIsModalOpen(true); }}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No hay áreas registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <AreaDestinoDialogo 
        key={isModalOpen ? (areaEditando?._id || 'nuevo') : 'closed'}
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setAreaEditando(null); }} 
        onGuardar={handleGuardar} 
        dataParaEditar={areaEditando} 
      />
    </div>
  );
};

export default AreaDestinoPage;