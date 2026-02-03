import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './index.css';
import Login from './auth/Login.jsx'; 
import AdminPages from './pages/admin/AdminPages.jsx';
import JuzgadosPage from './pages/juzgados/JuzgadosPage.jsx'; 
import AccionadosPage from './pages/accionado/AccionadosPage.jsx';
import TerminoRespuestaPage from './pages/terminorespuesta/TerminoRespuestaPage.jsx';
import AreaDestinoPage from './pages/areadestino/AreaDestinoPage.jsx';
import PeticionesPage from './pages/peticion/PeticionesPage.jsx';
import PoblacionEspecialPage from './pages/poblacionespecial/PoblacionEspecialPage.jsx';
import OrganizacionPage from './pages/organizacion/OrganizacionPage.jsx';
import TipoIdentificacionPage from './pages/tipoidentificacion/TipoIdentificacionPage.jsx';
import EtniaPage from './pages/etnia/EtniaPage.jsx';
import TipoAfiliadoPage from './pages/tipoafiliado/TipoAfiliadoPage.jsx';
import MunicipioPage from './pages/municipios/MunicipioPage.jsx';
import DecisionPrimeraInstanciaPage from './pages/decisionprimerainstancia/DecisionPrimeraInstanciaPage.jsx';
import PaisPage from './pages/pais/PaisPage.jsx';
import DecisionSegundaInstanciaPage from './pages/decisionsegundaInstancia/DecisionSegundaInstanciaPage.jsx';
import CodigoProblemaJuridicoPage from './pages/codigoproblemajuridico/CodigoProblemaJuridicoPage.jsx';
import MigrantePage from './pages/migrante/MigrantePage.jsx';
import FuenteFinanciacionPage from './pages/FuenteFinanciacion/FuenteFinanciacionPage.jsx';
import CausaDemoraPage from './pages/causademora/CausaDemoraPage.jsx';
import DescripcionCausaDemoraPage from './pages/descripcioncausademora/DescripcionCausaDemoraPage.jsx';
import RegimenAfiliacionPage from './pages/regimenafiliacion/RegimenAfiliacionPage.jsx';
import DiagnosticoPage from './pages/diagnostico/DiagnosticoPage.jsx';
import PretensionTutelaPage from './pages/pretensiontutela/PretensionTutelaPage.jsx';
import CodigoCausaAccionPage from './pages/codigocausaacciontutela/CodigoCausaAccionPage.jsx';
import DatosGeneralesPage from './pages/datosgenerales/DatosGeneralesPage.jsx';
import CaracterizacionBeneficiarioPage from './pages/caracterizacionbeneficiario/CaracterizacionBeneficiarioPage.jsx';
import GestionPage from './pages/gestion/GestiónPage.jsx';
import ProblemaJuridicoPage from './pages/problemajuridico/ProblemaJuridicoPage.jsx';
import DatosAccionTutelaPage from './pages/datosacciontutela/DatosAccionTutelaPage.jsx';
import CausasJuridicasPage from './pages/causasjuridicas/CausasJuridicasPage.jsx';
import PretensionesPage from './pages/pretenciones/PretensionesPage.jsx';

/* ================= CONFIG API ================= */
const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= HELPERS ================= */
const getFechaValida = (obj) =>
  obj?.createdAt ||
  obj?.fecha_radicacion ||
  obj?.fecha_creacion ||
  null;


// --- COMPONENTES AUXILIARES ---

const SessionWarning = ({ secondsRemaining, onExtend }) => {
  if (secondsRemaining === null || secondsRemaining > 60 || secondsRemaining <= 0) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)', maxWidth: '400px', width: '90%'
      }}>
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>⚠️</div>
        <h3 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '22px' }}>Su sesión va a expirar</h3>
        <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>Por seguridad, se cerrará automáticamente en:</p>
        <div style={{ 
          fontSize: '48px', fontWeight: 'bold', color: '#e74c3c', marginBottom: '30px',
          fontFamily: 'monospace' 
        }}>
          00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
        </div>
        <button 
          onClick={onExtend}
          style={{
            backgroundColor: '#1a56b8', color: 'white', border: 'none', padding: '12px 24px',
            borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600',
            transition: 'background 0.3s'
          }}
        >
          Mantener sesión iniciada
        </button>
      </div>
    </div>
  );
};

