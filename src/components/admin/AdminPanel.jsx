import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, FileText, Calculator, DollarSign, LogOut, ArrowLeft, ShieldCheck, Search, Bell, Plus, Settings, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_INVENTORY, INITIAL_INVOICES, INITIAL_EXPENSES } from '../../data/adminData';

import DashboardTab from './DashboardTab';
import InventoryTab from './InventoryTab';
import InvoicingTab from './InvoicingTab';
import PricingCalculatorTab from './PricingCalculatorTab';
import FinanceTab from './FinanceTab';
import SettingsTab, { DEFAULT_SOCIAL_LINKS } from './SettingsTab';
import StoreTab from './StoreTab';

export default function AdminPanel({ 
  onExitAdmin, 
  onToast,
  products = [],
  setProducts = () => {},
  featuredCollections = [],
  setFeaturedCollections = () => {},
  heroContent = {},
  setHeroContent = () => {}
}) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'inventory' | 'invoicing' | 'calculator' | 'finance' | 'settings'

  // Persistent State for Admin Data
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('criollo3d_admin_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('criollo3d_admin_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('criollo3d_admin_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [socialLinks, setSocialLinks] = useState(() => {
    const saved = localStorage.getItem('criollo3d_social_links');
    return saved ? JSON.parse(saved) : DEFAULT_SOCIAL_LINKS;
  });

  useEffect(() => {
    localStorage.setItem('criollo3d_admin_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('criollo3d_admin_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('criollo3d_admin_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Handlers for exporting from Pricing Calculator
  const handleSaveToInventory = (newProduct) => {
    const item = {
      ...newProduct,
      id: `inv-${Date.now()}`,
      status: 'ok'
    };
    setInventory(prev => [item, ...prev]);
    setActiveTab('inventory');
    if (onToast) onToast(`📦 "${item.name}" añadido al Inventario.`);
  };

  const handleCreateInvoiceFromCalc = ({ description, price }) => {
    const newDoc = {
      id: `COT-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: 'Cotización',
      clientName: 'Cliente Cotización 3D',
      clientEmail: 'cliente@ejemplo.com',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ description, qty: 1, unitPrice: price }],
      subtotal: price,
      tax: price * 0.18,
      total: price * 1.18,
      status: 'Pendiente'
    };

    setInvoices(prev => [newDoc, ...prev]);
    setActiveTab('invoicing');
    if (onToast) onToast(`📄 Cotización #${newDoc.id} generada desde la Calculadora.`);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'store', label: 'Editar Tienda', icon: Store },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'invoicing', label: 'Facturación & Cotización', icon: FileText },
    { id: 'calculator', label: 'Calculadora 3D', icon: Calculator },
    { id: 'finance', label: 'Finanzas', icon: DollarSign },
    { id: 'settings', label: 'Redes & Configuración', icon: Settings }
  ];

  return (
    <div className="quixotic-admin-root">
      
      {/* 1. Top Header Bar (Criollo3D Brand Blue Theme) */}
      <header className="quixotic-topbar">
        <div className="topbar-inner">
          
          {/* Brand Logo Image matching Home Page Header */}
          <div className="quixotic-brand" onClick={onExitAdmin} title="Volver a Tienda">
            <img src="/logo_full_transparent.png" alt="Criollo3D" className="brand-logo-img" />
          </div>

          {/* Centered Pill Nav */}
          <nav className="quixotic-pill-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-pill-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="quixotic-header-right">
            <button className="icon-circle-btn" title="Buscar">
              <Search size={18} />
            </button>
            <button className="icon-circle-btn notif-btn" title="Notificaciones">
              <Bell size={18} />
              <span className="blue-notif-dot"></span>
            </button>

            <div className="user-profile-pill">
              <img src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} alt="Admin" className="profile-img" />
            </div>

            <button className="icon-circle-btn exit-btn" onClick={onExitAdmin} title="Volver a la Tienda">
              <ArrowLeft size={18} />
            </button>
          </div>

        </div>
      </header>

      {/* 2. Main Workspace Layout with Vertical Pill Sidebar */}
      <div className="quixotic-body-wrapper">
        
        {/* Floating Vertical Icon Sidebar (Criollo3D Blue Bar) */}
        <aside className="quixotic-vertical-sidebar">
          <div className="sidebar-pill-card">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`icon-sidebar-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>

          <div className="sidebar-bottom-card">
            <button className="icon-sidebar-btn logout-sub-btn" onClick={logout} title="Cerrar Sesión">
              <LogOut size={20} />
            </button>
          </div>
        </aside>

        {/* Dynamic Content View */}
        <main className="quixotic-main-content">
          {activeTab === 'dashboard' && (
            <DashboardTab
              inventory={inventory}
              invoices={invoices}
              expenses={expenses}
              onNavigate={setActiveTab}
              onToast={onToast}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryTab
              inventory={inventory}
              setInventory={setInventory}
              onToast={onToast}
            />
          )}

          {activeTab === 'invoicing' && (
            <InvoicingTab
              invoices={invoices}
              setInvoices={setInvoices}
              onToast={onToast}
            />
          )}

          {activeTab === 'calculator' && (
            <PricingCalculatorTab
              onSaveToInventory={handleSaveToInventory}
              onCreateInvoice={handleCreateInvoiceFromCalc}
              onToast={onToast}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceTab
              expenses={expenses}
              setExpenses={setExpenses}
              invoices={invoices}
              onToast={onToast}
            />
          )}

          {activeTab === 'store' && (
            <StoreTab
              products={products}
              setProducts={setProducts}
              featuredCollections={featuredCollections}
              setFeaturedCollections={setFeaturedCollections}
              heroContent={heroContent}
              setHeroContent={setHeroContent}
              onToast={onToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              socialLinks={socialLinks}
              setSocialLinks={setSocialLinks}
              onToast={onToast}
            />
          )}
        </main>

      </div>

      <style>{`
        .quixotic-admin-root {
          min-height: 100vh;
          background: #f4f5f8;
          color: #111827;
          font-family: var(--font-body, 'Plus Jakarta Sans', system-ui, sans-serif);
          padding-bottom: 4rem;
        }

        /* Top Bar */
        .quixotic-topbar {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.85rem 2rem;
          position: sticky;
          top: 0;
          z-index: 99;
        }

        .topbar-inner {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .quixotic-brand {
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

        /* Pill Nav */
        .quixotic-pill-nav {
          display: flex;
          background: #ebf1ff;
          padding: 4px;
          border-radius: 99px;
          gap: 4px;
        }

        .nav-pill-item {
          padding: 0.55rem 1.25rem;
          border-radius: 99px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #4b5563;
          transition: all 0.2s ease;
          font-family: var(--font-body);
        }

        .nav-pill-item:hover {
          color: var(--primary-blue, #0055ff);
        }

        .nav-pill-item.active {
          background: var(--primary-blue, #0055ff);
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 85, 255, 0.25);
        }

        .quixotic-header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .icon-circle-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ebf1ff;
          color: #4b5563;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          position: relative;
        }

        .icon-circle-btn:hover {
          background: #dbeafe;
          color: var(--primary-blue, #0055ff);
        }

        .blue-notif-dot {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 8px;
          height: 8px;
          background: var(--primary-blue, #0055ff);
          border-radius: 50%;
          border: 2px solid #ffffff;
        }

        .user-profile-pill {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--primary-blue, #0055ff);
        }

        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Body Wrapper */
        .quixotic-body-wrapper {
          display: flex;
          gap: 1.5rem;
          max-width: 1440px;
          margin: 1.75rem auto 0 auto;
          padding: 0 1.5rem;
        }

        /* Vertical Icon Sidebar */
        .quixotic-vertical-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: sticky;
          top: 90px;
          height: fit-content;
        }

        .sidebar-pill-card, .sidebar-bottom-card {
          background: #ffffff;
          border-radius: 28px;
          padding: 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #e5e7eb;
        }

        .icon-sidebar-btn {
          width: 44px;
          height: 44px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .icon-sidebar-btn:hover {
          background: #ebf1ff;
          color: var(--primary-blue, #0055ff);
        }

        .icon-sidebar-btn.active {
          background: var(--primary-blue, #0055ff);
          color: #ffffff;
          box-shadow: 0 6px 16px rgba(0, 85, 255, 0.3);
        }

        .logout-sub-btn:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        /* Main Content Area */
        .quixotic-main-content {
          flex: 1;
          min-width: 0;
        }

        @media (max-width: 900px) {
          .quixotic-pill-nav {
            display: none;
          }
          .quixotic-body-wrapper {
            flex-direction: column;
          }
          .quixotic-vertical-sidebar {
            flex-direction: row;
            position: relative;
            top: 0;
          }
          .sidebar-pill-card {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}
