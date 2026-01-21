import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './Login.css';

const Login = ({ onLogin }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        throw new Error('No se recibió el token de Google');
      }

      const response = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Error autenticando con el servidor');
      }

      // ✅ SOLUCIÓN: Guardar el token para que AdminPages pueda usarlo
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      onLogin(data);

    } catch (error) {
      console.error('❌ Error Login Google:', error);
      alert(error.message || 'Error al iniciar sesión');
    }
  };

  const handleGoogleError = () => {
    alert('Error de autenticación con Google');
  };

  if (!clientId) {
    return (
      <div className="login-page">
        <p style={{ color: 'white' }}>
          ❌ Error: VITE_GOOGLE_CLIENT_ID no configurado
        </p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            {/* ✅ LOGO REEMPLAZANDO EL TEXTO AURA */}
            <div className="login-logo-container">
              <img 
                src="/logoaura.png" 
                alt="AURA Logo" 
                className="login-logo-img"
              />
            </div>
            <p className="login-subtitle">Gestión TUTELAS FOSCAL</p>
          </div>

          <div className="login-body">
            <div className="google-login-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                shape="pill"
                width="300"
                useOneTap={false} 
              />
            </div>
          </div>

          <div className="login-footer">
            <small>© 2026 AURA - Sistemas - FOSCAL</small>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;