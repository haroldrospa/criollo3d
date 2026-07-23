import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Sparkles, User, ShieldCheck, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  activeTab, 
  setActiveTab,
  onOpenSearch
}) {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin, openLoginModal, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'shop', label: t('nav.shop') },
    { id: 'about', label: t('nav.about') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    
    if (id === 'admin') return;

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container header-container">
        
        {/* Clean Brand Logo Image */}
        <div className="brand" onClick={() => handleNavClick('home')}>
          <img src="/logo_full_transparent.png" alt="Criollo3D" className="brand-logo-img" />
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`nav-link ${activeTab === link.id ? 'active' : ''} ${link.isHighlight ? 'nav-link-quote' : ''}`}
            >
              {link.isHighlight && <Sparkles size={14} className="sparkle-icon" />}
              {link.label}
            </button>
          ))}

          {/* Admin shortcut in header if logged in as Admin */}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`nav-link admin-nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
            >
              <ShieldCheck size={16} className="text-blue" />
              Panel Admin
            </button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          
          {/* Desktop Language Switcher */}
          <div className="lang-switcher-desktop">
            <button 
              className={`lang-text-btn ${language === 'es' ? 'active' : ''}`}
              onClick={() => setLanguage('es')}
            >
              ES
            </button>
            <span className="lang-slash">/</span>
            <button 
              className={`lang-text-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>

          <button 
            className="action-btn" 
            onClick={onOpenSearch}
            title={t('nav.searchPlaceholder')}
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          <button 
            className="action-btn cart-btn" 
            onClick={onOpenCart}
            title={t('nav.cartTitle')}
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="cart-badge animate-scale">{cartCount}</span>
            )}
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="user-header-menu">
              <button 
                className="user-badge-btn"
                onClick={() => isAdmin ? handleNavClick('admin') : null}
                title={user.name}
              >
                <img src={user.avatar} alt={user.name} className="header-user-avatar" />
                <span className="header-user-name">{user.name.split(' ')[0]}</span>
                {isAdmin && <span className="admin-chip">Admin</span>}
              </button>
              <button className="action-btn logout-sm-btn" onClick={logout} title="Cerrar Sesión">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="auth-login-btn" onClick={openLoginModal}>
              <User size={17} /> Iniciar Sesión
            </button>
          )}

          <button 
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation - Simple & Professional */}
      {isMobileMenuOpen && (
        <div className="mobile-menu glass animate-fade-in">
          
          {/* Language Selector inside Mobile Menu */}
          <div className="mobile-lang-bar">
            <span className="mobile-lang-lbl">Idioma / Language</span>
            <div className="mobile-lang-toggle">
              <button 
                className={`mobile-lang-chip ${language === 'es' ? 'active' : ''}`}
                onClick={() => setLanguage('es')}
              >
                🇪🇸 Español
              </button>
              <button 
                className={`mobile-lang-chip ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <div className="mobile-nav-list">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`mobile-nav-link ${activeTab === link.id ? 'active' : ''} ${link.isHighlight ? 'mobile-quote-btn' : ''}`}
              >
                {link.isHighlight && <Sparkles size={16} />}
                {link.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`mobile-nav-link admin-mobile-link ${activeTab === 'admin' ? 'active' : ''}`}
              >
                <ShieldCheck size={18} />
                Panel Admin (Control Total)
              </button>
            )}

            {!user ? (
              <button
                onClick={() => { setIsMobileMenuOpen(false); openLoginModal(); }}
                className="mobile-nav-link auth-mobile-link"
              >
                <User size={18} />
                Iniciar Sesión / Acceso
              </button>
            ) : (
              <button
                onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                className="mobile-nav-link logout-mobile-link"
              >
                <LogOut size={18} />
                Cerrar Sesión ({user.name})
              </button>
            )}
          </div>

        </div>
      )}

      <style>{`
        .header {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          background: #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          transition: all 0.25s ease;
          padding: 0.9rem 0;
        }

        .auth-login-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #f1f5f9;
          color: #0f172a;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.45rem 0.85rem;
          border-radius: 99px;
          transition: all 0.2s ease;
        }

        .auth-login-btn:hover {
          background: var(--primary-blue, #0055ff);
          color: #ffffff;
        }

        .user-header-menu {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .user-badge-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 0.25rem 0.65rem 0.25rem 0.35rem;
          border-radius: 99px;
          cursor: pointer;
        }

        .header-user-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: cover;
        }

        .header-user-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #0f172a;
        }

        .admin-chip {
          background: #0055ff;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.15rem 0.4rem;
          border-radius: 99px;
          text-transform: uppercase;
        }

        .admin-nav-btn {
          color: #0055ff !important;
          font-weight: 700 !important;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .admin-mobile-link {
          color: #0055ff !important;
          font-weight: 800 !important;
        }

        .auth-mobile-link {
          color: #0f172a !important;
        }

        .logout-mobile-link {
          color: #ef4444 !important;
        }

        .header.scrolled {
          padding: 0.65rem 0;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          user-select: none;
        }

        .brand-logo-img {
          height: 38px;
          max-width: 180px;
          width: auto;
          object-fit: contain;
        }

        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.92rem;
          color: #4B5563;
          position: relative;
          padding: 0.4rem 0;
          transition: color 0.2s ease;
        }

        .nav-link:hover, .nav-link.active {
          color: #111827;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 100%;
          height: 2px;
          background-color: var(--primary-blue);
          transition: transform 0.2s ease;
        }

        .nav-link.active::after, .nav-link:hover::after {
          transform: translateX(-50%) scaleX(1);
        }

        .nav-link-quote {
          color: var(--primary-blue) !important;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(0, 85, 255, 0.07);
          padding: 0.35rem 0.85rem !important;
          border-radius: 20px;
        }

        .nav-link-quote::after {
          display: none;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Desktop Language Switcher */
        .lang-switcher-desktop {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-right: 0.4rem;
        }

        .lang-text-btn {
          font-size: 0.8rem;
          font-weight: 700;
          color: #9CA3AF;
          transition: color 0.2s ease;
        }

        .lang-text-btn:hover, .lang-text-btn.active {
          color: var(--primary-blue);
        }

        .lang-slash {
          color: #D1D5DB;
          font-size: 0.8rem;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111827;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background-color: #F3F4F6;
          color: var(--primary-blue);
        }

        .cart-btn {
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: var(--primary-blue);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          min-width: 17px;
          height: 17px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          border: 2px solid #ffffff;
        }

        .mobile-toggle {
          display: none;
          color: #111827;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
        }

        /* Mobile Drawer Menu */
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #ffffff;
          padding: 1.25rem 1.5rem 1.5rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .mobile-lang-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid #F3F4F6;
        }

        .mobile-lang-lbl {
          font-size: 0.82rem;
          font-weight: 600;
          color: #6B7280;
        }

        .mobile-lang-toggle {
          display: flex;
          gap: 0.4rem;
        }

        .mobile-lang-chip {
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          background: #F3F4F6;
          font-size: 0.8rem;
          font-weight: 600;
          color: #4B5563;
        }

        .mobile-lang-chip.active {
          background: var(--primary-blue);
          color: #ffffff;
        }

        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mobile-nav-link {
          text-align: left;
          font-size: 1.05rem;
          font-weight: 600;
          padding: 0.6rem 0;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .mobile-nav-link.active {
          color: var(--primary-blue);
        }

        .mobile-quote-btn {
          color: var(--primary-blue) !important;
          font-weight: 700;
        }

        @media (max-width: 868px) {
          .nav-desktop {
            display: none;
          }
          .lang-switcher-desktop {
            display: none;
          }
          .mobile-toggle {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
