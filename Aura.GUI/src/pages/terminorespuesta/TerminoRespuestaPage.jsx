import React, { useState, useEffect } from 'react';
import './TerminoRespuestaPage.css';
import TerminoRespuestaDialogo from './TerminoRespuestaDialogo.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const ENDPOINT_TERMINOS = `${API_BASE_URL}/admin/terminos-respuesta`;

const TerminoRespuestaPage = () => {
  const [terminos, setTerminos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [terminoEditando, setTerminoEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchTerminos();
  }, []);

  const fetchTerminos = async () => {
    try {
      const token = localStorage.getItem('aura_token');
      if (!token) {
        console.error('No hay autorización activa');
        return;
      }

      const response = await fetch(ENDPOINT_TERMINOS, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener términos');
      }

      const data = await response.json();
      setTerminos(data);
    } catch (error) {
      console.error('Error cargando términos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleToggleEstado = async (id) => {
    const token = localStorage.getItem('aura_token');
    try {
      const response = await fetch(`${ENDPOINT_TERMINOS}/${id}/estado`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTerminos((prev) =>
          prev.map((t) =>
            t._id === id ? { ...t, estado: !t.estado } : t
          )
        );
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleGuardar = async (datosFormulario) => {
    const token = localStorage.getItem('aura_token');

    const url = terminoEditando
      ? `${ENDPOINT_TERMINOS}/${terminoEditando._id}`
      : ENDPOINT_TERMINOS;

    try {
      const response = await fetch(url, {
        method: terminoEditando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosFormulario)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Error al procesar la solicitud');
        return;
      }

      await fetchTerminos();
      setIsModalOpen(false);
      setTerminoEditando(null);
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  return (
    <div className="admin-page-container">
      <header className="admin-page-header">
        <div>
          <h2 className="admin-title">Términos Respuesta</h2>
          <p className="admin-subtitle">FOSCAL 2026</p>
        </div>

        <button
          className="aura-btn-add"
          onClick={() => {
            setTerminoEditando(null);
            setIsModalOpen(true);
          }}
        >
          + Nuevo Término
        </button>
      </header>

      <div className="aura-table-container">
        {cargando ? (
          <div className="loading-spinner">
            Sincronizando con AURA...
          </div>
        ) : (
          <table className="aura-table">
            <thead>
              <tr>
                <th>Nombre del Término</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {terminos.length > 0 ? (
                terminos.map((t) => (
                  <tr key={t._id}>
                    {/* 🔥 CORREGIDO: nombre en minúscula */}
                    <td className="font-bold">{t.nombre}</td>

                    <td>
                      <span
                        className={`badge-status ${
                          t.estado ? 'active' : 'inactive'
                        }`}
                        onClick={() => handleToggleEstado(t._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {t.estado ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>

                    <td className="actions-cell text-center">
                      <button
                        className="action-btn edit"
                        onClick={() => {
                          setTerminoEditando(t);
                          setIsModalOpen(true);
                        }}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No hay términos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <TerminoRespuestaDialogo
        key={
          isModalOpen
            ? terminoEditando?._id || 'nuevo'
            : 'closed'
        }
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTerminoEditando(null);
        }}
        onGuardar={handleGuardar}
        dataParaEditar={terminoEditando}
      />
    </div>
  );
};

export default TerminoRespuestaPage;
