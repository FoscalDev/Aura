import React, { useState, useEffect } from 'react';
import './JuzgadosPage.css'; 
import JuzgadosDialogo from './JuzgadosDialogo.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ENDPOINT_JUZGADOS = `${API_BASE_URL}/admin/juzgados`;

const JuzgadosPage = () => {
  const [juzgados, setJuzgados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [juzgadoEditando, setJuzgadoEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchJuzgados();
  }, []);

  const fetchJuzgados = async () => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) return console.error("No hay token en el storage");

      const response = await fetch(ENDPOINT_JUZGADOS, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setJuzgados(data);
      }
    } catch (error) {
      console.error("Error cargando juzgados:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleToggleEstado = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${ENDPOINT_JUZGADOS}/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setJuzgados(prev => prev.map(j => 
          j._id === id ? { ...j, estado: !j.estado } : j
        ));
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleGuardar = async (datosFormulario) => {
    const token = localStorage.getItem('token');
    const url = juzgadoEditando 
      ? `${ENDPOINT_JUZGADOS}/${juzgadoEditando._id}` 
      : ENDPOINT_JUZGADOS;

    try {
      const response = await fetch(url, {
        method: juzgadoEditando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosFormulario)
      });

      if (response.ok) {
        await fetchJuzgados();
        setIsModalOpen(false);
        setJuzgadoEditando(null);
      } else {
        const error = await response.json();
        alert(error.message || "Error al guardar despacho");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="admin-page-container">
      <header className="admin-page-header">
        <div>
            <h2 className="admin-title">Juzgados</h2>
            <p className="admin-subtitle">FOSCAL 2026</p>
        </div>
        <button className="aura-btn-add" onClick={() => { setJuzgadoEditando(null); setIsModalOpen(true); }}>
          + Nuevo Juzgado
        </button>
      </header>

      <div className="aura-table-container">
        {cargando ? (
          <div className="loading-spinner">Cargando despachos AURA...</div>
        ) : (
          <table className="aura-table">
            <thead>
              <tr>
                <th>Nombre del Juzgado</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {juzgados.map((j) => (
                <tr key={j._id}>
                  <td className="font-bold">{j.nombre}</td>
                  <td>
                    <span 
                      className={`badge-status ${j.estado ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleEstado(j._id)}
                      style={{ cursor: 'pointer' }}
                      title="Click para cambiar estado"
                    >
                      {j.estado ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn edit" 
                      onClick={() => { setJuzgadoEditando(j); setIsModalOpen(true); }}
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

      <JuzgadosDialogo 
        key={isModalOpen ? (juzgadoEditando?._id || 'nuevo') : 'closed'}
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setJuzgadoEditando(null); }} 
        onGuardar={handleGuardar} 
        dataParaEditar={juzgadoEditando} 
      />
    </div>
  );
};

export default JuzgadosPage;