import React, { useState } from 'react';
import { Calculator, DollarSign, Zap, Clock, Weight, Wrench, Percent, Save, FileText, ArrowRight, ShieldAlert, Sparkles, Layers, CheckCircle } from 'lucide-react';
import { PRINT_CALCULATOR_DEFAULTS } from '../../data/adminData';

export default function PricingCalculatorTab({ onSaveToInventory, onCreateInvoice, onToast }) {
  const [productName, setProductName] = useState('Prototipo 3D Personalizado (PLA Pro)');
  const [params, setParams] = useState(PRINT_CALCULATOR_DEFAULTS);

  // Dynamic calculations
  const materialCost = (params.filamentGrams / 1000) * params.filamentCostPerKg;
  const powerCost = params.printTimeHours * params.powerKwPerHour * params.kwhElectricityCost;
  const machineWearCost = params.printTimeHours * params.machineHourlyDepreciation;
  const laborCost = params.laborHours * params.laborHourlyRate;
  
  const baseSubtotal = materialCost + powerCost + machineWearCost + laborCost;
  const riskCost = baseSubtotal * (params.failureRiskRatePercent / 100);
  
  // Direct Unit Cost (COGS)
  const totalUnitCost = baseSubtotal + riskCost;
  
  // Suggested Selling Price: Cost * (1 + Margin%)
  const marginMultiplier = 1 + (params.desiredMarginPercent / 100);
  const suggestedPrice = totalUnitCost * marginMultiplier;
  const profitMarginDollars = suggestedPrice - totalUnitCost;

  const handleParamChange = (key, value) => {
    setParams(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const handleExportToInventory = () => {
    if (onSaveToInventory) {
      onSaveToInventory({
        sku: `PRD-3D-${Math.floor(100 + Math.random() * 900)}`,
        name: productName,
        category: 'Productos Terminados',
        stock: 1,
        minStock: 1,
        unitCost: Number(totalUnitCost.toFixed(2)),
        unitPrice: Number(suggestedPrice.toFixed(2)),
        supplier: 'Calculadora Criollo3D'
      });
      if (onToast) onToast(`📦 "${productName}" guardado en Inventario (RD$ ${suggestedPrice.toFixed(2)}).`);
    }
  };

  const handleExportToInvoice = () => {
    if (onCreateInvoice) {
      onCreateInvoice({
        description: `Impresión 3D: ${productName} (${params.filamentGrams}g, ${params.printTimeHours}h)`,
        price: Number(suggestedPrice.toFixed(2))
      });
      if (onToast) onToast(`📄 Cotización enviada al cotizador (RD$ ${suggestedPrice.toFixed(2)}).`);
    }
  };

  return (
    <div className="pro-calc-container animate-fade-in">
      
      {/* Executive Top Bar */}
      <div className="calc-top-bar">
        <div>
          <h2 className="calc-main-title">
            <Calculator size={22} className="text-blue-icon" /> Calculadora de Precio de Productos 3D
          </h2>
          <p className="calc-main-subtitle">
            Matriz de costos de filamento, resina, energía, depreciación de impresoras y beneficio comercial.
          </p>
        </div>

        <div className="calc-top-actions">
          <button className="top-btn-secondary" onClick={handleExportToInventory}>
            <Save size={16} /> Guardar en Inventario
          </button>
          <button className="top-btn-primary" onClick={handleExportToInvoice}>
            <FileText size={16} /> Crear Cotización Directa
          </button>
        </div>
      </div>

      {/* 2-Column Grid Workspace */}
      <div className="calc-workspace-grid">
        
        {/* Left Column: Parameter Form */}
        <div className="calc-card-panel">
          
          <div className="card-section-header">
            <h3 className="section-title">
              <Layers size={18} className="text-blue-icon" /> Parámetros de Impresión y Manufactura 3D
            </h3>
            <p className="section-subtitle">Ajuste las especificaciones técnicas para calcular el COGS unitario</p>
          </div>

          <div className="calc-form-body">
            
            {/* Product Name Input */}
            <div className="field-group full-width">
              <label className="field-label">Nombre del Modelo / Pieza 3D</label>
              <input
                type="text"
                className="input-text-main"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="Ej. Carcasa Engranaje Industrial Nylon"
              />
            </div>

            {/* Section 1: Material */}
            <div className="params-subcard mt-2">
              <span className="subcard-tag">📦 1. INSUMO DE MATERIAL (FILAMENTO / RESINA)</span>
              
              <div className="grid-2-col mt-2">
                <div className="field-group">
                  <label className="field-label">Peso de la Pieza (Gramos)</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      className="input-num"
                      value={params.filamentGrams}
                      onChange={e => handleParamChange('filamentGrams', e.target.value)}
                    />
                    <span className="unit-badge">g</span>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Costo Carrete / Kg ($ / Kg)</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      className="input-num"
                      value={params.filamentCostPerKg}
                      onChange={e => handleParamChange('filamentCostPerKg', e.target.value)}
                    />
                    <span className="unit-badge">$/Kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Energy & Machine */}
            <div className="params-subcard mt-2">
              <span className="subcard-tag">⚡ 2. ENERGÍA Y DESGASTE DE MÁQUINA</span>
              
              <div className="grid-2-col mt-2">
                <div className="field-group">
                  <label className="field-label">Tiempo Impresión (Horas)</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      className="input-num"
                      value={params.printTimeHours}
                      onChange={e => handleParamChange('printTimeHours', e.target.value)}
                    />
                    <span className="unit-badge">hrs</span>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Costo Energía ($ / kWh)</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="input-num"
                      value={params.kwhElectricityCost}
                      onChange={e => handleParamChange('kwhElectricityCost', e.target.value)}
                    />
                    <span className="unit-badge">$/kWh</span>
                  </div>
                </div>
              </div>

              <div className="grid-2-col mt-3">
                <div className="field-group">
                  <label className="field-label">Depreciación Máquina ($ / Hora)</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      className="input-num"
                      value={params.machineHourlyDepreciation}
                      onChange={e => handleParamChange('machineHourlyDepreciation', e.target.value)}
                    />
                    <span className="unit-badge">$/hr</span>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Consumo Impresora (kW)</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="0.05"
                      min="0.05"
                      className="input-num"
                      value={params.powerKwPerHour}
                      onChange={e => handleParamChange('powerKwPerHour', e.target.value)}
                    />
                    <span className="unit-badge">kW</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Labor & Post-process */}
            <div className="params-subcard mt-2">
              <span className="subcard-tag">🛠️ 3. MANO DE OBRA Y POST-PROCESADO</span>
              
              <div className="grid-2-col mt-2">
                <div className="field-group">
                  <label className="field-label">Tiempo Técnico (Horas)</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="input-num"
                      value={params.laborHours}
                      onChange={e => handleParamChange('laborHours', e.target.value)}
                    />
                    <span className="unit-badge">hrs</span>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Tarifa Hora ($ / Hora)</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      className="input-num"
                      value={params.laborHourlyRate}
                      onChange={e => handleParamChange('laborHourlyRate', e.target.value)}
                    />
                    <span className="unit-badge">$/hr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Risk & Margin */}
            <div className="params-subcard mt-2">
              <span className="subcard-tag">📈 4. FACTOR DE RIESGO Y MARGEN DESEADO</span>
              
              <div className="grid-2-col mt-2">
                <div className="field-group">
                  <label className="field-label">Riesgo de Falla (%)</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="50"
                      className="input-num"
                      value={params.failureRiskRatePercent}
                      onChange={e => handleParamChange('failureRiskRatePercent', e.target.value)}
                    />
                    <span className="unit-badge">%</span>
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Margen Deseado (%)</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      step="5"
                      min="10"
                      max="300"
                      className="input-num"
                      value={params.desiredMarginPercent}
                      onChange={e => handleParamChange('desiredMarginPercent', e.target.value)}
                    />
                    <span className="unit-badge">%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Breakdown & Featured Selling Price */}
        <div className="calc-results-panel">
          
          {/* Breakdown Card */}
          <div className="breakdown-card">
            <div className="breakdown-header">
              <h3 className="breakdown-title">
                <Sparkles size={18} className="text-amber-icon" /> Desglose de Costos de Fabricación
              </h3>
            </div>

            <div className="breakdown-rows">
              <div className="b-row">
                <span>Costo de Material ({params.filamentGrams}g)</span>
                <strong>RD$ {materialCost.toFixed(2)}</strong>
              </div>

              <div className="b-row">
                <span>Consumo Eléctrico ({params.printTimeHours}h @ {params.powerKwPerHour}kW)</span>
                <strong>RD$ {powerCost.toFixed(2)}</strong>
              </div>

              <div className="b-row">
                <span>Amortización Impresora 3D</span>
                <strong>RD$ {machineWearCost.toFixed(2)}</strong>
              </div>

              <div className="b-row">
                <span>Mano de Obra Técnico ({params.laborHours}h)</span>
                <strong>RD$ {laborCost.toFixed(2)}</strong>
              </div>

              <div className="b-row risk-row">
                <span>Reserva por Fallas ({params.failureRiskRatePercent}%)</span>
                <strong>RD$ {riskCost.toFixed(2)}</strong>
              </div>

              <div className="b-row cogs-row">
                <span>Costo Directo Unitario (COGS):</span>
                <span className="cogs-val">RD$ {totalUnitCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Big Featured Price Card */}
          <div className="price-hero-card">
            <span className="hero-tag">PRECIO DE VENTA SUGERIDO</span>
            <h1 className="hero-price">RD$ {suggestedPrice.toFixed(2)}</h1>
            
            <div className="profit-pill-badge">
              <span>+RD$ {profitMarginDollars.toFixed(2)} Ganancia Neta</span>
              <span className="margin-sub font-mono">({params.desiredMarginPercent}% Margen)</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="hero-actions-flex">
            <button className="action-btn-primary" onClick={handleExportToInvoice}>
              <FileText size={17} /> Cotizar a Cliente (RD$ {suggestedPrice.toFixed(2)})
            </button>
            <button className="action-btn-secondary" onClick={handleExportToInventory}>
              <Save size={17} /> Guardar en Inventario
            </button>
          </div>

        </div>

      </div>

      {/* Embedded CSS */}
      <style>{`
        .pro-calc-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          font-family: var(--font-body, sans-serif);
        }

        .calc-top-bar {
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

        .calc-main-title {
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

        .text-amber-icon {
          color: #f59e0b;
        }

        .calc-main-subtitle {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 0.15rem;
        }

        .calc-top-actions {
          display: flex;
          gap: 0.75rem;
        }

        .top-btn-secondary {
          padding: 0.65rem 1.2rem;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #374151;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
        }

        .top-btn-secondary:hover {
          background: #e5e7eb;
        }

        .top-btn-primary {
          padding: 0.65rem 1.35rem;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #ffffff;
          background: var(--primary-blue, #0055ff);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          box-shadow: 0 4px 14px rgba(0, 85, 255, 0.25);
          transition: all 0.2s ease;
        }

        .top-btn-primary:hover {
          background: #0040d0;
          transform: translateY(-1px);
        }

        .calc-workspace-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .calc-workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Left Column: Form Panel */
        .calc-card-panel {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .card-section-header {
          margin-bottom: 1.25rem;
        }

        .section-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.2rem;
          font-weight: 800;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .section-subtitle {
          font-size: 0.82rem;
          color: #6b7280;
          margin-top: 0.15rem;
        }

        .calc-form-body {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .field-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #374151;
        }

        .input-text-main {
          width: 100%;
          padding: 0.7rem 0.95rem;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 0.88rem;
          outline: none;
          background: #ffffff;
          font-family: var(--font-body);
        }

        .input-text-main:focus {
          border-color: var(--primary-blue, #0055ff);
          box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.12);
        }

        .params-subcard {
          background: #f8f9fb;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 1rem 1.15rem;
        }

        .subcard-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: #6b7280;
          letter-spacing: 0.04em;
        }

        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .input-with-unit {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-num {
          width: 100%;
          padding: 0.6rem 2.8rem 0.6rem 0.85rem;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          background: #ffffff;
          outline: none;
        }

        .input-num:focus {
          border-color: var(--primary-blue, #0055ff);
          box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.12);
        }

        .unit-badge {
          position: absolute;
          right: 0.75rem;
          font-size: 0.72rem;
          font-weight: 800;
          color: #9ca3af;
          pointer-events: none;
        }

        /* Right Column: Breakdown & Results */
        .calc-results-panel {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .breakdown-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 1.35rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .breakdown-header {
          padding-bottom: 0.85rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .breakdown-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.05rem;
          font-weight: 800;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .breakdown-rows {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-top: 0.85rem;
        }

        .b-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #4b5563;
        }

        .b-row.risk-row {
          color: #d97706;
        }

        .b-row.cogs-row {
          font-size: 1rem;
          font-weight: 800;
          color: #111827;
          border-top: 1px solid #e5e7eb;
          padding-top: 0.75rem;
          margin-top: 0.35rem;
        }

        .cogs-val {
          color: #111827;
          font-weight: 900;
        }

        /* Price Hero Card */
        .price-hero-card {
          background: linear-gradient(135deg, #0055ff 0%, #0040d0 100%);
          border-radius: 20px;
          padding: 1.75rem;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 85, 255, 0.28);
        }

        .hero-tag {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          opacity: 0.85;
          text-transform: uppercase;
        }

        .hero-price {
          font-family: var(--font-heading, sans-serif);
          font-size: 2.8rem;
          font-weight: 900;
          margin: 0.3rem 0 0.6rem;
          letter-spacing: -0.04em;
        }

        .profit-pill-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 0.45rem 1.15rem;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .margin-sub {
          opacity: 0.9;
        }

        .hero-actions-flex {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .action-btn-primary {
          width: 100%;
          padding: 0.85rem;
          border-radius: 99px;
          font-size: 0.88rem;
          font-weight: 800;
          color: #ffffff;
          background: var(--primary-blue, #0055ff);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          box-shadow: 0 4px 16px rgba(0, 85, 255, 0.25);
          transition: all 0.2s ease;
        }

        .action-btn-primary:hover {
          background: #0040d0;
          transform: translateY(-1px);
        }

        .action-btn-secondary {
          width: 100%;
          padding: 0.8rem;
          border-radius: 99px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #374151;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
          transition: all 0.2s ease;
        }

        .action-btn-secondary:hover {
          background: #f8f9fb;
          border-color: #cbd5e1;
        }

        @media (max-width: 640px) {
          .calc-header-row { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .grid-2-col { grid-template-columns: 1fr; }
          .calc-card-panel { padding: 1rem; border-radius: 16px; }
          .breakdown-card { padding: 1rem; border-radius: 16px; }
          .price-hero-card { padding: 1.25rem; border-radius: 16px; }
          .hero-price { font-size: 2.2rem; }
        }
      `}</style>

    </div>
  );
}

