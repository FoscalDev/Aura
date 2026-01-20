import React, { useState, useEffect } from 'react';
import './PeticionesPage.css'; 
import PeticionesDialogo from './PeticionesDialogo.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL;
// Coincide con app.use('/api/admin/peticion', ...) en server.js
const ENDPOINT_PETICIONES = `${API_BASE_URL}/admin/peticion`;

const PeticionesPage = () => {
  const [peticiones, setPeticiones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [peticionEditando, setPeticionEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchPeticiones();
  }, []);

  const fetchPeticiones = async () => {
    try {
      const token = localStorage.getItem('aura_token'); 
      if (!token) return console.error("No hay token en el storage");

      const response = await fetch(ENDPOINT_PETICIONES, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPeticiones(data);
      }
    } catch (error) {
      console.error("Error cargando peticiones:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleToggleEstado = async (id) => {
    const token = localStorage.getItem('aura_token');
    try {
      // Esta ruta PATCH debe estar definida en tu backend
      const response = await fetch(`${ENDPOINT_PETICIONES}/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        // Actualizamos el estado localmente para reflejar el cambio inmediato
        setPeticiones(prev => prev.map(p => 
          p._id === id ? { ...p, estado: !p.estado } : p
        ));
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleGuardar = async (datosFormulario) => {
    const token = localStorage.getItem('aura_token');
    const url = peticionEditando 
      ? `${ENDPOINT_PETICIONES}/${peticionEditando._id}` 
      : ENDPOINT_PETICIONES;

    try {
      const response = await fetch(url, {
        method: peticionEditando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosFormulario)
      });

      if (response.ok) {
        await fetchPeticiones(); // Recargamos la lista desde el servidor
        setIsModalOpen(false);
        setPeticionEditando(null);
      } else {
        const error = await response.json();
        alert(error.mensaje || "Error al guardar petición");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="admin-page-container">
      <header className="admin-page-header">
        <div>
          <h2 className="admin-title">Tipos de Petición</h2>
          <p className="admin-subtitle">FOSCAL 2026</p>
        </div>
        <button className="aura-btn-add" onClick={() => { setPeticionEditando(null); setIsModalOpen(true); }}>
          + Nueva Petición
        </button>
      </header>

      <div className="aura-table-container">
        {cargando ? (
          <div className="loading-spinner">Cargando peticiones AURA...</div>
        ) : (
          <table className="aura-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre de la Petición</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {peticiones.length > 0 ? (
                peticiones.map((p) => (
                  <tr key={p._id}>
                    <td className="font-mono text-sm">{p.codigo}</td>
                    <td className="font-bold">{p.nombre}</td>
                    <td>
                      {/* CORRECCIÓN: Usamos p.estado que viene de MongoDB */}
                      <span 
                        className={`badge-status ${p.estado ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleEstado(p._id)}
                        style={{ cursor: 'pointer' }}
                        title="Click para cambiar estado"
                      >
                        {p.estado ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td className="actions-cell text-center">
                      <button 
                        className="action-btn edit" 
                        onClick={() => { setPeticionEditando(p); setIsModalOpen(true); }}
                        title="Editar"
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No hay peticiones registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <PeticionesDialogo 
        key={isModalOpen ? (peticionEditando?._id || 'nuevo') : 'closed'}
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setPeticionEditando(null); }} 
        onGuardar={handleGuardar} 
        dataParaEditar={peticionEditando} 
      />
    </div>
  );
};

export default PeticionesPage;