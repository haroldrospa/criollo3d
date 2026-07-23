import React, { useState } from 'react';
import { ArrowLeft, Printer, Edit3, Trash2, ArrowRight, Check, X, Phone, Mail, MapPin, Clock, Info, ShieldCheck, ExternalLink } from 'lucide-react';

export default function InvoiceDocumentView({ doc, onBack, onUpdateDoc, onDeleteDoc, onConvertToInvoice, onToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...doc });

  // Read socialLinks from localStorage configured via Admin Panel
  const [socialLinks] = useState(() => {
    const saved = localStorage.getItem('criollo3d_social_links');
    return saved ? JSON.parse(saved) : {
      whatsappPhone: '829 510 3468',
      whatsappUrl: 'https://wa.me/18295103468',
      instagramHandle: '@CRIOLLO3D',
      instagramUrl: 'https://instagram.com/criollo3d',
      facebookUrl: 'https://facebook.com/criollo3d',
      tiktokUrl: 'https://tiktok.com/@criollo3d',
      websiteUrl: 'https://www.criollo3d.com'
    };
  });

  // Available sample 3D images for quick selection
  const SAMPLE_3D_IMAGES = [
    { label: 'Prototipo Soporte 3D', url: '/images/cat_robot.png' },
    { label: 'Anillos / Joyería 3D', url: '/images/cat_rings.png' },
    { label: 'Reloj Minimalista 3D', url: '/images/cat_watch.png' },
    { label: 'Carcasa / Torso 3D', url: '/images/prod_suit_torso.png' },
    { label: 'Modelo Dental Resina', url: '/images/prod_dental_teeth.png' },
    { label: 'Figura / Escultura', url: '/images/prod_funko_father_son.png' }
  ];

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedSubtotal = editForm.items.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.unitPrice || 0)), 0);
    const updatedTax = updatedSubtotal * (editForm.taxRate ?? 0.18);
    const updatedTotal = updatedSubtotal + updatedTax;

    const updatedDoc = {
      ...editForm,
      subtotal: updatedSubtotal,
      tax: updatedTax,
      total: updatedTotal
    };

    onUpdateDoc(updatedDoc);
    setIsEditing(false);
    if (onToast) onToast(`✨ Comprobante #${updatedDoc.id} actualizado con éxito.`);
  };

  const currentDoc = doc;

  // Calculate fields
  const subtotal = currentDoc.subtotal || currentDoc.items?.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0) || 0;
  const tax = currentDoc.tax !== undefined ? currentDoc.tax : subtotal * 0.18;
  const total = currentDoc.total || (subtotal + tax);
  const paidAmount = currentDoc.paidAmount || 0;

  return (
    <div className="pro-pdf-view-wrapper animate-fade-in">
      
      {/* Floating Control Bar (Hidden during print) */}
      <div className="pdf-control-bar no-print">
        <button className="pdf-btn pdf-btn-secondary" onClick={onBack}>
          <ArrowLeft size={17} /> Volver a Lista
        </button>

        <div className="pdf-actions-right">
          {currentDoc.type === 'Cotización' && currentDoc.status === 'Pendiente' && (
            <button className="pdf-btn pdf-btn-amber" onClick={() => onConvertToInvoice(currentDoc)}>
              <ArrowRight size={16} /> Convertir a Factura
            </button>
          )}

          <button className="pdf-btn pdf-btn-outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit3 size={16} /> {isEditing ? 'Cancelar Edición' : 'Editar Comprobante'}
          </button>

          <button className="pdf-btn pdf-btn-primary" onClick={() => window.print()}>
            <Printer size={16} /> Imprimir / Guardar PDF
          </button>

          {onDeleteDoc && (
            <button className="pdf-btn pdf-btn-danger" onClick={() => onDeleteDoc(currentDoc.id)} title="Eliminar comprobante">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Edit Panel (Hidden during print) */}
      {isEditing && (
        <div className="pdf-edit-panel no-print animate-fade-in">
          <div className="edit-panel-header">
            <h3><Edit3 size={18} /> Editar Datos del Comprobante #{currentDoc.id}</h3>
            <button className="close-edit-btn" onClick={() => setIsEditing(false)}><X size={18} /></button>
          </div>

          <form onSubmit={handleSaveEdit} className="edit-panel-grid">
            <div className="edit-field">
              <label>Nombre del Cliente:</label>
              <input
                type="text"
                value={editForm.clientName || ''}
                onChange={e => setEditForm({ ...editForm, clientName: e.target.value })}
                required
              />
            </div>

            <div className="edit-field">
              <label>Correo Electrónico:</label>
              <input
                type="email"
                value={editForm.clientEmail || ''}
                onChange={e => setEditForm({ ...editForm, clientEmail: e.target.value })}
              />
            </div>

            <div className="edit-field">
              <label>Teléfono / WhatsApp:</label>
              <input
                type="text"
                value={editForm.clientPhone || ''}
                placeholder="849 851 4655"
                onChange={e => setEditForm({ ...editForm, clientPhone: e.target.value })}
              />
            </div>

            <div className="edit-field">
              <label>Fecha Emisión:</label>
              <input
                type="date"
                value={editForm.date || ''}
                onChange={e => setEditForm({ ...editForm, date: e.target.value })}
              />
            </div>

            <div className="edit-field">
              <label>Válido Hasta / Vencimiento:</label>
              <input
                type="date"
                value={editForm.dueDate || ''}
                onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })}
              />
            </div>

            <div className="edit-field">
              <label>Tiempo de Entrega:</label>
              <input
                type="text"
                value={editForm.deliveryTime || ''}
                placeholder="3 a 5 Días Hábiles"
                onChange={e => setEditForm({ ...editForm, deliveryTime: e.target.value })}
              />
            </div>

            <div className="edit-field full-width">
              <label>Dirección de Envío / Sucursal:</label>
              <input
                type="text"
                value={editForm.shippingAddress || ''}
                placeholder="Plaza Hache, Segundo Nivel, Santiago, RD"
                onChange={e => setEditForm({ ...editForm, shippingAddress: e.target.value })}
              />
            </div>

            <div className="edit-field full-width">
              <label>Imagen de Referencia 3D / Prototipo:</label>
              <div className="sample-img-select">
                {SAMPLE_3D_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`sample-img-chip ${editForm.referenceImage === img.url ? 'selected' : ''}`}
                    onClick={() => setEditForm({ ...editForm, referenceImage: img.url })}
                  >
                    <img src={img.url} alt={img.label} />
                    <span>{img.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="edit-panel-actions full-width">
              <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancelar</button>
              <button type="submit" className="btn-save"><Check size={16} /> Guardar Cambios</button>
            </div>
          </form>
        </div>
      )}

      {/* Main Printable Modern A4 Document Container */}
      <div className="printable-a4-sheet" id="printable-invoice">
        
        {/* Subtle Watermark Emblem Background */}
        <div className="sheet-watermark">
          <img src="/logo_icon_transparent.png" alt="Criollo3D Watermark" />
        </div>

        {/* Top Gradient Brand Accent Line */}
        <div className="sheet-top-accent-bar"></div>

        {/* 1. Header Block */}
        <div className="sheet-header">
          <div className="header-brand-col">
            <div className="brand-logo-row">
              <img src="/logo_full_transparent.png" alt="Criollo3D" className="invoice-brand-logo-img" />
            </div>

            <div className="brand-address-box">
              <p className="address-line">Plaza Hache, Segundo nivel</p>
              <p className="address-line">Avenida Salvador Estrella Sadhalá</p>
              <p className="address-line">Santiago de los Caballeros, Santiago</p>
              <p className="address-line country">República Dominicana</p>
            </div>
          </div>

          <div className="header-meta-col">
            <div className="doc-type-pill-box">
              <span className={`doc-type-badge ${currentDoc.type === 'Factura' ? 'badge-fac' : 'badge-cot'}`}>
                {currentDoc.type.toUpperCase()}
              </span>
            </div>
            
            <div className="dates-meta-table">
              <div className="meta-date-row">
                <span className="meta-date-label">Emitida:</span>
                <span className="meta-date-val">{currentDoc.date || '7/22/2026'}</span>
              </div>
              <div className="meta-date-row">
                <span className="meta-date-label">Válido hasta:</span>
                <span className="meta-date-val">{currentDoc.dueDate || '8/5/2026'}</span>
              </div>
            </div>

            <div className="doc-id-pill">
              <span>#{currentDoc.id}</span>
            </div>
          </div>
        </div>

        {/* 2. Client Metadata Info Card */}
        <div className="sheet-client-card">
          <div className="client-card-header">
            <span className="client-card-title">INFORMACIÓN DEL CLIENTE</span>
          </div>
          <div className="client-fields-grid">
            <div className="client-info-item">
              <span className="client-label">Cliente:</span>
              <span className="client-val bold-name">{currentDoc.clientName || 'Nobel Rafael Minaya'}</span>
            </div>

            <div className="client-info-item">
              <span className="client-label">Correo:</span>
              <a href={`mailto:${currentDoc.clientEmail || 'nobelminaya@gmail.com'}`} className="client-val email-link">
                {currentDoc.clientEmail || 'nobelminaya@gmail.com'}
              </a>
            </div>

            <div className="client-info-item">
              <span className="client-label">Teléfono:</span>
              <span className="client-val">{currentDoc.clientPhone || '849 851 4655'}</span>
            </div>
          </div>
        </div>

        {/* 3. Golden Yellow Accent Products Table */}
        <div className="sheet-table-wrapper">
          <table className="criollo-items-table">
            <thead>
              <tr className="blue-header-row">
                <th className="col-desc">DESCRIPCIÓN</th>
                <th className="col-qty text-center">CANTIDAD</th>
                <th className="col-cost text-right">COSTO</th>
                <th className="col-itb text-center">ITB</th>
                <th className="col-total text-right">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {currentDoc.items && currentDoc.items.length > 0 ? (
                currentDoc.items.map((item, idx) => {
                  const itemQty = Number(item.qty || 1);
                  const itemUnitPrice = Number(item.unitPrice || 0);
                  const itemTotal = itemQty * itemUnitPrice;
                  const itemItb = item.itb !== undefined ? item.itb : '0%';

                  return (
                    <tr key={idx} className="item-data-row">
                      <td className="col-desc font-600">{item.description}</td>
                      <td className="col-qty text-center font-600">{itemQty}</td>
                      <td className="col-cost text-right">
                        <span className="currency-sym">RD$</span> {(itemUnitPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="col-itb text-center">{itemItb}</td>
                      <td className="col-total text-right font-700">
                        <span className="currency-sym">RD$</span> {(itemTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="item-data-row">
                  <td className="col-desc font-600">Impresión 3D Pieza Personalizada (PLA Pro)</td>
                  <td className="col-qty text-center font-600">1</td>
                  <td className="col-cost text-right">RD$ 45.00</td>
                  <td className="col-itb text-center">0%</td>
                  <td className="col-total text-right font-700">RD$ 45.00</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Totals Breakdown Card (Right Aligned) */}
        <div className="sheet-totals-outer">
          <div className="totals-card">
            <div className="tot-row">
              <span className="tot-label">Subtotal</span>
              <span className="tot-val">RD$ {(subtotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="tot-row">
              <span className="tot-label">ITB (18%)</span>
              <span className="tot-val">{tax > 0 ? `RD$ ${tax.toFixed(2)}` : 'RD$ 0.00'}</span>
            </div>
            <div className="tot-row">
              <span className="tot-label">Pagando / Avance</span>
              <span className="tot-val">{paidAmount > 0 ? `RD$ ${paidAmount.toFixed(2)}` : '-'}</span>
            </div>
            <div className="tot-row total-highlight-banner">
              <span className="tot-label bold">TOTAL GENERAL</span>
              <span className="tot-val bold">RD$ {(total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DOP</span>
            </div>
          </div>
        </div>

        {/* 5. Middle Grid Details: Delivery, Shipping, Manufacturing Note & 3D Reference Image */}
        <div className="sheet-details-grid">
          
          {/* Left Column: Delivery, Address, Official Note */}
          <div className="details-left-col">
            
            <div className="detail-card-item">
              <div className="detail-card-header">
                <Clock size={14} className="detail-icon" />
                <h4 className="detail-title">Tiempo de entrega</h4>
              </div>
              <p className="detail-text">{currentDoc.deliveryTime || '3 a 5 Días Hábiles'}</p>
            </div>

            <div className="detail-card-item">
              <div className="detail-card-header">
                <MapPin size={14} className="detail-icon" />
                <h4 className="detail-title">Dirección de Envío:</h4>
              </div>
              <p className="detail-text">{currentDoc.shippingAddress || 'Plaza Hache, Segundo Nivel, Av. Estrella Sadhalá, Santiago, RD'}</p>
            </div>

            <div className="note-callout-box">
              <div className="note-header">
                <Info size={14} className="note-icon" />
                <span className="note-title">CONDICIÓN DE FABRICACIÓN</span>
              </div>
              <p className="note-text">
                Para iniciar el proceso de fabricación, se requiere un pago inicial correspondiente al 50% del valor total de la orden. El restante deberá ser completado antes del envío del producto o al momento de retirarlo en nuestra sucursal.
              </p>
            </div>

          </div>

          {/* Right Column: 3D Reference Image Showcase Frame */}
          <div className="details-right-col">
            <div className="reference-box-container">
              <div className="reference-header">
                <span className="reference-title">Referencia 3D:</span>
              </div>
              <div className="reference-img-frame">
                {currentDoc.referenceImage ? (
                  <img src={currentDoc.referenceImage} alt="Referencia Prototipo 3D" className="ref-img" />
                ) : (
                  <div className="ref-fallback-box">
                    <svg viewBox="0 0 100 100" className="cad-3d-svg" fill="none" stroke="#007acc" strokeWidth="2.5">
                      <path d="M 20,35 L 50,15 L 80,35 L 80,65 L 50,85 L 20,65 Z" fill="#e0f2fe" fillOpacity="0.4" />
                      <path d="M 20,35 L 50,55 L 80,35" />
                      <path d="M 50,55 L 50,85" />
                    </svg>
                    <span className="fallback-text">Modelo CAD 3D</span>
                  </div>
                )}
                <div className="ref-img-tag">PROTOTIPO 3D</div>
              </div>
            </div>
          </div>

        </div>

        {/* 6. Footer Section: Contacts & Vector QR Badges */}
        <div className="sheet-footer">
          
          <div className="footer-brand-info">
            <div className="footer-contact-row">
              <span className="contact-item">
                <Phone size={13} className="contact-icon" /> <strong>WhatsApp:</strong> {socialLinks.whatsappPhone || '829 510 3468'}
              </span>
              <span className="contact-sep">•</span>
              <span className="contact-item">
                <ExternalLink size={13} className="contact-icon" /> <strong>Web:</strong> <a href={socialLinks.websiteUrl || 'https://www.criollo3d.com'} target="_blank" rel="noreferrer">{socialLinks.websiteUrl ? socialLinks.websiteUrl.replace(/^https?:\/\//, '') : 'www.criollo3d.com'}</a>
              </span>
            </div>
            <p className="footer-guarantee">✓ Trabajos respaldados por garantía de tolerancia dimensional Criollo3D Pro</p>
          </div>

          <div className="footer-qr-group">
            
            {/* QR 1: WhatsApp Contact */}
            <div className="qr-badge-card">
              <div className="qr-code-wrapper">
                <img src="/QR_WS.png" alt="QR WhatsApp Contacto" className="qr-code-img" />
              </div>
              <span className="qr-card-label">CONTACTO</span>
            </div>

            {/* QR 2: Instagram Official */}
            <div className="qr-badge-card instagram-badge">
              <div className="qr-code-wrapper">
                <img src="/QR_Instagram.png" alt="QR Instagram" className="qr-code-img" />
              </div>
              <span className="qr-card-label bold-ig">{socialLinks.instagramHandle || '@CRIOLLO3D'}</span>
            </div>

          </div>

        </div>

      </div>

      {/* Styled JSX Stylesheet for High-End Modern Letterhead Document */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .pro-pdf-view-wrapper {
          max-width: 880px;
          margin: 0 auto;
          padding-bottom: 3rem;
          font-family: 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif;
          color: #0f172a;
        }

        /* Control Bar */
        .pdf-control-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          background: #ffffff;
          padding: 0.85rem 1.25rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid #e2e8f0;
        }

        .pdf-actions-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .pdf-btn {
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.55rem 1.15rem;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .pdf-btn-primary {
          background: #0055ff;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(0, 85, 255, 0.25);
        }
        .pdf-btn-primary:hover { background: #0044cc; transform: translateY(-1px); }

        .pdf-btn-secondary {
          background: #f1f5f9;
          color: #334155;
        }
        .pdf-btn-secondary:hover { background: #e2e8f0; }

        .pdf-btn-amber {
          background: #fef3c7;
          color: #92400e;
        }
        .pdf-btn-amber:hover { background: #fde68a; }

        .pdf-btn-outline {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
        }
        .pdf-btn-outline:hover { background: #f8fafc; }

        .pdf-btn-danger {
          background: #fee2e2;
          color: #dc2626;
          padding: 0.55rem 0.75rem;
        }
        .pdf-btn-danger:hover { background: #fca5a5; }

        /* Edit Panel */
        .pdf-edit-panel {
          background: #ffffff;
          border: 1.5px solid #00B4D8;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 180, 216, 0.1);
        }

        .edit-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .edit-panel-header h3 {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .close-edit-btn {
          background: #f1f5f9;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .edit-panel-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .edit-field.full-width { grid-column: span 3; }

        .edit-field label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 0.25rem;
        }
        .edit-field input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .sample-img-select {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.4rem 0;
        }
        .sample-img-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 99px;
          font-size: 0.75rem;
          cursor: pointer;
          white-space: nowrap;
        }
        .sample-img-chip.selected {
          border-color: #0055ff;
          background: #eff6ff;
          font-weight: 700;
          color: #0055ff;
        }
        .sample-img-chip img {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          object-fit: cover;
        }

        .edit-panel-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .btn-cancel {
          background: #f1f5f9;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          font-size: 0.82rem;
          cursor: pointer;
        }
        .btn-save {
          background: #00B4D8;
          color: #ffffff;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          border: none;
          font-weight: 700;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
        }

        /* ------------------------------------------------------------- */
        /* HIGH-END MODERN PRINTABLE A4 LETTERHEAD DOCUMENT SHEET */
        /* ------------------------------------------------------------- */
        .printable-a4-sheet {
          position: relative;
          background: #ffffff;
          width: 100%;
          max-width: 840px;
          min-height: 1020px;
          margin: 0 auto;
          padding: 2.2rem 2.5rem 1.6rem 2.5rem;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.07);
          overflow: hidden;
          color: #0f172a;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        /* Centered Subtle Watermark */
        .sheet-watermark {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          opacity: 0.038;
          pointer-events: none;
          z-index: 0;
        }
        .sheet-watermark img {
          width: 100%;
          height: auto;
        }

        /* Top Subtle Accent Bar */
        .sheet-top-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #0F172A;
        }

        /* 1. Header Block */
        .sheet-header {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .brand-logo-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.35rem;
        }

        .invoice-brand-logo-img {
          height: 44px;
          max-width: 220px;
          width: auto;
          object-fit: contain;
        }

        .brand-address-box {
          font-size: 0.8rem;
          color: #475569;
          line-height: 1.45;
        }
        .address-line { margin: 0; }
        .address-line.country { font-weight: 600; color: #334155; }

        .header-meta-col {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .doc-type-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.25rem 0.85rem;
          border-radius: 99px;
          margin-bottom: 0.4rem;
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #cbd5e1;
        }

        .dates-meta-table {
          font-size: 0.82rem;
          color: #334155;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          text-align: right;
        }
        .meta-date-row {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
        .meta-date-label { font-weight: 500; color: #64748b; }
        .meta-date-val { font-weight: 700; color: #0f172a; }

        .doc-id-pill {
          margin-top: 0.4rem;
          background: #f1f5f9;
          padding: 0.22rem 0.6rem;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: 0.02em;
        }

        /* 2. Client Info Card */
        .sheet-client-card {
          position: relative;
          z-index: 1;
          margin-bottom: 1.3rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.95rem 1.3rem;
        }

        .client-card-header {
          margin-bottom: 0.4rem;
        }
        .client-card-title {
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.08em;
        }

        .client-fields-grid {
          display: grid;
          grid-template-columns: 1.2fr 1.5fr 1fr;
          gap: 0.9rem;
          font-size: 0.86rem;
        }

        .client-info-item {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .client-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
        }
        .client-val {
          color: #0f172a;
          font-weight: 600;
        }
        .client-val.bold-name {
          font-size: 0.98rem;
          font-weight: 800;
          color: #0f172a;
        }
        .email-link {
          color: #0f172a;
          text-decoration: underline;
        }

        /* 3. Products Table */
        .sheet-table-wrapper {
          position: relative;
          z-index: 1;
          margin-bottom: 1.2rem;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .criollo-items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.86rem;
        }

        .blue-header-row th {
          background: #0F172A;
          color: #ffffff;
          font-weight: 800;
          font-size: 0.76rem;
          letter-spacing: 0.05em;
          padding: 0.7rem 0.95rem;
          border: none;
        }

        .item-data-row td {
          padding: 0.75rem 0.95rem;
          color: #0f172a;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
        }
        .item-data-row:nth-child(even) td {
          background: #f8fafc;
        }
        .item-data-row:last-child td {
          border-bottom: none;
        }

        .font-600 { font-weight: 600; }
        .font-700 { font-weight: 700; }

        /* 4. Totals Breakdown Card */
        .sheet-totals-outer {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.3rem;
        }

        .totals-card {
          width: 275px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.75rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .tot-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.84rem;
          color: #475569;
          padding: 0.1rem 0;
        }
        .tot-label { font-weight: 500; }
        .tot-val { font-weight: 700; color: #0f172a; }

        .total-highlight-banner {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 0.5rem 0.7rem;
          margin-top: 0.2rem;
          color: #0f172a;
        }
        .total-highlight-banner .tot-label { font-weight: 800; color: #0f172a; font-size: 0.86rem; }
        .total-highlight-banner .tot-val { font-weight: 800; color: #0f172a; font-size: 1.05rem; }

        /* 5. Middle Grid Details */
        .sheet-details-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 245px;
          gap: 1.25rem;
          margin-bottom: 1.4rem;
        }

        .details-left-col {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .detail-card-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.65rem 0.95rem;
        }

        .detail-card-header {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.15rem;
        }
        .detail-icon { color: #0f172a; }
        .detail-title {
          font-size: 0.78rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .detail-text {
          font-size: 0.82rem;
          color: #334155;
          margin: 0;
          font-weight: 500;
        }

        /* Note Callout Box */
        .note-callout-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #0f172a;
          border-radius: 8px;
          padding: 0.75rem 0.95rem;
        }

        .note-header {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.2rem;
          color: #0f172a;
        }
        .note-icon { color: #0f172a; }
        .note-title {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .note-text {
          font-size: 0.78rem;
          color: #334155;
          line-height: 1.42;
          margin: 0;
          font-weight: 500;
        }

        /* 3D Reference Showcase Frame */
        .reference-box-container {
          display: flex;
          flex-direction: column;
        }

        .reference-header {
          margin-bottom: 0.3rem;
        }
        .reference-title {
          font-size: 0.78rem;
          font-weight: 800;
          color: #0f172a;
        }

        .reference-img-frame {
          position: relative;
          width: 100%;
          height: 165px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 6px;
          box-sizing: border-box;
        }
        .ref-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 4px;
        }

        .ref-fallback-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }
        .cad-3d-svg { width: 55px; height: 55px; }
        .fallback-text { font-size: 0.72rem; color: #64748b; font-weight: 700; }

        .ref-img-tag {
          position: absolute;
          bottom: 6px;
          right: 6px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        /* 6. Footer Section */
        .sheet-footer {
          position: relative;
          z-index: 1;
          margin-top: auto;
          padding-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid #e2e8f0;
        }

        .footer-brand-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .footer-contact-row {
          font-size: 0.78rem;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .contact-icon { color: #0f172a; }
        .contact-sep { color: #cbd5e1; }
        .footer-contact-row a { color: #0f172a; text-decoration: underline; }

        .footer-guarantee {
          font-size: 0.68rem;
          color: #64748b;
          margin: 0;
          font-weight: 600;
        }

        .footer-qr-group {
          display: flex;
          align-items: flex-end;
          gap: 0.9rem;
        }

        .qr-badge-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 5px 8px 6px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }
        .qr-code-wrapper {
          width: 78px;
          height: 78px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qr-code-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 4px;
        }
        .qr-card-label {
          font-size: 0.64rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: 0.06em;
        }
        .qr-card-label.bold-ig { color: #0f172a; }

        /* ------------------------------------------------------------- */
        /* PERFECT FULL 1-PAGE A4 & LETTER PRINT MEDIA QUERY */
        /* ------------------------------------------------------------- */
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            height: 100% !important;
            overflow: hidden !important;
          }

          /* Hide UI overlay elements */
          .no-print,
          .quixotic-topbar,
          .quixotic-vertical-sidebar,
          .pdf-control-bar,
          .pdf-edit-panel,
          header,
          nav,
          aside {
            display: none !important;
          }

          /* Reset root containers to fill height */
          html, body, .app, .quixotic-admin-root, .quixotic-body-wrapper, .quixotic-main-content, .pro-pdf-view-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Fill A4 page height top to bottom gracefully */
          #printable-invoice {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 297mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 14mm 16mm 12mm 16mm !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            overflow: hidden !important;
          }
        }
      `}</style>

    </div>
  );
}