const StatisticsSection = ({ data, loading }) => {
  if (loading) return <div className="luxury-card" style={{ padding: '20px', textAlign: 'center' }}>Cargando analítica en tiempo real...</div>;
  if (!data) return null;

  const maxVal = Math.max(...data.mensual.map(m => m.total), 1);

  return (
    <div className="stats-dashboard-container" style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      <div className="luxury-card stat-card">
        <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Distribución de Tutelas (Año Actual)</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
          {data.mensual.map((m, idx) => (
            <div 
              key={idx}
              style={{ 
                height: `${(m.total / maxVal) * 100}%`, 
                width: '100%', 
                background: idx === new Date().getMonth() ? '#e74c3c' : '#1a56b8', 
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.8s ease-out' 
              }} 
              title={`${m.mes}: ${m.total} tutelas`}
            ></div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '11px', color: '#95a5a6' }}>
          {data.mensual.map((m, idx) => <span key={idx}>{m.mes}</span>)}
        </div>
      </div>

      <div className="luxury-card stat-card">
        <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Eficiencia de Gestión</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.estados.map((est, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>{est.nombre}</span><span style={{fontWeight: 'bold'}}>{est.cantidad} ({est.porcentaje}%)</span>
              </div>
              <div style={{ height: '8px', background: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${est.porcentaje}%`, 
                  height: '100%', 
                  background: est.color,
                  transition: 'width 1s ease-in-out'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="luxury-card stat-card">
        <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>Top Pretensiones (Motivos)</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.topPretensiones && data.topPretensiones.length > 0 ? (
                data.topPretensiones.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8f9fa', borderRadius: '6px', fontSize: '12px' }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                            {idx + 1}. {p.nombre || 'Sin clasificar'}
                        </span>
                        <span style={{ color: '#1a56b8', fontWeight: 'bold' }}>{p.conteo}</span>
                    </div>
                ))
            ) : (
                <p style={{ fontSize: '12px', color: '#95a5a6' }}>No hay pretensiones registradas.</p>
            )}
        </div>
      </div>
    </div>
  );
};

const GlobalFooter = () => (
  <footer className="aura-mini-footer">
    <p>
      Copyright © 2026 <strong>FOSCAL</strong> | Fundación Oftalmológica de Santander - Clínica FOSCAL. Floridablanca, Colombia.
    </p>
  </footer>
);

// --- COMPONENTE PRINCIPAL ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [tab, setTab] = useState('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMaestrosOpen, setIsMaestrosOpen] = useState(false); 
  const [isTutelasOpen, setIsTutelasOpen] = useState(false); 
  const [imgError, setImgError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; 

  const handleLogout = useCallback(() => {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_session_start');
    setIsLoggedIn(false);
    setUserData(null);
    setTimeLeft(null);
    setIsUserMenuOpen(false); 
    setTab('inicio'); 
    setImgError(false);
  }, []);

  const handleExtendSession = () => {
    const newStart = new Date().getTime().toString();
    localStorage.setItem('aura_session_start', newStart);
    setTimeLeft(null);
  };
const fetchDashboardStats = useCallback(async () => {
  if (!isLoggedIn) return;
  setStatsLoading(true);

  const initialStructure = {
    mensual: [],
    estados: [],
    topPretensiones: []
  };

  try {
    const token = localStorage.getItem('aura_token');
    const headers = { Authorization: `Bearer ${token}` };

    const [gen, pret] = await Promise.all([
      fetch(`${API_BASE_URL}/admin/datos-generales`, { headers }).then(r => r.json()),
      fetch(`${API_BASE_URL}/admin/pretensionestutelamodulo`, { headers }).then(r => r.json())
    ]);

    const dataGenerales = Array.isArray(gen) ? gen : [];
    const dataPretensiones = Array.isArray(pret) ? pret : [];

    /* ===== 1. GRÁFICA MENSUAL (CAMBIADA A NARANJA) ===== */
    /* ===== 1. GRÁFICA DE EVOLUCIÓN (NARANJA PROFESIONAL) ===== */
const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const mensual = meses.map((mes, idx) => ({
  mes,
  total: dataGenerales.filter(d => {
    const fecha = getFechaValida(d);
    return fecha && new Date(fecha).getMonth() === idx;
  }).length,
  fill: '#f59e0b',
  stroke: '#f59e0b',
  color: '#f59e0b'
}));

    /* ===== 2. MÉTRICAS DE CREADOS (NARANJA Y VERDE) ===== */
    const totalRegistros = dataGenerales.length;
    const mesActual = new Date().getMonth();
    const nuevosEsteMes = dataGenerales.filter(d => {
      const fecha = getFechaValida(d);
      return fecha && new Date(fecha).getMonth() === mesActual;
    }).length;

    const resumenCreados = [
      { 
        nombre: 'Total Histórico', 
        cantidad: totalRegistros, 
        porcentaje: 100, 
        color: '#f59e0b' 
      },
      { 
        nombre: 'Nuevos (Mes)', 
        cantidad: nuevosEsteMes, 
        porcentaje: totalRegistros > 0 ? Math.round((nuevosEsteMes / totalRegistros) * 100) : 0, 
        color: '#10b981' 
      }
    ];

    /* ===== 3. TOP PRETENSIONES (AZUL) ===== */
    const pretMap = {};
    dataPretensiones.forEach(p => {
      const nombre = p.descripcion_pretension || p.nombre || p.descripcion || 'Otros';
      pretMap[nombre] = (pretMap[nombre] || 0) + 1;
    });

    const topPretensiones = Object.entries(pretMap)
      .map(([nombre, conteo]) => ({ 
        nombre, 
        conteo 
      }))
      .sort((a, b) => b.conteo - a.conteo)
      .slice(0, 5)
      .map(item => ({
        ...item,
        color: '#3b82f6' // AZUL
      }));

    setStatsData({
      mensual,
      estados: resumenCreados,
      topPretensiones
    });

  } catch (error) {
    console.error('Error analíticas:', error);
    setStatsData(initialStructure);
  } finally {
    setStatsLoading(false);
  }
}, [isLoggedIn, API_BASE_URL]);

  useEffect(() => {
    const savedUser = localStorage.getItem('aura_user');
    const savedToken = localStorage.getItem('aura_token');
    const sessionStart = localStorage.getItem('aura_session_start');

    if (savedUser && savedToken && sessionStart) {
      const currentTime = new Date().getTime();
      if (currentTime - parseInt(sessionStart) > SESSION_TIMEOUT) {
        handleLogout();
      } else {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUserData(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error al restaurar sesión:", error);
          localStorage.clear();
        }
      }
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [handleLogout, SESSION_TIMEOUT]);

  useEffect(() => {
    if (isLoggedIn && tab === 'inicio') {
      fetchDashboardStats();
    }
  }, [isLoggedIn, tab, fetchDashboardStats]);

  useEffect(() => {
    let interval;
    if (isLoggedIn) {
      interval = setInterval(() => {
        const sessionStart = localStorage.getItem('aura_session_start');
        if (sessionStart) {
          const currentTime = new Date().getTime();
          const elapsed = currentTime - parseInt(sessionStart);
          const remaining = SESSION_TIMEOUT - elapsed;
          const secondsRemaining = Math.floor(remaining / 1000);
          setTimeLeft(secondsRemaining);
          if (remaining <= 0) {
            handleLogout();
          }
        }
      }, 1000); 
    }
    return () => clearInterval(interval);
  }, [isLoggedIn, handleLogout, SESSION_TIMEOUT]);

  const handleLogin = (data) => {
    setIsLoading(true); 
    setImgError(false); 
    const loginTime = new Date().getTime().toString();
    localStorage.setItem('aura_token', data.token);
    localStorage.setItem('aura_user', JSON.stringify(data.user));
    localStorage.setItem('aura_session_start', loginTime); 
    setUserData(data.user); 
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 2000); 
  };

  const tutelasTabs = useMemo(() => [
    'm-datosgenerales', 'm-caracterizacionbenefiario', 'm-gestion', 
    'm-problemajuridico', 'm-datosacciontutela', 'm-causajuridica', 
    'm-pretensiones', 'est'
  ], []);

  const maestrosTabs = useMemo(() => [
    'm-juzgados', 'm-accionados', 'm-terminos', 'm-areas', 'm-peticiones', 
    'm-poblacionespecial', 'm-organizacion', 'm-tipoidentificacion', 'm-etnia', 
    'm-tipoafiliado', 'm-municipio', 'm-decisionprimeraistancia', 'm-decisionsegundaistancia', 
    'm-pais', 'm-codigoproblemajuridico', 'm-migrante', 'm-fuentefinanciacion', 
    'm-causademora', 'm-descripcioncausademora', 'm-regimenafiliacion', 'm-diagnostico', 
    'm-pretensiontutelas', 'm-codigocausaaccion'
  ], []);

  if (isLoading) {
    return (
      <div className="aura-loader-container">
        <div className="aura-loader-content">
          <div className="aura-logo-viewport">
            <div className="aura-ring ring-1"></div>
            <div className="aura-ring ring-2"></div>
            <div className="aura-ring ring-3"></div>
            <div className="aura-ring ring-4"></div>
            <div className="aura-ring ring-5"></div>
            <div className="aura-logo-wrapper">
              <img src="/logoaura.png" alt="AURA Logo" className="aura-loader-logo" />
            </div>
          </div>
          <div className="aura-text-group">
            <h2 className="aura-welcome-text">Iniciando Sistema</h2>
            <div className="aura-progress-wrapper">
              <div className="aura-progress-bar-minimal">
                <div className="aura-progress-fill-auto"></div>
              </div>
              <div className="aura-status-line">
                <span className="aura-pulse-dot"></span>
              </div>
            </div>
            <p className="aura-loading-sub">Sincronizando con sistema Tutelas FOSCAL</p>
          </div>
        </div>
        <GlobalFooter />
      </div>
    );   
  }

  if (!isLoggedIn) {
    return (
      <div className="login-wrapper-fixed">
        <Login onLogin={handleLogin} />
        <GlobalFooter />
      </div>
    );
  }

  const currentUserName = userData?.name || 'Usuario';
  const userRole = userData?.role || 'LECTOR';

  return (
    <div className={`app-container ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      <SessionWarning secondsRemaining={timeLeft} onExtend={handleExtendSession} />
      <aside className="sidebar">
        <button className="toggle-sidebar-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? '❮' : '❯'}
        </button>
        <div className="sidebar-content">
          <div className="brand-section">
            <div className="brand-logo-container">
              <img src="/logoaura.png" alt="AURA Logo" className="sidebar-logo-img" />
            </div>
          </div>
          <nav className="nav-menu">
            <button className={`nav-item ${tab === 'inicio' ? 'active' : ''}`} onClick={() => setTab('inicio')}>
              <span className="nav-icon"></span> <span className="nav-text">Inicio</span>
            </button>
            {(userRole === 'ADMIN' || userRole === 'TECNICO') && (
              <div className={`nav-group ${isTutelasOpen ? 'group-open' : ''}`}>
                <button 
                  className={`nav-item ${tutelasTabs.includes(tab) ? 'active' : ''}`} 
                  onClick={() => setIsTutelasOpen(!isTutelasOpen)}
                >
                  <span className="nav-text">Tutelas</span>
                  <span className={`arrow-submenu ${isTutelasOpen ? 'rotate' : ''}`}>▾</span>
                </button>
                {isTutelasOpen && (
                  <div className="sub-menu fade-in">
                    <button className={`sub-nav-item ${tab === 'm-datosgenerales' ? 'sub-active' : ''}`} onClick={() => setTab('m-datosgenerales')}>Tutelas</button>
                 
                  </div>
                )}
              </div>
            )}
            {userRole === 'ADMIN' && (
              <>
                <div className={`nav-group ${isMaestrosOpen ? 'group-open' : ''}`}>
                  <button 
                    className={`nav-item ${maestrosTabs.includes(tab) ? 'active' : ''}`} 
                    onClick={() => setIsMaestrosOpen(!isMaestrosOpen)}
                  >
                    <span className="nav-text">Maestros</span>
                    <span className={`arrow-submenu ${isMaestrosOpen ? 'rotate' : ''}`}>▾</span>
                  </button>
                  {isMaestrosOpen && (
                    <div className="sub-menu fade-in">
                      <button className={`sub-nav-item ${tab === 'm-juzgados' ? 'sub-active' : ''}`} onClick={() => setTab('m-juzgados')}>Juzgados</button>
                      <button className={`sub-nav-item ${tab === 'm-accionados' ? 'sub-active' : ''}`} onClick={() => setTab('m-accionados')}>Accionados</button>
                      <button className={`sub-nav-item ${tab === 'm-terminos' ? 'sub-active' : ''}`} onClick={() => setTab('m-terminos')}>Términos</button>
                      <button className={`sub-nav-item ${tab === 'm-areas' ? 'sub-active' : ''}`} onClick={() => setTab('m-areas')}>Áreas Destino</button>
                      <button className={`sub-nav-item ${tab === 'm-peticiones' ? 'sub-active' : ''}`} onClick={() => setTab('m-peticiones')}>Peticiones</button>
                      <button className={`sub-nav-item ${tab === 'm-poblacionespecial' ? 'sub-active' : ''}`} onClick={() => setTab('m-poblacionespecial')}>Población Especial</button>
                      <button className={`sub-nav-item ${tab === 'm-organizacion' ? 'sub-active' : ''}`} onClick={() => setTab('m-organizacion')}>Organización</button>
                      <button className={`sub-nav-item ${tab === 'm-tipoidentificacion' ? 'sub-active' : ''}`} onClick={() => setTab('m-tipoidentificacion')}>Tipo Identificación</button>
                      <button className={`sub-nav-item ${tab === 'm-etnia' ? 'sub-active' : ''}`} onClick={() => setTab('m-etnia')}>Etnia</button>
                      <button className={`sub-nav-item ${tab === 'm-tipoafiliado' ? 'sub-active' : ''}`} onClick={() => setTab('m-tipoafiliado')}>Tipo Afiliado</button>
                      <button className={`sub-nav-item ${tab === 'm-municipio' ? 'sub-active' : ''}`} onClick={() => setTab('m-municipio')}>Municipio</button>
                      <button className={`sub-nav-item ${tab === 'm-decisionprimeraistancia' ? 'sub-active' : ''}`} onClick={() => setTab('m-decisionprimeraistancia')}>Decisión Primera Instancia</button>
                      <button className={`sub-nav-item ${tab === 'm-decisionsegundaistancia' ? 'sub-active' : ''}`} onClick={() => setTab('m-decisionsegundaistancia')}>Decisión Segunda Instancia</button>
                      <button className={`sub-nav-item ${tab === 'm-pais' ? 'sub-active' : ''}`} onClick={() => setTab('m-pais')}>País</button>
                      <button className={`sub-nav-item ${tab === 'm-codigoproblemajuridico' ? 'sub-active' : ''}`} onClick={() => setTab('m-codigoproblemajuridico')}>Código Problema Jurídico</button>
                      <button className={`sub-nav-item ${tab === 'm-migrante' ? 'sub-active' : ''}`} onClick={() => setTab('m-migrante')}>Migrante</button>
                      <button className={`sub-nav-item ${tab === 'm-fuentefinanciacion' ? 'sub-active' : ''}`} onClick={() => setTab('m-fuentefinanciacion')}>Fuente Financiación</button>
                      <button className={`sub-nav-item ${tab === 'm-causademora' ? 'sub-active' : ''}`} onClick={() => setTab('m-causademora')}>Causa Demora</button>
                      <button className={`sub-nav-item ${tab === 'm-descripcioncausademora' ? 'sub-active' : ''}`} onClick={() => setTab('m-descripcioncausademora')}>Descripción Causa Demora</button>
                      <button className={`sub-nav-item ${tab === 'm-regimenafiliacion' ? 'sub-active' : ''}`} onClick={() => setTab('m-regimenafiliacion')}>Régimen Afiliación</button>
                      <button className={`sub-nav-item ${tab === 'm-diagnostico' ? 'sub-active' : ''}`} onClick={() => setTab('m-diagnostico')}>Diagnóstico</button>
                      <button className={`sub-nav-item ${tab === 'm-pretensiontutelas' ? 'sub-active' : ''}`} onClick={() => setTab('m-pretensiontutelas')}>Pretensión Tutelas</button>
                      <button className={`sub-nav-item ${tab === 'm-codigocausaaccion' ? 'sub-active' : ''}`} onClick={() => setTab('m-codigocausaaccion')}>Código Causa Acción Tutela</button>
                    </div>
                  )}
                </div>
                <button className={`nav-item ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>
                   <span className="nav-text">Administración</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </aside>

      <main className="main-view">
        <div className="top-bar-container">
            <div className="user-section-wrapper">
                <div 
                  className={`user-profile-banner ${isUserMenuOpen ? 'banner-active' : ''}`} 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="avatar-container">
                      {userData?.picture && !imgError ? (
                      <img src={userData.picture} alt="profile" className="avatar-img" onError={() => setImgError(true)} />
                      ) : (
                      <div className="avatar-circle">{currentUserName[0].toUpperCase()}</div>
                      )}
                      <span className="online-indicator"></span>
                  </div>
                  <div className="user-details">
                      <span className="user-name-text">{currentUserName}</span>
                      <span className={`user-role-badge role-${userRole.toLowerCase()}`}>{userRole}</span>
                  </div>
                  <span className={`arrow-icon ${isUserMenuOpen ? 'rotate' : ''}`}>▼</span>
                </div>
                {isUserMenuOpen && (
                <div className="user-dropdown">
                    <div className="dropdown-header">Sesión: {userData?.email}</div>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
                )}
            </div>
        </div>

        <div className="content-scroll-area">
          <div className="view-content-container">
            {tab === 'inicio' && (
              <div className="aura-home-view">
                <header className="innovative-hero">
                  <div className="hero-content">
                    <h1 className="hero-title">
                      Hola, <span className="text-gradient-menu">{currentUserName}</span>
                    </h1>
                    <p className="hero-subtitle">Bienvenidos al ecosistema digital Tutelas FOSCAL.</p>
                  </div>
                </header>

                {userRole === 'LECTOR' ? (
  <div className="access-denied-container">
    <div className="access-denied-card">
      <div className="denied-header-line"></div>
      
      <div className="denied-icon-wrapper">
        <svg 
          viewBox="0 0 24 24" 
          width="100" 
          height="100" 
          stroke="#e53e3e" 
          strokeWidth="1.2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <rect x="5" y="11" width="14" height="10" rx="4" />
        </svg>
      </div>

      <h2 className="denied-title">Acceso Restringido</h2>
      
      <p className="denied-text">
        Hola <strong style={{ fontWeight: '800', color: '#1a202c' }}>{currentUserName}</strong>. 
        Tu perfil actual (<strong style={{ fontWeight: '800', color: '#1a202c' }}>LECTOR</strong>) no tiene permisos asignados para ver este módulo.
      </p>

      <p className="denied-footer">
        Contacta al administrador para solicitar acceso a las funciones del sistema.
      </p>
    </div>
  </div>
) : (
                  <>
                    <div className="dashboard-grid-modern">
                      <div className="luxury-card" onClick={() => { setTab('m-datosgenerales'); setIsTutelasOpen(true); }}>
                        <div className="card-visual icon-blue">📋</div>
                        <div className="luxury-content">
                          <h3>Radicación</h3>
                          <p>Gestión centralizada de procesos.</p>
                        </div>
                      </div>
                      <div className="luxury-card" onClick={() => { setTab('m-gestion'); setIsTutelasOpen(true); }}>
                        <div className="card-visual icon-green">⚙️</div>
                        <div className="luxury-content">
                          <h3>Gestión</h3>
                          <p>Seguimiento de trámites y respuestas.</p>
                        </div>
                      </div>
                    </div>
                    <StatisticsSection data={statsData} loading={statsLoading} />
                  </>
                )}
                <GlobalFooter />
              </div>
            )}

            {/* VISTAS DINÁMICAS */}
            {tab === 'admin' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><AdminPages /><GlobalFooter /></div>}
            {tab === 'm-juzgados' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><JuzgadosPage /><GlobalFooter /></div>}
            {tab === 'm-accionados' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><AccionadosPage /><GlobalFooter /></div>}
            {tab === 'm-terminos' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><TerminoRespuestaPage /><GlobalFooter /></div>}
            {tab === 'm-areas' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><AreaDestinoPage /><GlobalFooter /></div>}
            {tab === 'm-peticiones' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><PeticionesPage /><GlobalFooter /></div>}
            {tab === 'm-poblacionespecial' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><PoblacionEspecialPage /><GlobalFooter /></div>}
            {tab === 'm-organizacion' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><OrganizacionPage /><GlobalFooter /></div>}
            {tab === 'm-tipoidentificacion' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><TipoIdentificacionPage /><GlobalFooter /></div>}
            {tab === 'm-etnia' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><EtniaPage /><GlobalFooter /></div>}
            {tab === 'm-tipoafiliado' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><TipoAfiliadoPage /><GlobalFooter /></div>}
            {tab === 'm-municipio' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><MunicipioPage /><GlobalFooter /></div>}
            {tab === 'm-decisionprimeraistancia' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><DecisionPrimeraInstanciaPage /><GlobalFooter /></div>}
            {tab === 'm-decisionsegundaistancia' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><DecisionSegundaInstanciaPage /><GlobalFooter /></div>}
            {tab === 'm-pais' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><PaisPage /><GlobalFooter /></div>}
            {tab === 'm-codigoproblemajuridico' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><CodigoProblemaJuridicoPage /><GlobalFooter /></div>}
            {tab === 'm-migrante' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><MigrantePage /><GlobalFooter /></div>}
            {tab === 'm-fuentefinanciacion' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><FuenteFinanciacionPage /><GlobalFooter /></div>}
            {tab === 'm-causademora' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><CausaDemoraPage /><GlobalFooter /></div>}
            {tab === 'm-descripcioncausademora' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><DescripcionCausaDemoraPage /><GlobalFooter /></div>}
            {tab === 'm-regimenafiliacion' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><RegimenAfiliacionPage /><GlobalFooter /></div>}
            {tab === 'm-diagnostico' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><DiagnosticoPage /><GlobalFooter /></div>}
            {tab === 'm-pretensiontutelas' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><PretensionTutelaPage /><GlobalFooter /></div>}
            {tab === 'm-codigocausaaccion' && userRole === 'ADMIN' && <div className="view-wrapper fade-in"><CodigoCausaAccionPage /><GlobalFooter /></div>}
            
            {/* VISTAS DE TUTELAS */}
            {tab === 'm-datosgenerales' && (userRole === 'ADMIN' || userRole === 'TECNICO') && <div className="view-wrapper fade-in"><DatosGeneralesPage /><GlobalFooter /></div>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;