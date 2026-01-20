import React, { useState, useEffect } from 'react';
import './PoblacionEspecialPage.css'; 
import PoblacionEspecialDialogo from './PoblacionEspecialDialogo.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ENDPOINT = `${API_BASE_URL}/admin/poblacionespacial`;

const PoblacionEspecialPage = () => {
  const [lista, setLista] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      const token = localStorage.getItem('aura_token'); 
      const response = await fetch(ENDPOINT, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLista(data);
      }
    } catch (error) {
      console.error("Error cargando poblaciones:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleToggleEstado = async (id) => {
    const token = localStorage.getItem('aura_token');
    try {
      const response = await fetch(`${ENDPOINT}/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setLista(prev => prev.map(item => 
          item._id === id ? { ...item, estado: !item.estado } : item
        ));
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleGuardar = async (datosFormulario) => {
    const token = localStorage.getItem('aura_token');
    const url = editando ? `${ENDPOINT}/${editando._id}` : ENDPOINT;

    try {
      const response = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
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
      } else {
        const error = await response.json();
        alert(error.mensaje || "Error al procesar");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="admin-page-container">
      <header className="admin-page-header">
        <div>
          <h2 className="admin-title">Población Especial</h2>
          <p className="admin-subtitle">FOSCAL 2026</p>
        </div>
        <button className="aura-btn-add" onClick={() => { setEditando(null); setIsModalOpen(true); }}>
          + Nueva Población
        </button>
      </header>

      <div className="aura-table-container">
        {cargando ? (
          <div className="loading-spinner">Cargando registros...</div>
        ) : (
          <table className="aura-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Población</th>
                <th>Estado</th>
                <th>Última Modificación</th> {/* Dato de auditoría */}
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((item) => (
                <tr key={item._id}>
                  <td className="font-mono">{item.codigo}</td>
                  <td className="font-bold">{item.nombre}</td>
                  <td>
                    <span 
                      className={`badge-status ${item.estado ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleEstado(item._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.estado ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </td>
                  <td className="text-muted text-sm">
                    {new Date(item.updatedAt).toLocaleDateString()} {/* Auditoría */}
                  </td>
                  <td className="actions-cell text-center">
                    <button className="action-btn edit" onClick={() => { setEditando(item); setIsModalOpen(true); }}>✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <PoblacionEspecialDialogo 
        key={isModalOpen ? (editando?._id || 'nuevo') : 'closed'}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onGuardar={handleGuardar} 
        dataParaEditar={editando} 
      />
    </div>
  );
};

export default PoblacionEspecialPage;