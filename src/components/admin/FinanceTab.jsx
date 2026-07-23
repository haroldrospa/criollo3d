import React, { useState } from 'react';
import { DollarSign, Plus, ArrowUpRight, ArrowDownRight, CreditCard, PieChart, Calendar, Tag, Trash2, ArrowLeft, Search, Save, X, Wallet } from 'lucide-react';

export default function FinanceTab({ expenses, setExpenses, invoices, onToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // View state: 'list' | 'form'
  const [currentView, setCurrentView] = useState('list');

  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'Materia Prima',
    amount: 50.00,
    paymentMethod: 'Transferencia',
    date: new Date().toISOString().split('T')[0]
  });

  // Calculate Totals
  const totalRevenue = invoices
    .filter(inv => inv.status === 'Pagada' || inv.status === 'Facturada')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const categories = ['all', 'Materia Prima', 'Energía y Servicios', 'Mantenimiento', 'Software y Licencias', 'Otros'];

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || exp.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDeleteExpense = (id, desc) => {
    if (window.confirm(`¿Desea eliminar el registro de gasto "${desc}"?`)) {
      setExpenses(prev => prev.filter(e => e.id !== id));
      if (onToast) onToast(`🗑️ Gasto "${desc}" eliminado.`);
    }
  };

  const handleOpenForm = () => {
    setNewExpense({
      description: '',
      category: 'Materia Prima',
      amount: 50.00,
      paymentMethod: 'Transferencia',
      date: new Date().toISOString().split('T')[0]
    });
    setCurrentView('form');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.description || Number(newExpense.amount) <= 0) return;

    const created = {
      ...newExpense,
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      amount: Number(newExpense.amount)
    };

    setExpenses(prev => [created, ...prev]);
    setCurrentView('list');
    if (onToast) onToast(`💰 Gasto "${created.description}" registrado por RD$ ${created.amount.toFixed(2)}.`);
  };

  // -------------------------------------------------------------
  // VIEW 1: DEDICATED FORM VIEW FOR REGISTERING EXPENSE (NO POPUP)
  // -------------------------------------------------------------
  if (currentView === 'form') {
    return (
      <div className="pro-finance-form-page animate-fade-in">
        
        {/* Top Header */}
        <div className="form-page-header">
          <button className="back-btn" onClick={() => setCurrentView('list')}>
            <ArrowLeft size={18} /> Volver a Finanzas
          </button>
          <h1 className="form-page-title">Registrar Nuevo Gasto / Egreso</h1>
          <p className="form-page-sub">Complete la información financiera del egreso operativo del taller</p>
        </div>

        {/* Form Container */}
        <div className="form-card-container">
          <form onSubmit={handleAddSubmit} className="finance-form-body">
            
            <div className="form-section-box">
              <span className="section-tag font-bold text-gray-500">📌 DATOS DEL EGRESO Y CATEGORÍA</span>

              <div className="grid-2-col mt-3">
                <div className="field-box full-width">
                  <label className="field-lbl">Descripción del Gasto</label>
                  <input
                    type="text"
                    className="field-input-text"
                    placeholder="Ej: Compra de 10 Bobinas PLA y 4 Resinas 8K"
                    value={newExpense.description}
                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-2-col mt-3">
                <div className="field-box">
                  <label className="field-lbl">Categoría del Egreso</label>
                  <select
                    className="field-input-select"
                    value={newExpense.category}
                    onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                  >
                    <option value="Materia Prima">Materia Prima (Filamentos, Resinas)</option>
                    <option value="Energía y Servicios">Energía y Servicios Eléctricos</option>
                    <option value="Mantenimiento">Mantenimiento y Repuestos Impresora</option>
                    <option value="Software y Licencias">Software, CAD y Licencias Cloud</option>
                    <option value="Otros">Otros Gastos Operativos</option>
                  </select>
                </div>

                <div className="field-box">
                  <label className="field-lbl">Monto (RD$ DOP)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="field-input-text"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-2-col mt-3">
                <div className="field-box">
                  <label className="field-lbl">Método de Pago Utilizado</label>
                  <select
                    className="field-input-select"
                    value={newExpense.paymentMethod}
                    onChange={e => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                  >
                    <option value="Transferencia">Transferencia Bancaria</option>
                    <option value="Tarjeta de Crédito">Tarjeta de Crédito / Débito</option>
                    <option value="Efectivo">Efectivo en Taller</option>
                    <option value="Débito Automático">Débito Automático</option>
                  </select>
                </div>

                <div className="field-box">
                  <label className="field-lbl">Fecha del Registro</label>
                  <input
                    type="date"
                    className="field-input-text"
                    value={newExpense.date}
                    onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                    required
                  />
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="form-actions-row">
              <button type="button" className="btn-cancel" onClick={() => setCurrentView('list')}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary-blue">
                <Save size={16} /> Guardar Egreso (RD$ {Number(newExpense.amount || 0).toFixed(2)})
              </button>
            </div>

          </form>
        </div>

        {/* Form Styles */}
        <style>{`
          .pro-finance-form-page {
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            font-family: var(--font-body, sans-serif);
          }

          .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--primary-blue, #0055ff);
            margin-bottom: 0.5rem;
          }

          .form-page-title {
            font-family: var(--font-heading, sans-serif);
            font-size: 1.85rem;
            font-weight: 800;
            color: #111827;
          }

          .form-page-sub {
            font-size: 0.85rem;
            color: #6b7280;
            margin-top: 0.15rem;
          }

          .form-card-container {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          }

          .finance-form-body {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-section-box {
            background: #f8f9fb;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 1.35rem 1.5rem;
          }

          .section-tag {
            font-size: 0.75rem;
            font-weight: 800;
            color: #6b7280;
            letter-spacing: 0.04em;
          }

          .grid-2-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          }

          .field-box {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          }

          .field-box.full-width {
            grid-column: span 2;
          }

          .field-lbl {
            font-size: 0.8rem;
            font-weight: 700;
            color: #374151;
          }

          .field-input-text, .field-input-select {
            width: 100%;
            padding: 0.7rem 0.95rem;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            font-size: 0.88rem;
            outline: none;
            background: #ffffff;
            font-family: var(--font-body);
          }

          .field-input-text:focus, .field-input-select:focus {
            border-color: var(--primary-blue, #0055ff);
            box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.12);
          }

          .form-actions-row {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.85rem;
            padding-top: 1rem;
            border-top: 1px solid #f4f5f8;
          }

          .btn-cancel {
            padding: 0.7rem 1.4rem;
            border-radius: 99px;
            font-size: 0.88rem;
            font-weight: 700;
            color: #4b5563;
            background: #f4f5f8;
          }

          .btn-primary-blue {
            padding: 0.7rem 1.6rem;
            border-radius: 99px;
            font-size: 0.88rem;
            font-weight: 700;
            color: #ffffff;
            background: var(--primary-blue, #0055ff);
            display: flex;
            align-items: center;
            gap: 0.4rem;
            box-shadow: 0 4px 14px rgba(0, 85, 255, 0.25);
          }
        `}</style>

      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: MAIN LEDGER & FINANCIAL KPIS LIST VIEW
  // -------------------------------------------------------------
  return (
    <div className="pro-finance-list-page animate-fade-in">
      
      {/* Executive Header Bar */}
      <div className="finance-top-bar">
        <div>
          <h2 className="finance-main-title">
            <Wallet size={22} className="text-blue-icon" /> Control de Finanzas y Libro Contable
          </h2>
          <p className="finance-main-sub">Registro detallado de flujo de caja, gastos operativos y utilidad neta del taller</p>
        </div>

        <button className="add-expense-btn" onClick={handleOpenForm}>
          <Plus size={18} /> Registrar Nuevo Gasto
        </button>
      </div>

      {/* 3 Executive Financial P&L Cards */}
      <div className="finance-kpis-grid">
        
        {/* Revenue */}
        <div className="finance-kpi-card">
          <div className="kpi-icon-row">
            <div className="icon-circle bg-emerald">
              <ArrowUpRight size={20} />
            </div>
            <span className="kpi-pill-badge pill-emerald">Ingresos</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">INGRESOS TOTALES (VENTAS)</span>
            <h3 className="kpi-amount text-emerald">RD$ {totalRevenue.toFixed(2)}</h3>
            <span className="kpi-subtext">Comprobantes pagados y facturados</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="finance-kpi-card">
          <div className="kpi-icon-row">
            <div className="icon-circle bg-rose">
              <ArrowDownRight size={20} />
            </div>
            <span className="kpi-pill-badge pill-rose">Egresos</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">GASTOS TOTALES REGISTRADOS</span>
            <h3 className="kpi-amount text-rose">RD$ {totalExpenses.toFixed(2)}</h3>
            <span className="kpi-subtext">{expenses.length} egresos contabilizados</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="finance-kpi-card">
          <div className="kpi-icon-row">
            <div className="icon-circle bg-blue">
              <DollarSign size={20} />
            </div>
            <span className="kpi-pill-badge pill-blue">Utilidad Neta</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">GANANCIA NETA (UTILIDAD)</span>
            <h3 className={`kpi-amount ${netProfit >= 0 ? 'text-blue' : 'text-rose'}`}>
              RD$ {netProfit.toFixed(2)}
            </h3>
            <span className="kpi-subtext">
              Margen Neto: {totalRevenue > 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>

      </div>

      {/* Search & Category Filter Pills */}
      <div className="finance-filter-card">
        <div className="filter-left-search">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Buscar por descripción del gasto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Todas las Categorías' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Ledger Table */}
      <div className="finance-table-card">
        <div className="table-card-header">
          <h3 className="table-title">Historial de Egresos y Gastos de Operación</h3>
          <p className="table-subtitle">Movimientos financieros registrados en el sistema contable</p>
        </div>

        <div className="table-wrapper">
          <table className="finance-ledger-table">
            <thead>
              <tr>
                <th>N° Registro</th>
                <th>Fecha</th>
                <th>Descripción del Egreso</th>
                <th>Categoría</th>
                <th>Método de Pago</th>
                <th>Monto (RD$)</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    No se encontraron gastos registrados en esta categoría.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp.id}>
                    <td><code className="exp-id-code">{exp.id}</code></td>
                    <td className="date-cell">{exp.date}</td>
                    <td><strong className="exp-desc">{exp.description}</strong></td>
                    <td><span className="category-pill-tag">{exp.category}</span></td>
                    <td><span className="payment-pill-tag">{exp.paymentMethod}</span></td>
                    <td><strong className="amount-rose">-RD$ {exp.amount.toFixed(2)}</strong></td>
                    <td className="text-right">
                      <button
                        className="delete-exp-btn"
                        onClick={() => handleDeleteExpense(exp.id, exp.description)}
                        title="Eliminar gasto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* List CSS */}
      <style>{`
        .pro-finance-list-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          font-family: var(--font-body, sans-serif);
        }

        .finance-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 1.25rem 1.75rem;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .finance-main-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.45rem;
          font-weight: 800;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .text-blue-icon {
          color: var(--primary-blue, #0055ff);
        }

        .finance-main-sub {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 0.15rem;
        }

        .add-expense-btn {
          padding: 0.7rem 1.4rem;
          border-radius: 99px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
          background: var(--primary-blue, #0055ff);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          box-shadow: 0 4px 14px rgba(0, 85, 255, 0.25);
          transition: all 0.2s ease;
        }

        .add-expense-btn:hover {
          background: #0040d0;
          transform: translateY(-1px);
        }

        .finance-kpis-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 900px) {
          .finance-kpis-grid {
            grid-template-columns: 1fr;
          }
        }

        .finance-kpi-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 1.35rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .kpi-icon-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .icon-circle {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-circle.bg-emerald {
          background: #d1fae5;
          color: #10b981;
        }

        .icon-circle.bg-rose {
          background: #ffe4e6;
          color: #f43f5e;
        }

        .icon-circle.bg-blue {
          background: #dbeafe;
          color: var(--primary-blue, #0055ff);
        }

        .kpi-pill-badge {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.25rem 0.7rem;
          border-radius: 99px;
        }

        .pill-emerald { background: #ecfdf5; color: #059669; }
        .pill-rose { background: #fff1f2; color: #e11d48; }
        .pill-blue { background: #ebf1ff; color: var(--primary-blue, #0055ff); }

        .kpi-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .kpi-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #9ca3af;
          letter-spacing: 0.04em;
        }

        .kpi-amount {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.85rem;
          font-weight: 900;
          letter-spacing: -0.03em;
        }

        .kpi-amount.text-emerald { color: #10b981; }
        .kpi-amount.text-rose { color: #f43f5e; }
        .kpi-amount.text-blue { color: var(--primary-blue, #0055ff); }

        .kpi-subtext {
          font-size: 0.8rem;
          color: #6b7280;
        }

        /* Filter Card */
        .finance-filter-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 1.15rem 1.35rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .filter-left-search {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 260px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: #9ca3af;
        }

        .filter-search-input {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.6rem;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.85rem;
          background: #f8f9fb;
          outline: none;
        }

        .filter-category-pills {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .filter-pill {
          padding: 0.45rem 0.9rem;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #6b7280;
          background: #f3f4f6;
          transition: all 0.2s ease;
        }

        .filter-pill.active {
          background: var(--primary-blue, #0055ff);
          color: #ffffff;
        }

        /* Ledger Table Card */
        .finance-table-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .table-card-header {
          margin-bottom: 1.15rem;
        }

        .table-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.2rem;
          font-weight: 800;
          color: #111827;
        }

        .table-subtitle {
          font-size: 0.82rem;
          color: #6b7280;
          margin-top: 0.15rem;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .finance-ledger-table {
          width: 100%;
          border-collapse: collapse;
        }

        .finance-ledger-table th {
          font-size: 0.78rem;
          font-weight: 700;
          color: #6b7280;
          text-align: left;
          padding: 0.75rem 0.85rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f8f9fb;
        }

        .finance-ledger-table td {
          padding: 0.85rem;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.88rem;
        }

        .exp-id-code {
          font-family: monospace;
          background: #f3f4f6;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          font-size: 0.82rem;
          color: #374151;
        }

        .date-cell {
          color: #6b7280;
        }

        .exp-desc {
          color: #111827;
        }

        .category-pill-tag {
          background: #ebf1ff;
          color: var(--primary-blue, #0055ff);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: 99px;
        }

        .payment-pill-tag {
          background: #f3f4f6;
          color: #4b5563;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 99px;
        }

        .amount-rose {
          color: #f43f5e;
          font-weight: 800;
        }

        .delete-exp-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #fee2e2;
          color: #dc2626;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .delete-exp-btn:hover {
          background: #fca5a5;
        }

        .empty-table-cell {
          text-align: center;
          padding: 2rem;
          color: #9ca3af;
        }

        @media (max-width: 1024px) {
          .finance-kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .finance-split-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 640px) {
          .finance-kpi-grid { grid-template-columns: 1fr; gap: 0.75rem; }
          .finance-hero-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .finance-card { padding: 1rem; border-radius: 16px; }
          .form-grid-2-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  );
}

