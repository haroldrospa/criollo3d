import React, { useState } from 'react';
import { X, ShieldCheck, User, Lock, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose, onNotification, onLoginSuccess }) {
  const { login, register, isLoginModalOpen, closeLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen && !isLoginModalOpen) return null;

  const handleClose = () => {
    setError('');
    if (onClose) onClose();
    closeLoginModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (activeTab === 'login') {
      const res = login(email, password);
      if (res.success) {
        if (onNotification) {
          onNotification(`👋 ¡Bienvenido de nuevo, ${res.user.name}!`);
        }
        if (onLoginSuccess) onLoginSuccess(res.user);
        handleClose();
      }
    } else {
      if (!name) {
        setError('Por favor ingrese su nombre');
        return;
      }
      const res = register(name, email, password);
      if (res.success) {
        if (onNotification) {
          onNotification(`🎉 Cuenta creada exitosamente. ¡Bienvenido, ${res.user.name}!`);
        }
        if (onLoginSuccess) onLoginSuccess(res.user);
        handleClose();
      }
    }
  };

  const handleQuickLogin = (role) => {
    let res;
    if (role === 'admin') {
      setEmail('admin@criollo3d.com');
      setPassword('admin123');
      res = login('admin@criollo3d.com', 'admin123');
      if (onNotification) {
        onNotification('🛡️ Sesión iniciada como ADMINISTRADOR');
      }
    } else {
      setEmail('cliente@criollo3d.com');
      setPassword('user123');
      res = login('cliente@criollo3d.com', 'user123');
      if (onNotification) {
        onNotification('👤 Sesión iniciada como CLIENTE');
      }
    }
    if (res?.success && onLoginSuccess) {
      onLoginSuccess(res.user);
    }
    handleClose();
  };

  return (
    <div className="login-modal-overlay animate-fade-in" onClick={handleClose}>
      <div className="login-modal-card glass animate-scale-up" onClick={(e) => e.stopPropagation()}>
        
        {/* Header close button */}
        <button className="login-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="login-header text-center">
          <div className="login-logo-badge">
            <img src="/logo_full_transparent.png" alt="Criollo3D" className="login-logo-img" />
          </div>
          <h2 className="login-title">
            Acceso a la Plataforma
          </h2>
          <p className="login-subtitle">
            {activeTab === 'login' 
              ? 'Ingresa a tu cuenta para gestionar pedidos o administrar el sistema'
              : 'Crea tu cuenta para cotizar e imprimir tus proyectos 3D'}
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="quick-access-box">
          <span className="quick-title">⚡ Acceso Rápido de Prueba:</span>
          <div className="quick-buttons">
            <button 
              type="button" 
              className="quick-btn admin-btn"
              onClick={() => handleQuickLogin('admin')}
            >
              <ShieldCheck size={15} /> Entrar como Admin
            </button>
            <button 
              type="button" 
              className="quick-btn client-btn"
              onClick={() => handleQuickLogin('client')}
            >
              <User size={15} /> Entrar como Cliente
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="login-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); }}
          >
            Registrarse
          </button>
        </div>

        {error && <div className="login-error-msg">{error}</div>}

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {activeTab === 'register' && (
            <div className="input-group">
              <label><User size={16} /> Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label><Mail size={16} /> Correo Electrónico</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label><Lock size={16} /> Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn">
            {activeTab === 'login' ? 'Ingresar al Sistema' : 'Crear mi Cuenta'}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer info */}
        <div className="login-footer-info">
          <p>🔒 Conexión segura encriptada Criollo 3D System v1.0</p>
        </div>
      </div>

      <style>{`
        .login-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .login-modal-card {
          background: #ffffff;
          width: 100%;
          max-width: 440px;
          border-radius: 24px;
          padding: 2.25rem 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          position: relative;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .login-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .login-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .login-logo-badge {
          height: 46px;
          max-width: 220px;
          margin: 0 auto 0.75rem auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .login-title {
          font-family: var(--font-heading, sans-serif);
          font-weight: 800;
          font-size: 1.5rem;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .blue-text {
          color: var(--primary-blue, #0055ff);
        }

        .login-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 1.25rem;
          line-height: 1.4;
        }

        /* Quick Access Box */
        .quick-access-box {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 14px;
          padding: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .quick-title {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .quick-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .quick-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
          font-size: 0.78rem;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .admin-btn {
          background: #1e293b;
          color: #ffffff;
        }
        .admin-btn:hover {
          background: #0f172a;
          transform: translateY(-1px);
        }

        .client-btn {
          background: #e0e7ff;
          color: #3730a3;
        }
        .client-btn:hover {
          background: #c7d2fe;
          transform: translateY(-1px);
        }

        /* Tabs */
        .login-tabs {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 1.25rem;
        }

        .tab-btn {
          flex: 1;
          padding: 0.55rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: #64748b;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .tab-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .login-error-msg {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.6rem;
          border-radius: 10px;
          font-size: 0.82rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          text-align: left;
        }

        .input-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .input-group input {
          width: 100%;
          padding: 0.7rem 0.9rem;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          outline: none;
        }

        .input-group input:focus {
          border-color: var(--primary-blue, #0055ff);
          box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.12);
        }

        .login-submit-btn {
          margin-top: 0.5rem;
          background: var(--primary-blue, #0055ff);
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0.85rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 85, 255, 0.3);
        }

        .login-submit-btn:hover {
          background: #0044cc;
          transform: translateY(-1px);
        }

        .login-footer-info {
          margin-top: 1.25rem;
          text-align: center;
          font-size: 0.75rem;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
