import React, { useState } from 'react';
import { FileText, Plus, Minus, Search, Eye, CheckCircle, Printer, ArrowLeft, DollarSign, Filter, Trash2, ArrowRight, X, Sparkles, Building, Mail, Calendar, Save, ShoppingCart, Zap, Layers, Tag, User, CreditCard } from 'lucide-react';
import InvoiceDocumentView from './InvoiceDocumentView';

export default function InvoicingTab({ invoices, setInvoices, onToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('all'); // 'all' | 'Factura' | 'Cotización'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Pagada' | 'Pendiente' | 'Facturada'

  // View Mode: 'list' | 'create' | 'detail'
  const [currentView, setCurrentView] = useState('list');
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Form State for Creating New Document
  const [formData, setFormData] = useState({
    type: 'Factura',
    invoiceCategory: 'Consumo Final (B02)', // NCF: B01, B02, B15, Pro-Forma
    paymentMethod: 'Transferencia Bancaria', // Transferencia, Efectivo, Tarjeta, Crédito
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    deliveryTime: '3 a 5 Días Hábiles',
    shippingAddress: 'Plaza Hache, Segundo Nivel, Av. Estrella Sadhalá, Santiago, RD',
    referenceImage: '/images/cat_robot.png',
    dueDateDays: 30,
    items: [{ description: 'Impresión 3D Pieza Personalizada (PLA Pro)', qty: 1, unitPrice: 45.00 }]
  });

  // Calculate Financial KPI Summary Metrics
  const totalBilled = invoices
    .filter(i => i.status === 'Pagada' || i.status === 'Facturada')
    .reduce((sum, i) => sum + i.total, 0);

  const totalQuotesValue = invoices
    .filter(i => i.type === 'Cotización')
    .reduce((sum, i) => sum + i.total, 0);

  const totalITBIS = invoices
    .filter(i => i.status === 'Pagada' || i.status === 'Facturada')
    .reduce((sum, i) => sum + i.tax, 0);

  const paidCount = invoices.filter(i => i.status === 'Pagada').length;

  // Filtered List
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeType === 'all' || inv.type === activeType;
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Handlers
  const handleOpenCreateForm = () => {
    setFormData({
      type: 'Factura',
      invoiceCategory: 'Consumo Final (B02)',
      paymentMethod: 'Transferencia Bancaria',
      clientName: '',
      clientEmail: '',
      dueDateDays: 14,
      items: [{ description: 'Impresión 3D Pieza Personalizada (PLA Pro)', qty: 1, unitPrice: 45.00 }]
    });
    setCurrentView('create');
  };

  const handleOpenDetailView = (doc) => {
    setSelectedDoc(doc);
    setCurrentView('detail');
  };

  const handleStatusChange = (id, newStatus) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
    if (onToast) onToast(`🔄 Estado de ${id} actualizado a "${newStatus}".`);
  };

  const handleConvertToInvoice = (quote) => {
    const newId = `FAC-2026-${Math.floor(100 + Math.random() * 900)}`;
    setInvoices(prev => prev.map(inv => {
      if (inv.id === quote.id) {
        return {
          ...inv,
          id: newId,
          type: 'Factura',
          invoiceCategory: 'Crédito Fiscal (B01)',
          status: 'Facturada'
        };
      }
      return inv;
    }));
    if (onToast) onToast(`🎉 Cotización convertida en Factura #${newId}`);
    if (currentView === 'detail') {
      setSelectedDoc(prev => ({ ...prev, id: newId, type: 'Factura', invoiceCategory: 'Crédito Fiscal (B01)', status: 'Facturada' }));
    }
  };

  const handleDeleteDoc = (id) => {
    if (window.confirm(`¿Está seguro de eliminar el comprobante ${id}?`)) {
      setInvoices(prev => prev.filter(i => i.id !== id));
      if (onToast) onToast(`🗑️ Comprobante ${id} eliminado.`);
      if (currentView === 'detail') setCurrentView('list');
    }
  };

  const handleAddItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', qty: 1, unitPrice: 0 }]
    }));
  };

  const handleRemoveItemRow = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName || formData.items.length === 0) return;

    const subtotal = formData.items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.unitPrice)), 0);
    const tax = subtotal * 0.18; // 18% ITBIS
    const total = subtotal + tax;

    const prefix = formData.type === 'Factura' ? 'FAC-2026' : 'COT-2026';
    const todayStr = new Date().toLocaleDateString('en-US');
    const dueDateStr = new Date(Date.now() + (formData.dueDateDays || 30) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US');

    const newDoc = {
      id: `${prefix}-${Math.floor(100 + Math.random() * 900)}`,
      type: formData.type,
      invoiceCategory: formData.invoiceCategory,
      paymentMethod: formData.paymentMethod,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail || 'nobelminaya@gmail.com',
      clientPhone: formData.clientPhone || '849 851 4655',
      date: todayStr,
      dueDate: dueDateStr,
      deliveryTime: formData.deliveryTime || '3 a 5 Días Hábiles',
      shippingAddress: formData.shippingAddress || 'Plaza Hache, Segundo Nivel, Av. Estrella Sadhalá, Santiago, RD',
      referenceImage: formData.referenceImage || '/images/cat_robot.png',
      items: formData.items.map(i => ({
        description: i.description,
        qty: Number(i.qty || 1),
        unitPrice: Number(i.unitPrice || 0),
        itb: '0%',
        total: Number(i.qty || 1) * Number(i.unitPrice || 0)
      })),
      subtotal,
      tax,
      paidAmount: formData.type === 'Factura' ? total : 0,
      total,
      status: formData.type === 'Factura' ? 'Facturada' : 'Pendiente'
    };

    setInvoices(prev => [newDoc, ...prev]);
    if (onToast) onToast(`🎉 ${newDoc.type} #${newDoc.id} emitida con éxito.`);
    setSelectedDoc(newDoc);
    setCurrentView('detail');
  };

  // POS Catalogue & State
  const [posSearch, setPosSearch] = useState('');
  const [posCategory, setPosCategory] = useState('Todos');

  const POS_CATALOGUE = [
    { id: 'c1', name: 'Servicio Impresión PLA (Hora)', category: 'Servicios 3D', price: 15.00, icon: '🖨️' },
    { id: 'c2', name: 'Servicio Impresión Resina (Hora)', category: 'Servicios 3D', price: 22.00, icon: '🧪' },
    { id: 'c3', name: 'Diseño CAD / Modelado 3D (Hora)', category: 'Servicios 3D', price: 35.00, icon: '📐' },
    { id: 'c4', name: 'Filamento PLA Pro 1.75mm (1kg)', category: 'Filamentos', price: 28.00, icon: '🧵' },
    { id: 'c5', name: 'Resina Standard 8K 405nm (1kg)', category: 'Resinas', price: 48.00, icon: '🧴' },
    { id: 'c6', name: 'Boquilla Latón Hardened 0.4mm', category: 'Repuestos', price: 12.00, icon: '🔩' },
    { id: 'c7', name: 'Reloj Criollo Minimalist 3D', category: 'Productos', price: 45.00, icon: '⏱️' },
    { id: 'c8', name: 'Lámpara Voronoi LED RGB 3D', category: 'Productos', price: 65.00, icon: '💡' }
  ];

  const handleQuickAddProduct = (prod) => {
    setFormData(prev => {
      const existingIdx = prev.items.findIndex(i => i.description.toLowerCase() === prod.name.toLowerCase());
      if (existingIdx >= 0) {
        const updated = [...prev.items];
        updated[existingIdx].qty = Number(updated[existingIdx].qty || 1) + 1;
        return { ...prev, items: updated };
      }
      const cleanItems = prev.items.filter(i => i.description.trim() !== '');
      return {
        ...prev,
        items: [...cleanItems, { description: prod.name, qty: 1, unitPrice: prod.price }]
      };
    });
  };

  // -------------------------------------------------------------
  // VIEW 1: DEDICATED POS TERMINAL FOR INVOICES & QUOTES
  // -------------------------------------------------------------
  if (currentView === 'create') {
    const calcSubtotal = formData.items.reduce((sum, i) => sum + (Number(i.qty || 0) * Number(i.unitPrice || 0)), 0);
    const calcTax = calcSubtotal * 0.18;
    const calcTotal = calcSubtotal + calcTax;

    const filteredCatalogue = POS_CATALOGUE.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(posSearch.toLowerCase()) ||
                            item.category.toLowerCase().includes(posSearch.toLowerCase());
      const matchesCat = posCategory === 'Todos' || item.category === posCategory;
      return matchesSearch && matchesCat;
    });

    return (
      <div className="pos-terminal-page animate-fade-in">
        
        {/* Top POS Header */}
        <div className="pos-header-bar">
          <button className="pos-back-btn" onClick={() => setCurrentView('list')}>
            <ArrowLeft size={18} /> Volver a Facturación
          </button>

          <div className="pos-doc-type-pills">
            <button
              type="button"
              className={`pos-type-pill ${formData.type === 'Factura' ? 'active-fac' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'Factura', invoiceCategory: 'Consumo Final (B02)' })}
            >
              📄 Factura POS
            </button>
            <button
              type="button"
              className={`pos-type-pill ${formData.type === 'Cotización' ? 'active-cot' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'Cotización', invoiceCategory: 'Cotización Pro-Forma' })}
            >
              🏷️ Cotización 3D
            </button>
          </div>
        </div>

        {/* 2-Column POS Workspace */}
        <div className="pos-workspace-grid">
          
          {/* Left Column: Product & Service Catalogue */}
          <div className="pos-catalogue-card">
            
            <div className="catalogue-top-bar">
              <div className="pos-search-wrapper">
                <Search size={17} className="pos-search-icon" />
                <input
                  type="text"
                  className="pos-search-input"
                  placeholder="Buscar en catálogo de servicios e insumos 3D..."
                  value={posSearch}
                  onChange={e => setPosSearch(e.target.value)}
                />
              </div>

              <div className="pos-cat-pills">
                {['Todos', 'Servicios 3D', 'Filamentos', 'Resinas', 'Repuestos', 'Productos'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`pos-cat-pill ${posCategory === cat ? 'active' : ''}`}
                    onClick={() => setPosCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalogue Grid */}
            <div className="catalogue-grid">
              {filteredCatalogue.map(prod => (
                <div
                  key={prod.id}
                  className="pos-product-tile"
                  onClick={() => handleQuickAddProduct(prod)}
                >
                  <div className="tile-icon">{prod.icon}</div>
                  <div className="tile-info">
                    <span className="tile-category">{prod.category}</span>
                    <h4 className="tile-name">{prod.name}</h4>
                    <span className="tile-price">RD$ {prod.price.toFixed(2)}</span>
                  </div>
                  <button type="button" className="tile-add-btn" title="Añadir a Cotización / Factura">
                    <Plus size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Manual Item Row Add */}
            <div className="pos-manual-add-bar mt-3">
              <button type="button" className="pos-manual-btn" onClick={handleAddItemRow}>
                <Plus size={16} /> Añadir Ítem o Servicio Personalizado
              </button>
            </div>

          </div>

          {/* Right Column: Live POS Ticket / Checkout Terminal */}
          <div className="pos-ticket-card">
            <form onSubmit={handleCreateSubmit} className="pos-ticket-form">
              
              <div className="ticket-header-row">
                <span className="ticket-title">
                  <ShoppingCart size={18} /> Ticket POS #{formData.type === 'Factura' ? 'FAC-2026' : 'COT-2026'}
                </span>
                <span className="ticket-count-badge">{formData.items.length} ítems</span>
              </div>

              {/* Customer & NCF Selectors */}
              <div className="ticket-customer-box">
                <div className="ticket-field-group">
                  <label className="ticket-label">Cliente / Empresa</label>
                  <input
                    type="text"
                    className="ticket-input"
                    placeholder="Nombre del Cliente (Ej: Carlos Mendoza)"
                    value={formData.clientName}
                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="ticket-field-grid">
                  <div className="ticket-field-group">
                    <label className="ticket-label">Tipo de NCF / Comprobante</label>
                    <select
                      className="ticket-select"
                      value={formData.invoiceCategory}
                      onChange={e => {
                        const val = e.target.value;
                        const isQuote = val.includes('Cotización');
                        setFormData({ 
                          ...formData, 
                          invoiceCategory: val, 
                          type: isQuote ? 'Cotización' : 'Factura' 
                        });
                      }}
                    >
                      <option value="Consumo Final (B02)">Consumo Final (B02)</option>
                      <option value="Crédito Fiscal (B01)">Crédito Fiscal (B01)</option>
                      <option value="Gubernamental (B15)">Gubernamental (B15)</option>
                      <option value="Cotización Pro-Forma">Cotización Pro-Forma</option>
                    </select>
                  </div>

                  <div className="ticket-field-group">
                    <label className="ticket-label">Método de Pago</label>
                    <select
                      className="ticket-select"
                      value={formData.paymentMethod}
                      onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                    >
                      <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                      <option value="Efectivo en Taller">Efectivo en Taller</option>
                      <option value="Tarjeta / Verifone">Tarjeta / Verifone</option>
                      <option value="Pago Móvil / PayPal">PayPal / Zelle</option>
                      <option value="Crédito Corporativo (15 Días)">Crédito 15 Días</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Itemized Ticket List */}
              <div className="ticket-items-scroll">
                {formData.items.map((item, idx) => (
                  <div key={idx} className="ticket-item-row">
                    <div className="item-details">
                      <input
                        type="text"
                        className="item-name-input"
                        placeholder="Descripción de Pieza o Servicio 3D"
                        value={item.description}
                        onChange={e => handleItemChange(idx, 'description', e.target.value)}
                        required
                      />
                      <div className="item-price-unit">
                        <span>$</span>
                        <input
                          type="number"
                          step="0.01"
                          className="item-price-input"
                          value={item.unitPrice}
                          onChange={e => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div className="item-qty-controls">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => handleItemChange(idx, 'qty', Math.max(1, Number(item.qty || 1) - 1))}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="qty-val">{item.qty}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => handleItemChange(idx, 'qty', Number(item.qty || 1) + 1)}
                      >
                        <Plus size={13} />
                      </button>

                      <button
                        type="button"
                        className="ticket-delete-btn"
                        onClick={() => handleRemoveItemRow(idx)}
                        title="Eliminar ítem"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Totals Box */}
              <div className="ticket-totals-box">
                <div className="subtotal-line">
                  <span>Subtotal:</span>
                  <strong>RD$ {calcSubtotal.toFixed(2)}</strong>
                </div>
                <div className="subtotal-line">
                  <span>ITBIS Fiscal (18%):</span>
                  <strong>RD$ {calcTax.toFixed(2)}</strong>
                </div>
                <div className="total-line-big">
                  <span>Total {formData.type}:</span>
                  <span className="total-big-val">RD$ {calcTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="ticket-actions-flex">
                <button type="button" className="pos-cancel-btn" onClick={() => setCurrentView('list')}>
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={`pos-checkout-btn ${formData.type === 'Factura' ? 'btn-blue' : 'btn-amber'}`}
                >
                  {formData.type === 'Factura' ? <Zap size={18} /> : <FileText size={18} />}
                  Emitir {formData.type} POS (RD$ {calcTotal.toFixed(2)})
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* POS Styles */}
        <style>{`
          .pos-terminal-page {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            font-family: var(--font-body, sans-serif);
          }

          .pos-header-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            padding: 1rem 1.5rem;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
            flex-wrap: wrap;
            gap: 1rem;
          }

          .pos-back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--primary-blue, #0055ff);
          }

          .pos-header-title-box {
            display: flex;
            flex-direction: column;
          }

          .pos-main-title {
            font-family: var(--font-heading, sans-serif);
            font-size: 1.4rem;
            font-weight: 800;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .text-blue-icon {
            color: var(--primary-blue, #0055ff);
          }

          .pos-subtitle {
            font-size: 0.82rem;
            color: #6b7280;
          }

          .pos-doc-type-pills {
            display: flex;
            gap: 0.5rem;
            background: #f3f4f6;
            padding: 4px;
            border-radius: 99px;
          }

          .pos-type-pill {
            padding: 0.5rem 1.15rem;
            border-radius: 99px;
            font-size: 0.85rem;
            font-weight: 700;
            color: #6b7280;
            transition: all 0.2s ease;
          }

          .pos-type-pill.active-fac {
            background: var(--primary-blue, #0055ff);
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(0, 85, 255, 0.3);
          }

          .pos-type-pill.active-cot {
            background: #f59e0b;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          }

          .pos-workspace-grid {
            display: grid;
            grid-template-columns: 1fr 440px;
            gap: 1.5rem;
          }

          @media (max-width: 1024px) {
            .pos-workspace-grid {
              grid-template-columns: 1fr;
            }
          }

          /* Left Column: Catalogue */
          .pos-catalogue-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            padding: 1.35rem;
            display: flex;
            flex-direction: column;
            gap: 1.15rem;
          }

          .catalogue-top-bar {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
          }

          .pos-search-wrapper {
            position: relative;
            display: flex;
            align-items: center;
          }

          .pos-search-icon {
            position: absolute;
            left: 1rem;
            color: #9ca3af;
          }

          .pos-search-input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.6rem;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            font-size: 0.88rem;
            background: #f8f9fb;
            outline: none;
          }

          .pos-search-input:focus {
            border-color: var(--primary-blue, #0055ff);
            background: #ffffff;
          }

          .pos-cat-pills {
            display: flex;
            gap: 0.4rem;
            flex-wrap: wrap;
          }

          .pos-cat-pill {
            padding: 0.4rem 0.85rem;
            border-radius: 99px;
            font-size: 0.78rem;
            font-weight: 700;
            color: #6b7280;
            background: #f3f4f6;
            transition: all 0.2s ease;
          }

          .pos-cat-pill.active {
            background: #0055ff;
            color: #ffffff;
          }

          .catalogue-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
            gap: 0.85rem;
            max-height: 460px;
            overflow-y: auto;
            padding-right: 4px;
          }

          .pos-product-tile {
            background: #f8f9fb;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
          }

          .pos-product-tile:hover {
            border-color: var(--primary-blue, #0055ff);
            background: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 85, 255, 0.08);
          }

          .tile-icon {
            font-size: 1.6rem;
            margin-bottom: 0.4rem;
          }

          .tile-category {
            font-size: 0.68rem;
            font-weight: 800;
            color: #9ca3af;
            text-transform: uppercase;
          }

          .tile-name {
            font-size: 0.88rem;
            font-weight: 700;
            color: #111827;
            margin: 0.15rem 0 0.4rem;
            line-height: 1.25;
          }

          .tile-price {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--primary-blue, #0055ff);
          }

          .tile-add-btn {
            position: absolute;
            bottom: 0.85rem;
            right: 0.85rem;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #ebf1ff;
            color: var(--primary-blue, #0055ff);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }

          .pos-product-tile:hover .tile-add-btn {
            background: var(--primary-blue, #0055ff);
            color: #ffffff;
          }

          .pos-manual-btn {
            width: 100%;
            padding: 0.75rem;
            border-radius: 14px;
            border: 2px dashed #cbd5e1;
            font-size: 0.85rem;
            font-weight: 700;
            color: #4b5563;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            transition: all 0.2s ease;
          }

          .pos-manual-btn:hover {
            border-color: var(--primary-blue, #0055ff);
            color: var(--primary-blue, #0055ff);
            background: #ebf1ff;
          }

          /* Right Column: Ticket */
          .pos-ticket-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            padding: 1.35rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          }

          .pos-ticket-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .ticket-header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid #e5e7eb;
          }

          .ticket-title {
            font-family: var(--font-heading, sans-serif);
            font-size: 1.1rem;
            font-weight: 800;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 0.4rem;
          }

          .ticket-count-badge {
            background: #ebf1ff;
            color: var(--primary-blue, #0055ff);
            font-size: 0.75rem;
            font-weight: 800;
            padding: 0.25rem 0.65rem;
            border-radius: 99px;
          }

          .ticket-customer-box {
            background: #f8f9fb;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 0.85rem;
            display: flex;
            flex-direction: column;
            gap: 0.65rem;
          }

          .ticket-field-group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .ticket-label {
            font-size: 0.72rem;
            font-weight: 800;
            color: #6b7280;
          }

          .ticket-input, .ticket-select {
            width: 100%;
            padding: 0.55rem 0.75rem;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            font-size: 0.82rem;
            background: #ffffff;
            outline: none;
          }

          .ticket-field-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.65rem;
          }

          .ticket-items-scroll {
            max-height: 280px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            padding-right: 4px;
          }

          .ticket-item-row {
            background: #f8f9fb;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 0.65rem 0.85rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
          }

          .item-details {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            flex: 1;
          }

          .item-name-input {
            font-size: 0.82rem;
            font-weight: 700;
            color: #111827;
            border: none;
            background: transparent;
            outline: none;
            width: 100%;
          }

          .item-price-unit {
            display: flex;
            align-items: center;
            gap: 0.2rem;
            font-size: 0.8rem;
            color: #6b7280;
          }

          .item-price-input {
            width: 70px;
            font-size: 0.8rem;
            font-weight: 700;
            color: var(--primary-blue, #0055ff);
            border: none;
            background: transparent;
            outline: none;
          }

          .item-qty-controls {
            display: flex;
            align-items: center;
            gap: 0.4rem;
          }

          .qty-btn {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #374151;
          }

          .qty-val {
            font-size: 0.85rem;
            font-weight: 800;
            color: #111827;
            min-width: 18px;
            text-align: center;
          }

          .ticket-delete-btn {
            color: #ef4444;
            background: transparent;
            padding: 4px;
          }

          .ticket-totals-box {
            background: #f8f9fb;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 0.85rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
          }

          .subtotal-line {
            display: flex;
            justify-content: space-between;
            font-size: 0.82rem;
            color: #6b7280;
          }

          .total-line-big {
            display: flex;
            justify-content: space-between;
            font-size: 1.15rem;
            font-weight: 800;
            color: #111827;
            border-top: 1px solid #e5e7eb;
            padding-top: 0.5rem;
            margin-top: 0.2rem;
          }

          .total-big-val {
            color: var(--primary-blue, #0055ff);
            font-weight: 900;
          }

          .ticket-actions-flex {
            display: flex;
            gap: 0.65rem;
          }

          .pos-cancel-btn {
            padding: 0.75rem 1.1rem;
            border-radius: 99px;
            font-size: 0.85rem;
            font-weight: 700;
            color: #4b5563;
            background: #f3f4f6;
          }

          .pos-checkout-btn {
            flex: 1;
            padding: 0.75rem 1.25rem;
            border-radius: 99px;
            font-size: 0.88rem;
            font-weight: 800;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            transition: all 0.2s ease;
          }

          .pos-checkout-btn.btn-blue {
            background: var(--primary-blue, #0055ff);
            box-shadow: 0 4px 16px rgba(0, 85, 255, 0.3);
          }

          .pos-checkout-btn.btn-amber {
            background: #f59e0b;
            box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
          }
        `}</style>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: DEDICATED PRINTABLE PDF DOCUMENT VIEW
  // -------------------------------------------------------------
  if (currentView === 'detail' && selectedDoc) {
    return (
      <InvoiceDocumentView
        doc={selectedDoc}
        onBack={() => setCurrentView('list')}
        onUpdateDoc={(updatedDoc) => {
          setSelectedDoc(updatedDoc);
          setInvoices(prev => prev.map(inv => inv.id === updatedDoc.id ? updatedDoc : inv));
        }}
        onDeleteDoc={handleDeleteDoc}
        onConvertToInvoice={handleConvertToInvoice}
        onToast={onToast}
      />
    );
  }

  // -------------------------------------------------------------
  // DEFAULT VIEW: LIST OF INVOICES AND QUOTES TABLE
  // -------------------------------------------------------------
  return (
    <div className="pro-invoicing-list-root animate-fade-in">
      
      {/* 1. Header Row */}
      <div className="invoicing-hero-header">
        <div>
          <h1 className="invoicing-hero-title">Facturación y Cotizaciones 3D</h1>
          <p className="invoicing-hero-sub">Emisión de comprobantes fiscales, cotizaciones recibidas y gestión de cobros</p>
        </div>

        <button className="invoicing-add-btn" onClick={handleOpenCreateForm}>
          <Plus size={18} /> Crear Comprobante
        </button>
      </div>

      {/* 2. Financial KPI Cards */}
      <div className="invoicing-kpi-grid">
        
        <div className="kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-label">FACTURACIÓN ACUMULADA</span>
            <div className="kpi-icon-box bg-blue-soft">
              <DollarSign size={18} className="text-blue" />
            </div>
          </div>
          <h2 className="kpi-number">RD$ {totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
        </div>

        <div className="kpi-card" onClick={() => setActiveType('Cotización')} style={{ cursor: 'pointer' }}>
          <div className="kpi-card-top">
            <span className="kpi-label">VALOR EN COTIZACIONES</span>
            <div className="kpi-icon-box bg-amber-soft">
              <FileText size={18} className="text-amber" />
            </div>
          </div>
          <h2 className="kpi-number text-amber">RD$ {totalQuotesValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-label">ITBIS (18%) RECAUDADO</span>
            <div className="kpi-icon-box bg-indigo-soft">
              <Building size={18} className="text-indigo" />
            </div>
          </div>
          <h2 className="kpi-number">RD$ {totalITBIS.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-label">COMPROBANTES PAGADOS</span>
            <div className="kpi-icon-box bg-emerald-soft">
              <CheckCircle size={18} className="text-emerald" />
            </div>
          </div>
          <h2 className="kpi-number text-emerald">{paidCount} pagados</h2>
        </div>

      </div>

      {/* 3. Controls (Search + Type Pills + Status Dropdown) */}
      <div className="invoicing-controls-card">
        
        {/* Search Bar */}
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por cliente, correo o N°..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Type Pills */}
        <div className="type-pills-row">
          <button 
            className={`type-pill ${activeType === 'all' ? 'active' : ''}`}
            onClick={() => setActiveType('all')}
          >
            Todos
          </button>
          <button 
            className={`type-pill ${activeType === 'Factura' ? 'active' : ''}`}
            onClick={() => setActiveType('Factura')}
          >
            Facturas
          </button>
          <button 
            className={`type-pill ${activeType === 'Cotización' ? 'active' : ''}`}
            onClick={() => setActiveType('Cotización')}
          >
            Cotizaciones
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="status-filter-wrapper">
          <Filter size={16} className="filter-icon" />
          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="Pagada">Pagada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Facturada">Facturada</option>
          </select>
        </div>

      </div>

      {/* 4. Main Invoices & Quotes Table */}
      <div className="invoicing-table-card">
        <div className="table-responsive">
          <table className="invoicing-table">
            <thead>
              <tr>
                <th>Comprobante N°</th>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>Fecha Emisión</th>
                <th>Subtotal</th>
                <th>ITBIS (18%)</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-cell">
                    <FileText size={36} className="text-muted mb-2" />
                    <p>No se encontraron facturas ni cotizaciones con los criterios seleccionados.</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <code className="doc-code-badge">{inv.id}</code>
                    </td>
                    <td>
                      <span className={`doc-type-pill ${inv.type === 'Factura' ? 'fac' : 'cot'}`}>
                        {inv.type}
                      </span>
                    </td>
                    <td>
                      <div className="client-cell-flex">
                        <div className="client-avatar-circle">
                          {inv.clientName.charAt(0)}
                        </div>
                        <div>
                          <div className="client-name-bold">{inv.clientName}</div>
                          <div className="client-email-sub">{inv.clientEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td>{inv.date}</td>
                    <td className="font-600 color-gray-700">RD$ {inv.subtotal.toFixed(2)}</td>
                    <td className="font-600 color-gray-600">RD$ {inv.tax.toFixed(2)}</td>
                    <td className="font-800 color-blue-primary">RD$ {inv.total.toFixed(2)}</td>
                    <td>
                      <select
                        className={`status-inline-select ${inv.status.toLowerCase()}`}
                        value={inv.status}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                      >
                        <option value="Pagada">● Pagada</option>
                        <option value="Pendiente">● Pendiente</option>
                        <option value="Facturada">● Facturada</option>
                      </select>
                    </td>
                    <td>
                      <div className="actions-cell-flex text-right">
                        <button
                          className="action-btn view"
                          onClick={() => handleOpenDetailView(inv)}
                          title="Ver / Imprimir Comprobante"
                        >
                          <Eye size={15} /> Ver PDF
                        </button>

                        {inv.type === 'Cotización' && inv.status === 'Pendiente' && (
                          <button
                            className="action-btn convert"
                            onClick={() => handleConvertToInvoice(inv)}
                            title="Convertir a Factura"
                          >
                            <ArrowRight size={15} />
                          </button>
                        )}

                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteDoc(inv.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .pro-invoicing-list-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          font-family: var(--font-body, system-ui, sans-serif);
        }

        /* Hero Header */
        .invoicing-hero-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .invoicing-hero-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.85rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.03em;
        }

        .invoicing-hero-sub {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 0.15rem;
        }

        .invoicing-add-btn {
          background: var(--primary-blue, #0055ff);
          color: #ffffff;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 0.65rem 1.25rem;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 85, 255, 0.25);
        }

        .invoicing-add-btn:hover {
          background: #0040d0;
          transform: translateY(-1px);
        }

        /* KPI Cards Grid */
        .invoicing-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        .kpi-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 1.25rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .kpi-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .kpi-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #6b7280;
          letter-spacing: 0.04em;
        }

        .kpi-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-blue-soft { background: #ebf1ff; }
        .bg-amber-soft { background: #fef3c7; }
        .bg-indigo-soft { background: #e0e7ff; }
        .bg-emerald-soft { background: #d1fae5; }

        .text-blue { color: #0055ff; }
        .text-amber { color: #d97706; }
        .text-indigo { color: #4f46e5; }
        .text-emerald { color: #059669; }

        .kpi-number {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.5rem;
          font-weight: 900;
          color: #111827;
          letter-spacing: -0.02em;
        }

        /* Controls Card */
        .invoicing-controls-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }

        .search-box-wrapper {
          position: relative;
          flex: 1;
          min-width: 240px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 0.6rem 2.2rem 0.6rem 2.6rem;
          border: 1px solid #e5e7eb;
          border-radius: 99px;
          font-size: 0.85rem;
          outline: none;
          background: #f8f9fb;
          transition: all 0.2s ease;
          font-family: var(--font-body);
        }

        .search-input:focus {
          background: #ffffff;
          border-color: var(--primary-blue, #0055ff);
          box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.1);
        }

        .clear-search-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .type-pills-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .type-pill {
          padding: 0.5rem 0.9rem;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #4b5563;
          background: #f4f5f8;
          transition: all 0.2s ease;
          font-family: var(--font-body);
        }

        .type-pill:hover {
          color: var(--primary-blue, #0055ff);
          background: #ebf1ff;
        }

        .type-pill.active {
          background: var(--primary-blue, #0055ff);
          color: #ffffff;
          font-weight: 700;
        }

        .status-filter-wrapper {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #f4f5f8;
          padding: 0.35rem 0.75rem;
          border-radius: 99px;
          border: 1px solid #e5e7eb;
        }

        .filter-icon {
          color: #6b7280;
        }

        .status-select {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.8rem;
          font-weight: 700;
          color: #374151;
          cursor: pointer;
          font-family: var(--font-body);
        }

        /* Invoices Table */
        .invoicing-table-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .invoicing-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }

        .invoicing-table th {
          text-align: left;
          font-size: 0.78rem;
          color: #6b7280;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          padding: 0.85rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f8f9fb;
        }

        .invoicing-table td {
          padding: 0.95rem 1rem;
          border-bottom: 1px solid #f4f5f8;
          color: #374151;
          vertical-align: middle;
        }

        .doc-code-badge {
          font-family: monospace;
          font-weight: 700;
          background: #f1f5f9;
          padding: 0.25rem 0.55rem;
          border-radius: 6px;
          color: #111827;
          font-size: 0.8rem;
        }

        .doc-type-pill {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .doc-type-pill.fac { background: #dbeafe; color: #1e40af; }
        .doc-type-pill.cot { background: #fef3c7; color: #92400e; }

        .client-cell-flex {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .client-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ebf1ff;
          color: var(--primary-blue, #0055ff);
          font-weight: 800;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .client-name-bold {
          font-weight: 700;
          color: #111827;
        }

        .client-email-sub {
          font-size: 0.72rem;
          color: #9ca3af;
        }

        .color-blue-primary {
          color: var(--primary-blue, #0055ff);
        }

        .status-inline-select {
          padding: 0.3rem 0.65rem;
          border-radius: 99px;
          font-size: 0.78rem;
          font-weight: 800;
          border: 1px solid transparent;
          outline: none;
          cursor: pointer;
          font-family: var(--font-body);
        }

        .status-inline-select.pagada { background: #d1fae5; color: #065f46; }
        .status-inline-select.pendiente { background: #fef3c7; color: #92400e; }
        .status-inline-select.facturada { background: #ebf1ff; color: var(--primary-blue, #0055ff); }

        .actions-cell-flex {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.4rem;
        }

        .action-btn {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: all 0.2s ease;
        }

        .action-btn.view { background: #ebf1ff; color: var(--primary-blue, #0055ff); }
        .action-btn.view:hover { background: #dbeafe; }

        .action-btn.convert { background: #fef3c7; color: #92400e; }
        .action-btn.convert:hover { background: #fde68a; }

        .action-btn.delete { background: #fee2e2; color: #dc2626; padding: 0.35rem 0.55rem; }
        .action-btn.delete:hover { background: #fca5a5; }

        .empty-cell {
          text-align: center;
          padding: 3rem 1rem !important;
          color: #6b7280;
        }

        @media (max-width: 900px) {
          .invoicing-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .invoicing-kpi-grid { grid-template-columns: 1fr; gap: 0.75rem; }
          .invoicing-header-row { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .invoicing-controls-card { padding: 0.85rem; flex-direction: column; align-items: stretch; gap: 0.75rem; }
          .search-box-wrapper { min-width: 100%; }
          .type-pills-row { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .status-filter-wrapper { width: 100%; justify-content: space-between; }
          .form-grid-2-col { grid-template-columns: 1fr !important; }
          .item-row-form { flex-direction: column; align-items: stretch; gap: 0.5rem; background: #f8f9fb; padding: 0.75rem; border-radius: 12px; }
        }
      `}</style>
    </div>
  );
}
