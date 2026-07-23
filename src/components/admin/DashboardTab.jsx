import React, { useState } from 'react';
import { DollarSign, FileText, Package, TrendingUp, Calendar, Plus, ArrowUpRight, ArrowDownRight, Printer, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DashboardTab({ inventory, invoices, expenses, onNavigate }) {
  const [chartTimeframe, setChartTimeframe] = useState('Mensual');
  const [hoveredBar, setHoveredBar] = useState(null);

  // Calculations
  const totalRevenue = invoices
    .filter(inv => inv.status === 'Pagada' || inv.status === 'Facturada')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingQuotes = invoices.filter(inv => inv.type === 'Cotización' || inv.status === 'Pendiente').length;

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  const lowStockItems = inventory.filter(item => item.stock <= item.minStock);

  // Professional Minimal Bar Chart Datasets
  const monthlyData = [
    { label: 'ENE', sales: 240, printHours: 120 },
    { label: 'FEB', sales: 380, printHours: 185 },
    { label: 'MAR', sales: 310, printHours: 150 },
    { label: 'ABR', sales: 580, printHours: 248, isPeak: true },
    { label: 'MAY', sales: 420, printHours: 210 },
    { label: 'JUN', sales: 490, printHours: 230 }
  ];

  const yearlyData = [
    { label: '2021', sales: 1850, printHours: 920 },
    { label: '2022', sales: 2900, printHours: 1400 },
    { label: '2023', sales: 3400, printHours: 1650 },
    { label: '2024', sales: 4200, printHours: 2100 },
    { label: '2025', sales: 5100, printHours: 2550 },
    { label: '2026', sales: 6800, printHours: 3200, isPeak: true }
  ];

  const isMonthly = chartTimeframe === 'Mensual';
  const activeData = isMonthly ? monthlyData : yearlyData;
  const maxVal = isMonthly ? 600 : 7000;
  const gridLabels = isMonthly 
    ? ['$600', '$450', '$300', '$150', '$0'] 
    : ['$7K', '$5.2K', '$3.5K', '$1.7K', '$0'];

  return (
    <div className="simple-dashboard-root animate-fade-in">
      
      {/* 1. Header Row */}
      <div className="simple-hero-header">
        <h1 className="simple-hero-title">
          Bienvenido, <span className="text-muted-dark">Harold</span>
        </h1>

        <div className="simple-hero-actions">
          <button className="simple-primary-btn" onClick={() => onNavigate('invoicing')}>
            <Plus size={16} /> Nueva Cotización
          </button>
        </div>
      </div>

      {/* 2. 4 Essential KPI Cards */}
      <div className="simple-metrics-grid">
        
        {/* Metric 1: Ventas Totales */}
        <div className="simple-metric-card">
          <div className="metric-top">
            <span className="metric-label">VENTAS TOTALES</span>
            <DollarSign size={16} className="text-blue" />
          </div>
          <h2 className="metric-number">RD$ {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
          <span className="metric-trend positive"><ArrowUpRight size={13} /> +18.4% este mes</span>
        </div>

        {/* Metric 2: Cotizaciones Pendientes */}
        <div className="simple-metric-card clickable" onClick={() => onNavigate('invoicing')}>
          <div className="metric-top">
            <span className="metric-label">COTIZACIONES ACTIVAS</span>
            <FileText size={16} className="text-amber" />
          </div>
          <h2 className="metric-number">{pendingQuotes} por revisar</h2>
          <span className="metric-trend neutral">Procesar pendientes →</span>
        </div>

        {/* Metric 3: Horas Impresión */}
        <div className="simple-metric-card clickable" onClick={() => onNavigate('calculator')}>
          <div className="metric-top">
            <span className="metric-label">HORAS IMPRESIÓN 3D</span>
            <Printer size={16} className="text-indigo" />
          </div>
          <h2 className="metric-number">248.5 Horas</h2>
          <span className="metric-trend info">8 impresoras activas</span>
        </div>

        {/* Metric 4: Utilidad Neta */}
        <div className="simple-metric-card">
          <div className="metric-top">
            <span className="metric-label">UTILIDAD NETA</span>
            <TrendingUp size={16} className="text-emerald" />
          </div>
          <h2 className={`metric-number ${netProfit >= 0 ? 'text-blue' : 'text-rose'}`}>
            RD$ {netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <span className={`metric-trend ${netProfit >= 0 ? 'positive' : 'negative'}`}>
            {netProfit >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} Margen operativo
          </span>
        </div>

      </div>

      {/* 3. Middle Section: Minimal Clean Bar Chart + Critical Stock */}
      <div className="simple-middle-grid">
        
        {/* Minimal Clean Bar Chart */}
        <div className="simple-card">
          <div className="simple-card-header">
            <h3 className="simple-card-title">
              {isMonthly ? 'Ventas Mensuales ($)' : 'Ventas Anuales ($)'}
            </h3>

            <div className="simple-tf-toggle">
              <button 
                className={`tf-btn-sm ${chartTimeframe === 'Mensual' ? 'active' : ''}`}
                onClick={() => setChartTimeframe('Mensual')}
              >
                Mensual
              </button>
              <button 
                className={`tf-btn-sm ${chartTimeframe === 'Anual' ? 'active' : ''}`}
                onClick={() => setChartTimeframe('Anual')}
              >
                Anual
              </button>
            </div>
          </div>

          {/* Clean Executive Chart */}
          <div className="simple-chart-area">
            <div className="chart-grid-bg">
              {gridLabels.map((lbl, idx) => (
                <div key={idx} className="grid-row"><span className="grid-num">{lbl}</span></div>
              ))}
            </div>

            <div className="bars-layer">
              {activeData.map((item, idx) => {
                const heightPct = (item.sales / maxVal) * 100;
                const isHovered = hoveredBar === idx;

                return (
                  <div 
                    key={item.label} 
                    className="bar-item-col"
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {(item.isPeak || isHovered) && (
                      <div className="simple-tooltip animate-fade-in">
                        ${item.sales.toLocaleString()}
                      </div>
                    )}

                    <div className="bar-track">
                      <div 
                        className={`bar-fill-blue ${item.isPeak ? 'peak' : ''}`} 
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>

                    <span className={`bar-month-text ${item.isPeak ? 'active' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Minimal Stock Alert */}
        <div className="simple-card">
          <div className="simple-card-header">
            <h3 className="simple-card-title flex-center gap-2">
              <AlertTriangle size={17} className="text-amber" /> Insumos en Alerta
            </h3>
            <button className="simple-link-btn" onClick={() => onNavigate('inventory')}>
              Ver Stock →
            </button>
          </div>

          <div className="simple-stock-list">
            {lowStockItems.length === 0 ? (
              <div className="empty-stock">
                <CheckCircle2 size={24} className="text-blue" />
                <span>Insumos en nivel correcto</span>
              </div>
            ) : (
              lowStockItems.map(item => (
                <div key={item.id} className="simple-stock-row">
                  <div>
                    <span className="stock-title">{item.name}</span>
                    <span className="stock-sku">SKU: {item.sku}</span>
                  </div>
                  <span className={`simple-tag ${item.stock === 0 ? 'out' : 'low'}`}>
                    {item.stock === 0 ? 'Agotado' : `${item.stock} unids`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 4. Minimal Recent Invoices Table */}
      <div className="simple-card mt-4">
        <div className="simple-card-header">
          <h3 className="simple-card-title">Cotizaciones y Pedidos Recientes</h3>
          <button className="simple-link-btn" onClick={() => onNavigate('invoicing')}>
            Ver Todo →
          </button>
        </div>

        <div className="table-responsive">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Detalle del Pedido 3D</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className="text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td><code>{inv.id}</code></td>
                  <td>
                    <div className="client-flex">
                      <div className="client-avatar-sm">{inv.clientName.charAt(0)}</div>
                      <span className="font-600">{inv.clientName}</span>
                    </div>
                  </td>
                  <td className="color-slate-600">{inv.items[0]?.description || 'Impresión 3D'}</td>
                  <td>{inv.date}</td>
                  <td>
                    <span className={`simple-status ${inv.status.toLowerCase()}`}>
                      ● {inv.status}
                    </span>
                  </td>
                  <td className="text-right font-700">${inv.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .simple-dashboard-root {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          font-family: var(--font-body, system-ui, sans-serif);
        }

        /* Hero Header */
        .simple-hero-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .simple-hero-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.85rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.03em;
        }

        .text-muted-dark {
          color: #6b7280;
          font-weight: 500;
        }

        .simple-primary-btn {
          background: var(--primary-blue, #0055ff);
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.55rem 1.15rem;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 85, 255, 0.2);
        }

        .simple-primary-btn:hover {
          background: #0040d0;
        }

        /* 4 Metrics Grid */
        .simple-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .simple-metric-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 1.15rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s ease;
        }

        .simple-metric-card.clickable {
          cursor: pointer;
        }

        .simple-metric-card.clickable:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1;
        }

        .metric-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #6b7280;
          letter-spacing: 0.04em;
        }

        .text-blue { color: #0055ff; }
        .text-amber { color: #d97706; }
        .text-indigo { color: #4f46e5; }
        .text-emerald { color: #059669; }
        .text-rose { color: #e11d48; }

        .metric-number {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.45rem;
          font-weight: 900;
          color: #111827;
          margin-bottom: 0.3rem;
          letter-spacing: -0.02em;
        }

        .metric-trend {
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .metric-trend.positive { color: #059669; }
        .metric-trend.negative { color: #e11d48; }
        .metric-trend.neutral { color: #d97706; }
        .metric-trend.info { color: #4f46e5; }

        /* Middle Grid Layout */
        .simple-middle-grid {
          display: grid;
          grid-template-columns: 1.7fr 1fr;
          gap: 1.25rem;
        }

        .simple-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }

        .simple-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .simple-card-title {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 800;
          color: #111827;
        }

        .simple-tf-toggle {
          display: flex;
          background: #ebf1ff;
          padding: 3px;
          border-radius: 99px;
        }

        .tf-btn-sm {
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #6b7280;
          border-radius: 99px;
        }

        .tf-btn-sm.active {
          background: var(--primary-blue, #0055ff);
          color: #ffffff;
        }

        .simple-link-btn {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-blue, #0055ff);
        }

        /* Simple Clean Executive Bar Chart */
        .simple-chart-area {
          position: relative;
          height: 200px;
          margin-top: 1.5rem;
          padding-left: 45px;
        }

        .chart-grid-bg {
          position: absolute;
          inset: 0;
          left: 45px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          pointer-events: none;
        }

        .grid-row {
          border-bottom: 1px dashed #f1f5f9;
          height: 0;
          position: relative;
        }

        .grid-num {
          position: absolute;
          left: -40px;
          top: -7px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #9ca3af;
        }

        .bars-layer {
          position: relative;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          z-index: 2;
        }

        .bar-item-col {
          position: relative;
          width: 12%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .simple-tooltip {
          position: absolute;
          top: -32px;
          background: #111827;
          color: #ffffff;
          padding: 0.25rem 0.55rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .bar-track {
          width: 100%;
          max-width: 32px;
          height: 100%;
          display: flex;
          align-items: flex-end;
        }

        .bar-fill-blue {
          width: 100%;
          background: #3b82f6;
          border-radius: 8px 8px 0 0;
          transition: height 0.4s ease, background 0.2s ease;
        }

        .bar-fill-blue.peak {
          background: var(--primary-blue, #0055ff);
        }

        .bar-item-col:hover .bar-fill-blue {
          background: #0040d0;
        }

        .bar-month-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        .bar-month-text.active {
          color: var(--primary-blue, #0055ff);
          font-weight: 800;
        }

        /* Stock List */
        .simple-stock-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .simple-stock-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background: #fffbeb;
          border-left: 3px solid #f59e0b;
          border-radius: 10px;
        }

        .stock-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #92400e;
          display: block;
        }

        .stock-sku {
          font-size: 0.7rem;
          color: #b45309;
        }

        .simple-tag {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }
        .simple-tag.low { background: #fef3c7; color: #92400e; }
        .simple-tag.out { background: #fee2e2; color: #991b1b; }

        /* Simple Table */
        .simple-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .simple-table th {
          text-align: left;
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 700;
          text-transform: uppercase;
          padding: 0.65rem 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f8f9fb;
        }

        .simple-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #f4f5f8;
          color: #374151;
        }

        .client-flex {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .client-avatar-sm {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #ebf1ff;
          color: var(--primary-blue, #0055ff);
          font-weight: 800;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .simple-status {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 99px;
        }

        .simple-status.pagada { background: #d1fae5; color: #065f46; }
        .simple-status.pendiente { background: #fef3c7; color: #92400e; }
        .simple-status.facturada { background: #ebf1ff; color: var(--primary-blue, #0055ff); }

        @media (max-width: 1024px) {
          .simple-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .simple-middle-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .simple-hero-header {
            flex-direction: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            align-items: center;
          }
          .simple-hero-title {
            font-size: 1.4rem;
          }
          .simple-metrics-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .simple-card {
            padding: 1rem;
            border-radius: 16px;
          }
          .simple-chart-area {
            height: 170px;
            padding-left: 35px;
            margin-top: 1rem;
          }
          .grid-num {
            left: -32px;
            font-size: 0.65rem;
          }
          .bar-month-text {
            font-size: 0.68rem;
          }
        }
      `}</style>
    </div>
  );
}
