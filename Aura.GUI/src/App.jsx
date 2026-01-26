import React, { useState, useEffect } from 'react';
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

const GlobalFooter = () => (
  <footer className="aura-mini-footer">
    <p>
      Copyright © 2026 <strong>FOSCAL</strong> | Fundación Oftalmológica de Santander - Clínica FOSCAL. Floridablanca, Colombia.
    </p>
  </footer>
);

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

  useEffect(() => {
    const initAuth = () => {
      const savedUser = localStorage.getItem('aura_user');
      const savedToken = localStorage.getItem('aura_token');

      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUserData(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error al restaurar sesión:", error);
          localStorage.clear();
        }
      }
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);

      return timer;
    };

    const authTimer = initAuth();
    return () => clearTimeout(authTimer);
  }, []);

  const handleLogin = (data) => {
    setIsLoading(true); 
    setImgError(false); 
    localStorage.setItem('aura_token', data.token);
    localStorage.setItem('aura_user', JSON.stringify(data.user));
    setUserData(data.user); 
    
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 2000); 
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    setIsLoggedIn(false);
    setUserData(null);
    setIsUserMenuOpen(false); 
    setTab('inicio'); 
    setImgError(false);
  };

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
            <img 
              src="/logoaura.png" 
              alt="AURA Logo" 
              className="aura-loader-logo" 
            />
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
            
            {/* MÓDULO DE TUTELAS CON SUBMENÚ - APLICADO EFECTO SUB-ACTIVE */}
            {(userRole === 'ADMIN' || userRole === 'TECNICO') && (
              <div className={`nav-group ${isTutelasOpen ? 'group-open' : ''}`}>
                <button 
                  className={`nav-item ${tab.startsWith('t-') || tab === 'est' || tab === 'm-datosgenerales' ? 'active' : ''}`} 
                  onClick={() => setIsTutelasOpen(!isTutelasOpen)}
                >
                  <span className="nav-icon"></span> 
                  <span className="nav-text">Tutelas</span>
                  <span className={`arrow-submenu ${isTutelasOpen ? 'rotate' : ''}`}>▾</span>
                </button>

                {isTutelasOpen && (
                  <div className="sub-menu fade-in">
                   <button 
                      className={`sub-nav-item ${tab === 'm-datosgenerales' ? 'sub-active' : ''}`} 
                      onClick={() => setTab('m-datosgenerales')}
                    >
                      Datos Generales 
                    </button>
                  </div>
                )}
              </div>
            )}

            {userRole === 'ADMIN' && (
              <>
                <div className={`nav-group ${isMaestrosOpen ? 'group-open' : ''}`}>
                  <button 
                    className={`nav-item ${tab.startsWith('m-') && tab !== 'm-datosgenerales' ? 'active' : ''}`} 
                    onClick={() => setIsMaestrosOpen(!isMaestrosOpen)}
                  >
                    <span className="nav-icon"></span> 
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
                      <button className={`sub-nav-item ${tab === 'm-poblacionespecial' ? 'sub-active' : ''}`} onClick={() => setTab('m-poblacionespecial')}>Poblacion Especial</button>
                      <button className={`sub-nav-item ${tab === 'm-organizacion' ? 'sub-active' : ''}`} onClick={() => setTab('m-organizacion')}>Organización</button>
                      <button className={`sub-nav-item ${tab === 'm-tipoidentificacion' ? 'sub-active' : ''}`} onClick={() => setTab('m-tipoidentificacion')}>Tipo Identificacion</button>
                      <button className={`sub-nav-item ${tab === 'm-etnia' ? 'sub-active' : ''}`} onClick={() => setTab('m-etnia')}>Etnia</button>
                      <button className={`sub-nav-item ${tab === 'm-tipoafiliado' ? 'sub-active' : ''}`} onClick={() => setTab('m-tipoafiliado')}>Tipo Afiliado</button>
                      <button className={`sub-nav-item ${tab === 'm-municipio' ? 'sub-active' : ''}`} onClick={() => setTab('m-municipio')}>Municipio</button>
                      <button className={`sub-nav-item ${tab === 'm-decisionprimeraistancia' ? 'sub-active' : ''}`} onClick={() => setTab('m-decisionprimeraistancia')}>Decision Primera Instancia</button>
                      <button className={`sub-nav-item ${tab === 'm-decisionsegundaistancia' ? 'sub-active' : ''}`} onClick={() => setTab('m-decisionsegundaistancia')}>Decision Segunda Instancia</button>
                      <button className={`sub-nav-item ${tab === 'm-pais' ? 'sub-active' : ''}`} onClick={() => setTab('m-pais')}>Pais</button>
                      <button className={`sub-nav-item ${tab === 'm-codigoproblemajuridico' ? 'sub-active' : ''}`} onClick={() => setTab('m-codigoproblemajuridico')}>Codigo Problema Juridico</button>
                      <button className={`sub-nav-item ${tab === 'm-migrante' ? 'sub-active' : ''}`} onClick={() => setTab('m-migrante')}>Migrante</button>
                      <button className={`sub-nav-item ${tab === 'm-fuentefinanciacion' ? 'sub-active' : ''}`} onClick={() => setTab('m-fuentefinanciacion')}>Fuente Financiacion</button>
                      <button className={`sub-nav-item ${tab === 'm-causademora' ? 'sub-active' : ''}`} onClick={() => setTab('m-causademora')}>Causa Demora</button>
                      <button className={`sub-nav-item ${tab === 'm-descripcioncausademora' ? 'sub-active' : ''}`} onClick={() => setTab('m-descripcioncausademora')}>Descripción Causa Demora</button>
                      <button className={`sub-nav-item ${tab === 'm-regimenafiliacion' ? 'sub-active' : ''}`} onClick={() => setTab('m-regimenafiliacion')}>Regimen Afiliación</button>
                      <button className={`sub-nav-item ${tab === 'm-diagnostico' ? 'sub-active' : ''}`} onClick={() => setTab('m-diagnostico')}>Diagnóstico</button>
                      <button className={`sub-nav-item ${tab === 'm-pretensiontutelas' ? 'sub-active' : ''}`} onClick={() => setTab('m-pretensiontutelas')}>Pretension Tutelas</button>
                      <button className={`sub-nav-item ${tab === 'm-codigocausaaccion' ? 'sub-active' : ''}`} onClick={() => setTab('m-codigocausaaccion')}>Codigo Causa Accion Tutela</button>
                    </div>
                  )}
                </div>

                <button className={`nav-item ${tab === 'aud' ? 'active' : ''}`} onClick={() => setTab('aud')}>
                  <span className="nav-icon"></span> <span className="nav-text">Auditoría</span>
                </button>
                <button className={`nav-item ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>
                  <span className="nav-icon"></span> <span className="nav-text">Administración</span>
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
                      <img 
                          src={userData.picture} 
                          alt="profile" 
                          className="avatar-img" 
                          onError={() => setImgError(true)} 
                      />
                      ) : (
                      <div className="avatar-circle">
                          {currentUserName[0].toUpperCase()}
                      </div>
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
            <p className="hero-subtitle">Bienvenido al ecosistema digital Tutelas FOSCAL.</p>
          </div>
        </header>

        {userRole === 'LECTOR' ? (
          <div className="access-denied-container">
            <div className="access-denied-card">
              <div className="denied-icon-wrapper">
                <span className="denied-icon">🔒</span>
              </div>
              <h2>Acceso Restringido</h2>
              <p>Hola <strong>{currentUserName}</strong>. Tu perfil actualmente tiene un rol de <span>LECTOR</span> y no posee permisos de escritura.</p>
            </div>
          </div>
        ) : (
          <div className="dashboard-grid-modern">
            <div className="luxury-card" onClick={() => {setTab('est'); setIsTutelasOpen(true);}}>
              <div className="card-visual icon-blue">📊</div>
              <div className="luxury-content">
                <h3>Estadísticas Orion</h3>
                <p>Analítica avanzada y visualización de datos en tiempo real.</p>
                <div className="luxury-footer">
                  <span className="luxury-link">Explorar módulo</span>
                  <span className="arrow">→</span>
                </div>
              </div>
            </div>

            <div className="luxury-card" onClick={() => setTab('docs')}>
              <div className="card-visual icon-green">📁</div>
              <div className="luxury-content">
                <h3>Gestión Documental</h3>
                <p>Repositorio seguro para expedientes y documentos institucionales.</p>
                <div className="luxury-footer">
                  <span className="luxury-link">Acceder ahora</span>
                  <span className="arrow">→</span>
                </div>
              </div>
            </div>

            {userRole === 'ADMIN' && (
              <div className="luxury-card" onClick={() => setTab('aud')}>
                <div className="card-visual icon-mixed">🛡️</div>
                <div className="luxury-content">
                  <h3>Auditoría</h3>
                  <p>Trazabilidad completa y seguridad de protocolos internos.</p>
                  <div className="luxury-footer">
                    <span className="luxury-link">Ver bitácora</span>
                    <span className="arrow">→</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <GlobalFooter />
      </div>
    )}

    {/* SECCIÓN DE VISTAS */}
    {tab === 'est' && (userRole === 'ADMIN' || userRole === 'TECNICO') && (
        <div className="admin-view-wrapper fade-in">
            <div style={{padding: '20px'}}><h2>Módulo de Tutelas / Estadísticas</h2></div>
            <GlobalFooter />
        </div>
    )}

    {tab === 'admin' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><AdminPages /><GlobalFooter /></div>
    )}

    {tab === 'm-juzgados' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><JuzgadosPage /><GlobalFooter /></div>
    )}

    {tab === 'm-accionados' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><AccionadosPage /><GlobalFooter /></div>
    )}

    {tab === 'm-terminos' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><TerminoRespuestaPage /><GlobalFooter /></div>
    )}

    {tab === 'm-areas' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><AreaDestinoPage /><GlobalFooter /></div>
    )}

    {tab === 'm-peticiones' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><PeticionesPage /><GlobalFooter /></div>
    )}

    {tab === 'm-poblacionespecial' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><PoblacionEspecialPage /><GlobalFooter /></div>
    )}
    
    {tab === 'm-organizacion' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><OrganizacionPage /><GlobalFooter /></div>
    )}
    
    {tab === 'm-tipoidentificacion' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><TipoIdentificacionPage /><GlobalFooter /></div>
    )}

    {tab === 'm-etnia' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><EtniaPage /><GlobalFooter /></div>
    )}

    {tab === 'm-tipoafiliado' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><TipoAfiliadoPage /><GlobalFooter /></div>
    )}

    {tab === 'm-municipio' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><MunicipioPage /><GlobalFooter /></div>
    )}

    {tab === 'm-decisionprimeraistancia' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><DecisionPrimeraInstanciaPage /><GlobalFooter /></div>
    )}

    {tab === 'm-decisionsegundaistancia' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><DecisionSegundaInstanciaPage /><GlobalFooter /></div>
    )}

    {tab === 'm-pais' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><PaisPage /><GlobalFooter /></div>
    )}

    {tab === 'm-codigoproblemajuridico' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><CodigoProblemaJuridicoPage /><GlobalFooter /></div>
    )}

    {tab === 'm-migrante' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><MigrantePage /><GlobalFooter /></div>
    )}

    {tab === 'm-fuentefinanciacion' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><FuenteFinanciacionPage /><GlobalFooter /></div>
    )}

    {tab === 'm-causademora' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><CausaDemoraPage /><GlobalFooter /></div>
    )}

    {tab === 'm-descripcioncausademora' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><DescripcionCausaDemoraPage /><GlobalFooter /></div>
    )}

    {tab === 'm-regimenafiliacion' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><RegimenAfiliacionPage /><GlobalFooter /></div>
    )}

    {tab === 'm-diagnostico' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><DiagnosticoPage /><GlobalFooter /></div>
    )}

    {tab === 'm-pretensiontutelas' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><PretensionTutelaPage /><GlobalFooter /></div>
    )}

    {tab === 'm-codigocausaaccion' && userRole === 'ADMIN' && (
        <div className="admin-view-wrapper fade-in"><CodigoCausaAccionPage /><GlobalFooter /></div>
    )}
     {tab === 'm-datosgenerales' && (userRole === 'ADMIN' || userRole === 'TECNICO') && (
        <div className="admin-view-wrapper fade-in"><DatosGeneralesPage /><GlobalFooter /></div>
    )}
              
  </div>
</div>
      </main>
    </div>
  );
}

export default App;