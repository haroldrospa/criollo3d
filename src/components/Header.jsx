import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Sparkles } from 'lucide-react';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  activeTab, 
  setActiveTab,
  onOpenSearch
}) {
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
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'quote', label: 'Cotizaciones 3D', isHighlight: true },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    
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
        
        {/* Brand Logo - Transparent circular emblem + "Criollo 3D" text */}
        <div className="brand" onClick={() => handleNavClick('home')}>
          <div className="logo-icon-wrapper">
            <img src="/logo_icon_transparent.png" alt="Criollo 3D Emblem" className="logo-icon-img" />
          </div>
          <span className="brand-title">
            CRIOLLO <span className="blue-3d">3D</span>
          </span>
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
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          <button 
            className="action-btn" 
            onClick={onOpenSearch}
            title="Buscar productos"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <button 
            className="action-btn cart-btn" 
            onClick={onOpenCart}
            title="Ver carrito de compras"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="cart-badge animate-scale">{cartCount}</span>
            )}
          </button>

          <button 
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-menu glass">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`mobile-nav-link ${activeTab === link.id ? 'active' : ''}`}
            >
              {link.label}
            </button>
          ))}
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
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          padding: 1.1rem 0;
        }

        .header.scrolled {
          padding: 0.75rem 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }

        .logo-icon-wrapper {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .brand:hover .logo-icon-wrapper {
          transform: scale(1.08) rotate(4deg);
        }

        .logo-icon-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        .brand-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.45rem;
          letter-spacing: -0.02em;
          color: #111827;
        }

        .blue-3d {
          color: var(--primary-blue);
        }

        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 2.2rem;
        }

        .nav-link {
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.95rem;
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
          transition: transform 0.25s ease;
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
          background: rgba(0, 85, 255, 0.08);
          padding: 0.4rem 0.9rem !important;
          border-radius: 20px;
        }

        .nav-link-quote::after {
          display: none;
        }

        .sparkle-icon {
          color: var(--primary-blue);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .action-btn {
          width: 40px;
          height: 40px;
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
          font-size: 0.7rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 99px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #ffffff;
        }

        .mobile-toggle {
          display: none;
          color: #111827;
        }

        .mobile-menu {
          display: flex;
          flex-direction: column;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
          gap: 0.75rem;
        }

        .mobile-nav-link {
          text-align: left;
          font-size: 1.05rem;
          font-weight: 600;
          padding: 0.6rem 0;
          color: #374151;
        }

        .mobile-nav-link.active {
          color: var(--primary-blue);
        }

        @media (max-width: 868px) {
          .nav-desktop {
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
