import React, { useState, useEffect } from 'react';
import './index.css';
import Login from './auth/Login.jsx'; 
import AdminPages from './pages/admin/AdminPages.jsx';
import JuzgadosPage from './pages/juzgados/JuzgadosPage.jsx'; 
import AccionadosPage from './pages/accionado/AccionadosPage.jsx';
import TerminoRespuestaPage from './pages/terminorespuesta/TerminoRespuestaPage.jsx';
// IMPORTACIÓN DEL NUEVO MAESTRO: ÁREA DESTINO
import AreaDestinoPage from './pages/areadestino/AreaDestinoPage.jsx';

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
          <div className="aura-logo-animated">AURA</div>
          <h2 className="aura-welcome-text">Cargando...</h2>
          <div className="aura-progress-bar">
            <div className="aura-progress-fill"></div>
          </div>
          <p className="aura-loading-sub">Sincronizando con sistema Tutelas FOSCAL</p>
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
            <div className="brand-logo">AURA</div>
            <div className="brand-subtitle">FOSCAL</div>
          </div>
          
          <nav className="nav-menu">
            <button className={`nav-item ${tab === 'inicio' ? 'active' : ''}`} onClick={() => setTab('inicio')}>
              <span className="nav-icon"></span> <span className="nav-text">Inicio</span>
            </button>
            
            {(userRole === 'ADMIN' || userRole === 'TECNICO') && (
              <button className={`nav-item ${tab === 'est' ? 'active' : ''}`} onClick={() => setTab('est')}>
                <span className="nav-icon"></span> <span className="nav-text">Tutelas</span>
              </button>
            )}

            {userRole === 'ADMIN' && (
              <>
                <div className={`nav-group ${isMaestrosOpen ? 'group-open' : ''}`}>
                  <button 
                    className={`nav-item ${tab.startsWith('m-') ? 'active' : ''}`} 
                    onClick={() => setIsMaestrosOpen(!isMaestrosOpen)}
                  >
                    <span className="nav-icon"></span> 
                    <span className="nav-text">Maestros</span>
                    <span className={`arrow-submenu ${isMaestrosOpen ? 'rotate' : ''}`}>▾</span>
                  </button>
                  
                  {isMaestrosOpen && (
                    <div className="sub-menu fade-in">
                      <button 
                        className={`sub-nav-item ${tab === 'm-juzgados' ? 'sub-active' : ''}`} 
                        onClick={() => setTab('m-juzgados')}
                      >
                          Juzgados
                      </button>
                      
                      <button 
                        className={`sub-nav-item ${tab === 'm-accionados' ? 'sub-active' : ''}`} 
                        onClick={() => setTab('m-accionados')}
                      >
                          Accionados
                      </button>

                      <button 
                        className={`sub-nav-item ${tab === 'm-terminos' ? 'sub-active' : ''}`} 
                        onClick={() => setTab('m-terminos')}
                      >
                          Términos
                      </button>

                      {/* NUEVO BOTÓN: ÁREAS DESTINO */}
                      <button 
                        className={`sub-nav-item ${tab === 'm-areas' ? 'sub-active' : ''}`} 
                        onClick={() => setTab('m-areas')}
                      >
                          Áreas Destino
                      </button>
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
                        <h1 className="hero-title">Hola, <span className="text-gradient">{currentUserName}</span></h1>
                    </div>
                </header>

                {userRole === 'LECTOR' ? (
                  <div className="access-denied-container">
                    <div className="access-denied-card">
                      <div className="denied-icon-wrapper">
                        <span className="denied-icon">🔒</span>
                      </div>
                      <h2>Acceso Restringido</h2>
                      <p>Hola <strong>{currentUserName}</strong>. Tu perfil no tiene permisos asignados para este módulo.</p>
                    </div>
                  </div>
                ) : (
                  <div className="dashboard-grid-modern">
                    <div className="luxury-card card-blue" onClick={() => setTab('est')}>
                      <div className="luxury-icon-box">📊</div>
                      <div className="luxury-content">
                        <h3>Estadísticas Orion</h3>
                        <p>Analítica avanzada y visualización de datos en tiempo real.</p>
                        <span className="luxury-link">Explorar módulo →</span>
                      </div>
                    </div>
                    <div className="luxury-card card-green">
                      <div className="luxury-icon-box">📁</div>
                      <div className="luxury-content">
                        <h3>Gestión Documental</h3>
                        <p>Repositorio seguro para expedientes y documentos institucionales.</p>
                        <span className="luxury-link">Acceder ahora →</span>
                      </div>
                    </div>
                    {userRole === 'ADMIN' && (
                      <div className="luxury-card card-mixed" onClick={() => setTab('aud')}>
                        <div className="luxury-icon-box">🛡️</div>
                        <div className="luxury-content">
                          <h3>Auditoría</h3>
                          <p>Trazabilidad completa y seguridad de protocolos internos.</p>
                          <span className="luxury-link">Ver bitácora →</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <GlobalFooter />
              </div>
            )}

            {/* VISTAS DE ADMINISTRACIÓN */}
            {tab === 'admin' && userRole === 'ADMIN' && (
                <div className="admin-view-wrapper fade-in">
                    <AdminPages />
                </div>
            )}

            {/* VISTAS DE MAESTROS */}
            {tab === 'm-juzgados' && userRole === 'ADMIN' && (
                <div className="admin-view-wrapper fade-in">
                    <JuzgadosPage />
                </div>
            )}

            {tab === 'm-accionados' && userRole === 'ADMIN' && (
                <div className="admin-view-wrapper fade-in">
                    <AccionadosPage />
                </div>
            )}

            {tab === 'm-terminos' && userRole === 'ADMIN' && (
                <div className="admin-view-wrapper fade-in">
                    <TerminoRespuestaPage />
                </div>
            )}

            {/* RENDERIZADO DE LA VISTA ÁREAS DESTINO */}
            {tab === 'm-areas' && userRole === 'ADMIN' && (
                <div className="admin-view-wrapper fade-in">
                    <AreaDestinoPage />
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;