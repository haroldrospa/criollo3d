import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Sparkles, Send, Calculator, Layers, Palette, Shield, Info, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CustomQuoteSection({ onQuoteSubmitted }) {
  // File Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Print Configurations
  const [material, setMaterial] = useState('PLA');
  const [infill, setInfill] = useState(20);
  const [layerHeight, setLayerHeight] = useState('0.2');
  const [selectedColor, setSelectedColor] = useState('Azul Criollo (#0055FF)');
  const [quantity, setQuantity] = useState(1);
  const [scaleFactor, setScaleFactor] = useState(100);

  // User Details Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteResult, setQuoteResult] = useState(null);

  // Materials Config
  const materials = [
    { id: 'PLA', name: 'PLA Premium', basePriceGram: 0.12, desc: 'Económico, bioplástico, ideal para modelos, figuras y prototipos estéticos.' },
    { id: 'PETG', name: 'PETG Tough', basePriceGram: 0.16, desc: 'Resistente a impactos y temperatura, ideal para piezas funcionales e intemperie.' },
    { id: 'ABS', name: 'ABS Engineering', basePriceGram: 0.19, desc: 'Alta rigidez y termorresistencia. Requiere post-procesado industrial.' },
    { id: 'RESIN', name: 'Resina SLA', basePriceGram: 0.35, desc: 'Ultra precisión micrónica, sin líneas de capa visibles. Ideal para joyas y miniaturas.' },
    { id: 'TPU', name: 'TPU Flex 95A', basePriceGram: 0.22, desc: 'Elastómero flexible tipo goma, alta absorción de impactos.' }
  ];

  const colors = [
    { name: 'Azul Criollo (#0055FF)', hex: '#0055FF' },
    { name: 'Negro Azabache (#17181C)', hex: '#17181C' },
    { name: 'Blanco Mármol (#FFFFFF)', hex: '#FFFFFF' },
    { name: 'Gris Grafito (#4B5563)', hex: '#4B5563' },
    { name: 'Rojo Carmesí (#EF4444)', hex: '#EF4444' },
    { name: 'Translucido Naranjo (#F59E0B)', hex: '#F59E0B' }
  ];

  // Dynamic Price & Weight Calculator
  const estimatedVolumeCm3 = uploadedFile ? Math.round(uploadedFile.size / 1500) || 45 : 35;
  const scaledVolume = estimatedVolumeCm3 * Math.pow(scaleFactor / 100, 3);
  const infillFactor = 0.3 + (infill / 100) * 0.7;
  const estimatedWeightGrams = Math.round(scaledVolume * 1.25 * infillFactor);
  
  const currentMaterial = materials.find(m => m.id === material) || materials[0];
  const resolutionMultiplier = layerHeight === '0.1' ? 1.3 : layerHeight === '0.28' ? 0.85 : 1.0;
  
  const baseCost = Math.max(12, estimatedWeightGrams * currentMaterial.basePriceGram * resolutionMultiplier);
  const unitPrice = Math.round(baseCost * 100) / 100;
  const totalPrice = Math.round(unitPrice * quantity * 100) / 100;
  const estimatedHours = Math.max(2, Math.round((estimatedWeightGrams * 0.15 * resolutionMultiplier) * 10) / 10);

  // File Handlers
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    setUploadedFile({
      name: file.name,
      size: file.size,
      formattedSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: ext.toUpperCase()
    });
  };

  // Sample STL preset generator for clients without an STL ready
  const useSampleModel = (name, sizeMb) => {
    setUploadedFile({
      name: name,
      size: sizeMb * 1024 * 1024,
      formattedSize: sizeMb + ' MB',
      type: 'STL'
    });
  };

  // Submission
  const handleSubmitQuote = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const quoteId = 'CR3D-COT-' + Math.floor(100000 + Math.random() * 900000);
      
      const summary = {
        quoteId,
        fileName: uploadedFile ? uploadedFile.name : 'Modelo_Personalizado_Criollo.stl',
        material: currentMaterial.name,
        color: selectedColor,
        infill: infill + '%',
        layerHeight: layerHeight + 'mm',
        quantity,
        estimatedWeight: estimatedWeightGrams + 'g',
        estimatedTime: estimatedHours + ' hrs',
        unitPrice: '$' + unitPrice.toFixed(2),
        totalPrice: '$' + totalPrice.toFixed(2),
        customerName: formData.name,
        customerEmail: formData.email
      };

      setQuoteResult(summary);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onQuoteSubmitted) {
        onQuoteSubmitted(summary);
      }
    }, 1200);
  };

  return (
    <section className="quote-section" id="quote">
      <div className="container">
        
        {/* Section Header */}
        <div className="quote-header text-center">
          <div className="quote-badge">
            <Sparkles size={16} /> Cotizador Instantáneo Criollo3D
          </div>
          <h2 className="quote-title">Cotiza tu Impresión 3D Personalizada</h2>
          <p className="quote-subtitle">
            Sube tu archivo .STL u .OBJ, elige material y relleno, obtén una estimación inmediata y envía tu cotización directo a nuestro correo.
          </p>
        </div>

        {quoteResult ? (
          /* SUCCESS MODAL SUMMARY */
          <div className="quote-success-box animate-fade-in">
            <div className="success-icon-wrapper">
              <CheckCircle2 size={56} className="text-blue" />
            </div>
            <h3>¡Cotización Enviada con Éxito!</h3>
            <p className="success-msg">
              Hemos enviado el resumen detallado a <strong>{quoteResult.customerEmail}</strong>. 
              Uno de nuestros ingenieros de impresión 3D revisará la malla de tu modelo y te responderá en menos de 2 horas.
            </p>

            <div className="quote-summary-card">
              <div className="summary-row header-row">
                <span>Nº de Cotización:</span>
                <strong>{quoteResult.quoteId}</strong>
              </div>
              <div className="summary-row">
                <span>Archivo Subido:</span>
                <span>{quoteResult.fileName}</span>
              </div>
              <div className="summary-row">
                <span>Material & Color:</span>
                <span>{quoteResult.material} ({quoteResult.color.split(' ')[0]})</span>
              </div>
              <div className="summary-row">
                <span>Configuración:</span>
                <span>Infill: {quoteResult.infill} | Capa: {quoteResult.layerHeight}</span>
              </div>
              <div className="summary-row">
                <span>Cantidad:</span>
                <span>{quoteResult.quantity} unidad(es)</span>
              </div>
              <div className="summary-row total-row">
                <span>Precio Estimado Total:</span>
                <span className="total-price-tag">{quoteResult.totalPrice} USD</span>
              </div>
            </div>

            <div className="success-actions">
              <button className="btn-primary" onClick={() => setQuoteResult(null)}>
                Nueva Cotización
              </button>
              <a 
                href={`https://wa.me/?text=Hola%20Criollo3D,%20acabo%20de%20generar%20la%20cotizaci%C3%B3n%20${quoteResult.quoteId}%20para%20${encodeURIComponent(quoteResult.fileName)}.`}
                target="_blank" 
                rel="noreferrer"
                className="btn-secondary"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        ) : (
          /* MAIN INTERACTIVE QUOTE BUILDER */
          <div className="quote-grid">
            
            {/* LEFT COLUMN: File Upload & Parameters */}
            <div className="quote-form-left">
              
              {/* STEP 1: Upload File */}
              <div className="quote-step-box">
                <div className="step-title">
                  <span className="step-num">1</span>
                  <h3>Sube tu Archivo 3D (.STL, .OBJ, .3MF)</h3>
                </div>

                <div 
                  className={`drag-drop-zone ${isDragging ? 'dragging' : ''} ${uploadedFile ? 'has-file' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                >
                  {uploadedFile ? (
                    <div className="file-info-active">
                      <FileText size={38} className="text-blue" />
                      <div>
                        <h4>{uploadedFile.name}</h4>
                        <p>Tamaño: {uploadedFile.formattedSize} | Tipo: {uploadedFile.type}</p>
                      </div>
                      <button 
                        type="button" 
                        className="btn-change-file"
                        onClick={() => setUploadedFile(null)}
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <div className="drop-prompt">
                      <div className="upload-icon-circle">
                        <Upload size={28} />
                      </div>
                      <h4>Arrastra y suelta tu modelo 3D aquí</h4>
                      <p>o haz clic para explorar tus archivos localmente</p>
                      <input 
                        type="file" 
                        accept=".stl,.obj,.3mf" 
                        onChange={handleFileSelect}
                        className="file-input-hidden" 
                      />
                    </div>
                  )}
                </div>

                {/* Sample STL buttons if client doesn't have a file on hand */}
                <div className="sample-files-prompt">
                  <span>¿No tienes un archivo a mano? Pruba con un modelo demo:</span>
                  <div className="sample-btns">
                    <button type="button" onClick={() => useSampleModel('Pieza_Mecanica_Gear.stl', 4.2)}>⚙️ Engranaje</button>
                    <button type="button" onClick={() => useSampleModel('Busto_Custom_Art.stl', 12.8)}>🗿 Busto Artístico</button>
                    <button type="button" onClick={() => useSampleModel('Caja_Carcasa_Tech.stl', 6.1)}>📦 Carcasa Tech</button>
                  </div>
                </div>
              </div>

              {/* STEP 2: Technical Specifications */}
              <div className="quote-step-box">
                <div className="step-title">
                  <span className="step-num">2</span>
                  <h3>Parámetros de Impresión</h3>
                </div>

                {/* Material Selection */}
                <div className="param-group">
                  <label className="param-label"><Layers size={16} /> Selecciona Material:</label>
                  <div className="materials-grid">
                    {materials.map(m => (
                      <button
                        type="button"
                        key={m.id}
                        className={`material-card ${material === m.id ? 'active' : ''}`}
                        onClick={() => setMaterial(m.id)}
                      >
                        <span className="mat-name">{m.name}</span>
                        <span className="mat-desc">{m.desc.slice(0, 45)}...</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="param-group">
                  <label className="param-label"><Palette size={16} /> Color Deseado:</label>
                  <div className="color-swatches">
                    {colors.map(c => (
                      <button
                        type="button"
                        key={c.name}
                        className={`swatch-btn ${selectedColor === c.name ? 'active' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                      >
                        {selectedColor === c.name && <CheckCircle2 size={16} color={c.hex === '#FFFFFF' ? '#000' : '#FFF'} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Infill Percentage */}
                <div className="param-group">
                  <div className="param-header">
                    <label className="param-label">Porcentaje de Relleno (Infill):</label>
                    <span className="param-val">{infill}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5"
                    value={infill}
                    onChange={(e) => setInfill(Number(e.target.value))}
                    className="slider-input"
                  />
                  <div className="slider-labels">
                    <span>10% (Ligero)</span>
                    <span>40% (Estándar)</span>
                    <span>100% (Sólido)</span>
                  </div>
                </div>

                {/* Layer Height & Quantity */}
                <div className="param-two-col">
                  <div className="param-group">
                    <label className="param-label">Resolución de Capa:</label>
                    <select 
                      value={layerHeight} 
                      onChange={(e) => setLayerHeight(e.target.value)}
                      className="select-input"
                    >
                      <option value="0.1">0.10 mm (Ultra Fino SLA/FDM)</option>
                      <option value="0.2">0.20 mm (Estándar Recomendado)</option>
                      <option value="0.28">0.28 mm (Impresión Rápida)</option>
                    </select>
                  </div>

                  <div className="param-group">
                    <label className="param-label">Cantidad de Piezas:</label>
                    <div className="qty-control">
                      <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                      <span>{quantity}</span>
                      <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: Live Cost Estimation & Contact Form */}
            <div className="quote-form-right">
              
              <div className="quote-summary-sticky">
                
                <div className="calc-header">
                  <Calculator size={20} /> Estimación en Tiempo Real
                </div>

                <div className="calc-metrics-grid">
                  <div className="metric-box">
                    <span className="metric-lbl">Peso estimado</span>
                    <strong className="metric-val">{estimatedWeightGrams * quantity} g</strong>
                  </div>
                  <div className="metric-box">
                    <span className="metric-lbl">Tiempo impre.</span>
                    <strong className="metric-val">~{estimatedHours * quantity} h</strong>
                  </div>
                </div>

                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Precio Unitario:</span>
                    <strong>${unitPrice.toFixed(2)} USD</strong>
                  </div>
                  <div className="price-row">
                    <span>Cantidad:</span>
                    <span>x{quantity}</span>
                  </div>
                  <div className="price-divider"></div>
                  <div className="price-row total">
                    <span>Total Estimado:</span>
                    <span className="big-price">${totalPrice.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* STEP 3: Contact Form & Send */}
                <form onSubmit={handleSubmitQuote} className="contact-quote-form">
                  <h4>Completa tus datos para enviar cotización</h4>
                  
                  <div className="input-field">
                    <input 
                      type="text" 
                      placeholder="Tu Nombre completo *" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="input-field">
                    <input 
                      type="email" 
                      placeholder="Tu Correo Electrónico *" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="input-field">
                    <input 
                      type="tel" 
                      placeholder="Teléfono / WhatsApp (Opcional)" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="input-field">
                    <textarea 
                      placeholder="Notas del proyecto (post-procesado, ensamblado, tolerancias)..."
                      rows="3"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary btn-submit-quote"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Procesando Cotización...'
                    ) : (
                      <>
                        <Send size={18} /> ENVIAR COTIZACIÓN AL CORREO
                      </>
                    )}
                  </button>

                  <p className="privacy-note">
                    <Shield size={14} /> Tus datos y archivos 3D están 100% protegidos bajo acuerdo de confidencialidad.
                  </p>
                </form>

              </div>

            </div>

          </div>
        )}

      </div>

      <style>{`
        .quote-section {
          padding: 5rem 0 6rem 0;
          background-color: var(--bg-light-gray);
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }

        .quote-header {
          max-width: 680px;
          margin: 0 auto 3.5rem auto;
          text-align: center;
        }

        .quote-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--primary-blue-light);
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.4rem 1.1rem;
          border-radius: 99px;
          margin-bottom: 1rem;
        }

        .quote-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 2.5rem;
          color: #111827;
          margin-bottom: 0.8rem;
          letter-spacing: -0.02em;
        }

        .quote-subtitle {
          font-size: 1.05rem;
          color: #4B5563;
          line-height: 1.6;
        }

        .quote-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2.5rem;
          align-items: start;
        }

        .quote-step-box {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.04);
        }

        .step-title {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }

        .step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--primary-blue);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-title h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        /* Drag and Drop Zone */
        .drag-drop-zone {
          border: 2px dashed #CBD5E1;
          border-radius: 16px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          background-color: #FAFAFA;
          transition: all 0.25s ease;
          position: relative;
          cursor: pointer;
        }

        .drag-drop-zone:hover, .drag-drop-zone.dragging {
          border-color: var(--primary-blue);
          background-color: var(--primary-blue-light);
        }

        .drag-drop-zone.has-file {
          border-style: solid;
          border-color: var(--primary-blue);
          background-color: #F0F5FF;
        }

        .upload-icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #ffffff;
          color: var(--primary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
          box-shadow: 0 4px 12px rgba(0,85,255,0.15);
        }

        .drop-prompt h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.3rem;
        }

        .drop-prompt p {
          font-size: 0.88rem;
          color: #6B7280;
        }

        .file-input-hidden {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .file-info-active {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          text-align: left;
        }

        .file-info-active h4 {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
        }

        .file-info-active p {
          font-size: 0.85rem;
          color: #4B5563;
        }

        .btn-change-file {
          color: var(--primary-blue);
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: underline;
        }

        .sample-files-prompt {
          margin-top: 1.2rem;
          font-size: 0.85rem;
          color: #6B7280;
        }

        .sample-btns {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .sample-btns button {
          background: #F3F4F6;
          border: 1px solid #E5E7EB;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s ease;
        }

        .sample-btns button:hover {
          background: var(--primary-blue-light);
          color: var(--primary-blue);
          border-color: var(--primary-blue);
        }

        /* Params */
        .param-group {
          margin-bottom: 1.4rem;
        }

        .param-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: #374151;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.6rem;
        }

        .materials-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .material-card {
          text-align: left;
          background: #F9FAFB;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          transition: all 0.2s ease;
        }

        .material-card:hover {
          border-color: var(--primary-blue);
        }

        .material-card.active {
          border-color: var(--primary-blue);
          background-color: var(--primary-blue-light);
        }

        .mat-name {
          display: block;
          font-weight: 700;
          font-size: 0.9rem;
          color: #111827;
        }

        .mat-desc {
          font-size: 0.75rem;
          color: #6B7280;
          line-height: 1.3;
        }

        .color-swatches {
          display: flex;
          gap: 0.75rem;
        }

        .swatch-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .swatch-btn:hover {
          transform: scale(1.15);
        }

        .swatch-btn.active {
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(0,85,255,0.3);
        }

        .param-header {
          display: flex;
          justify-content: space-between;
        }

        .param-val {
          font-weight: 800;
          color: var(--primary-blue);
          font-size: 0.95rem;
        }

        .slider-input {
          width: 100%;
          accent-color: var(--primary-blue);
          margin-top: 0.3rem;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #9CA3AF;
          margin-top: 0.3rem;
        }

        .param-two-col {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1rem;
        }

        .select-input {
          width: 100%;
          padding: 0.65rem 0.9rem;
          border-radius: 10px;
          border: 1px solid #D1D5DB;
          font-size: 0.9rem;
          background-color: #FFFFFF;
        }

        .qty-control {
          display: flex;
          align-items: center;
          border: 1px solid #D1D5DB;
          border-radius: 10px;
          background-color: #FFFFFF;
          overflow: hidden;
          height: 40px;
        }

        .qty-control button {
          width: 36px;
          height: 100%;
          font-size: 1.1rem;
          font-weight: 700;
          color: #374151;
        }

        .qty-control button:hover {
          background-color: #F3F4F6;
        }

        .qty-control span {
          flex: 1;
          text-align: center;
          font-weight: 700;
          font-size: 0.95rem;
        }

        /* Right Sticky Calculator & Form */
        .quote-summary-sticky {
          position: sticky;
          top: 100px;
          background-color: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .calc-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.15rem;
          color: #111827;
          margin-bottom: 1.2rem;
        }

        .calc-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .metric-box {
          background-color: var(--bg-light-gray);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          text-align: center;
        }

        .metric-lbl {
          display: block;
          font-size: 0.75rem;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.2rem;
        }

        .metric-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: #111827;
        }

        .price-breakdown {
          background-color: var(--primary-blue-light);
          border-radius: 14px;
          padding: 1.2rem;
          margin-bottom: 1.5rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 0.4rem;
        }

        .price-divider {
          height: 1px;
          background-color: rgba(0,85,255,0.15);
          margin: 0.75rem 0;
        }

        .price-row.total {
          align-items: center;
          margin-bottom: 0;
        }

        .price-row.total span {
          font-weight: 700;
          color: #111827;
        }

        .big-price {
          font-family: var(--font-heading);
          font-size: 1.6rem !important;
          font-weight: 800 !important;
          color: var(--primary-blue) !important;
        }

        .contact-quote-form h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .input-field {
          margin-bottom: 0.85rem;
        }

        .input-field input, .input-field textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid #D1D5DB;
          font-size: 0.9rem;
          background-color: #FAFAFA;
          transition: border-color 0.2s ease;
        }

        .input-field input:focus, .input-field textarea:focus {
          border-color: var(--primary-blue);
          background-color: #FFFFFF;
        }

        .btn-submit-quote {
          width: 100%;
          padding: 0.95rem;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .privacy-note {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #6B7280;
          margin-top: 0.85rem;
          text-align: center;
          justify-content: center;
        }

        /* Success Summary Box */
        .quote-success-box {
          background: #ffffff;
          border-radius: 24px;
          padding: 3.5rem 2.5rem;
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
        }

        .success-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--primary-blue-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
        }

        .text-blue { color: var(--primary-blue); }

        .quote-success-box h3 {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.8rem;
        }

        .success-msg {
          font-size: 1.05rem;
          color: #4B5563;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .quote-summary-card {
          background-color: var(--bg-light-gray);
          border-radius: 16px;
          padding: 1.5rem;
          text-align: left;
          margin-bottom: 2rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px solid #E5E7EB;
          font-size: 0.95rem;
          color: #374151;
        }

        .summary-row.total-row {
          border-bottom: none;
          padding-top: 1rem;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .total-price-tag {
          color: var(--primary-blue);
          font-size: 1.3rem;
        }

        .success-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 900px) {
          .quote-grid {
            grid-template-columns: 1fr;
          }
          .materials-grid {
            grid-template-columns: 1fr;
          }
          .quote-summary-sticky {
            position: static;
          }
        }
      `}</style>
    </section>
  );
}
