import React, { useState } from 'react';
import { Package, Plus, Search, Filter, AlertTriangle, Edit2, Trash2, CheckCircle2, DollarSign, ArrowLeft, Save, X } from 'lucide-react';

export default function InventoryTab({ inventory, setInventory, onToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterStockStatus, setFilterStockStatus] = useState('all'); // 'all' | 'low' | 'ok' | 'out'

  // View State: 'list' | 'form'
  const [currentView, setCurrentView] = useState('list');
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Filamentos',
    stock: 10,
    minStock: 5,
    unitCost: 18.00,
    unitPrice: 28.00,
    supplier: 'Criollo3D Taller'
  });

  // Calculate Key Inventory Metrics
  const totalItemsCount = inventory.length;
  const totalValuation = inventory.reduce((sum, i) => sum + (i.stock * i.unitCost), 0);
  const lowStockCount = inventory.filter(i => i.stock > 0 && i.stock <= i.minStock).length;
  const outOfStockCount = inventory.filter(i => i.stock === 0).length;

  // Filter logic
  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    
    let matchesStatus = true;
    if (filterStockStatus === 'low') matchesStatus = item.stock > 0 && item.stock <= item.minStock;
    if (filterStockStatus === 'out') matchesStatus = item.stock === 0;
    if (filterStockStatus === 'ok') matchesStatus = item.stock > item.minStock;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const categories = ['All', 'Filamentos', 'Resinas', 'Productos Terminado', 'Repuestos'];

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setFormData({
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      category: 'Filamentos',
      stock: 10,
      minStock: 5,
      unitCost: 18.00,
      unitPrice: 30.00,
      supplier: 'Criollo3D Supplier'
    });
    setCurrentView('form');
  };

  const handleOpenEditForm = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setCurrentView('form');
  };

  const handleDeleteItem = (id, name) => {
    if (window.confirm(`¿Está seguro de eliminar "${name}" del inventario?`)) {
      setInventory(prev => prev.filter(i => i.id !== id));
      if (onToast) onToast(`🗑️ Ítem "${name}" eliminado del inventario.`);
    }
  };

  const handleAdjustStock = (id, delta) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, Number(item.stock) + delta);
        let newStatus = 'ok';
        if (newStock === 0) newStatus = 'out';
        else if (newStock <= item.minStock) newStatus = 'low';
        return { ...item, stock: newStock, status: newStatus };
      }
      return item;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    let updatedStatus = 'ok';
    if (Number(formData.stock) === 0) updatedStatus = 'out';
    else if (Number(formData.stock) <= Number(formData.minStock)) updatedStatus = 'low';

    if (editingItem) {
      setInventory(prev => prev.map(item => 
        item.id === editingItem.id ? { ...formData, id: editingItem.id, status: updatedStatus } : item
      ));
      if (onToast) onToast(`✏️ Ítem "${formData.name}" actualizado.`);
    } else {
      const newItem = {
        ...formData,
        id: `inv-${Date.now()}`,
        status: updatedStatus
      };
      setInventory(prev => [newItem, ...prev]);
      if (onToast) onToast(`📦 Nuevo ítem "${formData.name}" registrado.`);
    }

    setCurrentView('list');
  };

  // IF FORM VIEW IS ACTIVE: RENDER CLEAN DEDICATED FORM PAGE VIEW (NO BACKGROUND BLEEDING THROUGH)
  if (currentView === 'form') {
    const marginPct = formData.unitPrice > 0 && formData.unitCost > 0
      ? (((formData.unitPrice - formData.unitCost) / formData.unitCost) * 100).toFixed(1)
      : '0.0';

    return (
      <div className="pro-inventory-form-page animate-fade-in">
        
        {/* Top Header */}
        <div className="form-page-header">
          <button className="back-link-btn" onClick={() => setCurrentView('list')}>
            <ArrowLeft size={18} /> Volver al Inventario
          </button>

          <div className="form-title-box">
            <h1 className="form-page-title">
              {editingItem ? 'Editar Ítem de Inventario' : 'Agregar Nuevo Ítem 3D'}
            </h1>
            <p className="form-page-sub">Especifique los parámetros del insumo o producto para actualizar el taller</p>
          </div>
        </div>

        {/* Clean Main Form Card */}
        <div className="form-card-container">
          <form onSubmit={handleSubmit} className="form-body">
            
            {/* Section 1: General Info */}
            <div className="form-section">
              <span className="section-header-tag">📌 INFORMACIÓN GENERAL</span>
              
              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label">Código SKU</label>
                  <input
                    type="text"
                    className="field-input"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU-XXXX"
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Categoría</label>
                  <select
                    className="field-select"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Filamentos">Filamentos</option>
                    <option value="Resinas">Resinas</option>
                    <option value="Productos Terminado">Productos Terminado</option>
                    <option value="Repuestos">Repuestos</option>
                  </select>
                </div>
              </div>

              <div className="field-group mt-3">
                <label className="field-label">Nombre del Insumo o Producto 3D</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Ej: Filamento PLA Pro Negro 1.75mm (1kg)"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="field-group mt-3">
                <label className="field-label">Proveedor / Marca</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="Ej: eSUN, Sunlu, Anycubic, Producción Interna"
                  value={formData.supplier}
                  onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
            </div>

            {/* Section 2: Stock and Pricing */}
            <div className="form-section mt-4">
              <span className="section-header-tag">📊 CONTROL DE STOCK Y PRECIOS</span>

              <div className="form-row-2">
                <div className="field-group">
                  <label className="field-label">Stock Inicial</label>
                  <input
                    type="number"
                    className="field-input"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    min="0"
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Alerta Mínima de Stock</label>
                  <input
                    type="number"
                    className="field-input"
                    value={formData.minStock}
                    onChange={e => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2 mt-3">
                <div className="field-group">
                  <label className="field-label">Costo Unitario ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="field-input"
                    value={formData.unitCost}
                    onChange={e => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Precio de Venta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="field-input"
                    value={formData.unitPrice}
                    onChange={e => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              {/* Profit Margin Preview Pill */}
              <div className="margin-preview-box">
                <span>Margen Estimado de Ganancia:</span>
                <span className="margin-badge">+{marginPct}%</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="form-actions-bar">
              <button type="button" className="btn-secondary" onClick={() => setCurrentView('list')}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary-blue">
                <Save size={16} /> Guardar Ítem
              </button>
            </div>

          </form>
        </div>

        <style>{`
          .pro-inventory-form-page {
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            font-family: var(--font-body, sans-serif);
          }

          .back-link-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--primary-blue, #0055ff);
            margin-bottom: 0.75rem;
            transition: color 0.2s ease;
          }

          .back-link-btn:hover {
            color: #0040d0;
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
            margin-top: 0.2rem;
          }

          .form-card-container {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 24px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          }

          .form-body {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-section {
            background: #f8f9fb;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 1.35rem 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
          }

          .section-header-tag {
            font-size: 0.72rem;
            font-weight: 800;
            color: #6b7280;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
          }

          .form-row-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          .field-group {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
          }

          .field-label {
            font-size: 0.8rem;
            font-weight: 700;
            color: #374151;
          }

          .field-input, .field-select {
            width: 100%;
            padding: 0.7rem 0.95rem;
            border: 1px solid #d1d5db;
            border-radius: 12px;
            font-size: 0.88rem;
            outline: none;
            background: #ffffff;
            color: #111827;
            font-family: var(--font-body);
            transition: all 0.2s ease;
          }

          .field-input:focus, .field-select:focus {
            border-color: var(--primary-blue, #0055ff);
            box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.12);
          }

          .margin-preview-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #ebf1ff;
            border-radius: 12px;
            padding: 0.7rem 1rem;
            font-size: 0.82rem;
            font-weight: 700;
            color: var(--primary-blue, #0055ff);
            margin-top: 0.5rem;
          }

          .margin-badge {
            background: var(--primary-blue, #0055ff);
            color: #ffffff;
            padding: 0.25rem 0.65rem;
            border-radius: 99px;
            font-weight: 800;
            font-size: 0.8rem;
          }

          .form-actions-bar {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #f4f5f8;
          }

          .btn-secondary {
            padding: 0.7rem 1.35rem;
            border-radius: 99px;
            font-size: 0.88rem;
            font-weight: 700;
            color: #4b5563;
            background: #f4f5f8;
          }

          .btn-secondary:hover {
            background: #e5e7eb;
          }

          .btn-primary-blue {
            padding: 0.7rem 1.5rem;
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

          .btn-primary-blue:hover {
            background: #0040d0;
          }
        `}</style>
      </div>
    );
  }

  // LIST VIEW (DEFAULT INVENTORY TABLE)
  return (
    <div className="pro-inventory-root animate-fade-in">
      
      {/* 1. Header Row */}
      <div className="inventory-hero-header">
        <div>
          <h1 className="inventory-hero-title">Control de Inventario e Insumos 3D</h1>
          <p className="inventory-hero-sub">Gestión de stock de carretes, resinas, repuestos y productos impresos</p>
        </div>

        <button className="inventory-add-btn" onClick={handleOpenAddForm}>
          <Plus size={18} /> Agregar Nuevo Ítem
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="inventory-kpi-grid">
        
        <div className="kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-label">TOTAL DE ÍTEMS</span>
            <div className="kpi-icon-box bg-blue-soft">
              <Package size={18} className="text-blue" />
            </div>
          </div>
          <h2 className="kpi-number">{totalItemsCount} registrados</h2>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-label">VALORACIÓN TOTAL STOCK</span>
            <div className="kpi-icon-box bg-emerald-soft">
              <DollarSign size={18} className="text-emerald" />
            </div>
          </div>
          <h2 className="kpi-number">${totalValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
        </div>

        <div className="kpi-card" onClick={() => setFilterStockStatus('low')} style={{ cursor: 'pointer' }}>
          <div className="kpi-card-top">
            <span className="kpi-label">STOCK BAJO (ALERTA)</span>
            <div className="kpi-icon-box bg-amber-soft">
              <AlertTriangle size={18} className="text-amber" />
            </div>
          </div>
          <h2 className="kpi-number text-amber">{lowStockCount} en riesgo</h2>
        </div>

        <div className="kpi-card" onClick={() => setFilterStockStatus('out')} style={{ cursor: 'pointer' }}>
          <div className="kpi-card-top">
            <span className="kpi-label">AGOTADOS</span>
            <div className="kpi-icon-box bg-rose-soft">
              <Package size={18} className="text-rose" />
            </div>
          </div>
          <h2 className="kpi-number text-rose">{outOfStockCount} agotar</h2>
        </div>

      </div>

      {/* 3. Search Bar and Category Filter Pills */}
      <div className="inventory-controls-card">
        
        {/* Search Input Box */}
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="category-pills-row">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'All' ? 'Todas las Categorías' : cat}
            </button>
          ))}
        </div>

        {/* Status Dropdown Filter */}
        <div className="status-filter-wrapper">
          <Filter size={16} className="filter-icon" />
          <select
            className="status-select"
            value={filterStockStatus}
            onChange={(e) => setFilterStockStatus(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="ok">Disponibles</option>
            <option value="low">Stock Bajo (Alerta)</option>
            <option value="out">Agotados</option>
          </select>
        </div>

      </div>

      {/* 4. Main Inventory Data Table */}
      <div className="inventory-table-card">
        <div className="table-responsive">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nombre del Insumo / Producto</th>
                <th>Categoría</th>
                <th>Costo Unid.</th>
                <th>Precio Venta</th>
                <th>Stock Actual</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-table-cell">
                    <Package size={36} className="text-muted mb-2" />
                    <p>No se encontraron insumos o productos con los filtros seleccionados.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const isLow = item.stock > 0 && item.stock <= item.minStock;
                  const isOut = item.stock === 0;

                  return (
                    <tr key={item.id}>
                      <td>
                        <code className="sku-badge">{item.sku}</code>
                      </td>
                      <td>
                        <div className="item-name-cell">
                          <span className="item-main-name">{item.name}</span>
                          <span className="item-supplier-sub">Proveedor: {item.supplier || 'Criollo3D'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-pill-tag">{item.category}</span>
                      </td>
                      <td className="font-600 color-gray-700">
                        ${Number(item.unitCost).toFixed(2)}
                      </td>
                      <td className="font-700 color-gray-900">
                        ${Number(item.unitPrice).toFixed(2)}
                      </td>
                      <td>
                        <div className="stock-control-flex">
                          <button
                            className="stock-btn minus"
                            onClick={() => handleAdjustStock(item.id, -1)}
                            title="Disminuir stock en 1"
                          >
                            -
                          </button>
                          <span className="stock-count-val">{item.stock} unids</span>
                          <button
                            className="stock-btn plus"
                            onClick={() => handleAdjustStock(item.id, 1)}
                            title="Aumentar stock en 1"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge-pill ${isOut ? 'out' : isLow ? 'low' : 'ok'}`}>
                          {isOut ? (
                            <>
                              <span className="dot-icon">🚫</span> Agotado
                            </>
                          ) : isLow ? (
                            <>
                              <span className="dot-icon">⚠️</span> Bajo Stock
                            </>
                          ) : (
                            <>
                              <span className="dot-green">●</span> Disponible
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <div className="actions-flex text-right">
                          <button
                            className="action-icon-btn edit"
                            onClick={() => handleOpenEditForm(item)}
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="action-icon-btn delete"
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .pro-inventory-root {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          font-family: var(--font-body, system-ui, sans-serif);
        }

        /* Hero Header */
        .inventory-hero-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .inventory-hero-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.85rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.03em;
        }

        .inventory-hero-sub {
          font-size: 0.85rem;
          color: #6b7280;
          margin-top: 0.15rem;
        }

        .inventory-add-btn {
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

        .inventory-add-btn:hover {
          background: #0040d0;
          transform: translateY(-1px);
        }

        /* KPI Cards Grid */
        .inventory-kpi-grid {
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
        .bg-emerald-soft { background: #d1fae5; }
        .bg-amber-soft { background: #fef3c7; }
        .bg-rose-soft { background: #fee2e2; }

        .text-blue { color: #0055ff; }
        .text-emerald { color: #059669; }
        .text-amber { color: #d97706; }
        .text-rose { color: #e11d48; }

        .kpi-number {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.5rem;
          font-weight: 900;
          color: #111827;
          letter-spacing: -0.02em;
        }

        /* Controls Card (Search + Category Pills + Status Dropdown) */
        .inventory-controls-card {
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

        .category-pills-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          overflow-x: auto;
        }

        .cat-pill {
          padding: 0.5rem 0.9rem;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #4b5563;
          background: #f4f5f8;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: var(--font-body);
        }

        .cat-pill:hover {
          color: var(--primary-blue, #0055ff);
          background: #ebf1ff;
        }

        .cat-pill.active {
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

        /* Inventory Table */
        .inventory-table-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .inventory-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }

        .inventory-table th {
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

        .inventory-table td {
          padding: 0.95rem 1rem;
          border-bottom: 1px solid #f4f5f8;
          color: #374151;
          vertical-align: middle;
        }

        .sku-badge {
          font-family: monospace;
          font-weight: 700;
          background: #f1f5f9;
          padding: 0.25rem 0.55rem;
          border-radius: 6px;
          color: #111827;
          font-size: 0.8rem;
        }

        .item-name-cell {
          display: flex;
          flex-direction: column;
        }

        .item-main-name {
          font-weight: 700;
          color: #111827;
        }

        .item-supplier-sub {
          font-size: 0.72rem;
          color: #9ca3af;
        }

        .category-pill-tag {
          font-size: 0.75rem;
          font-weight: 700;
          background: #ebf1ff;
          color: var(--primary-blue, #0055ff);
          padding: 0.25rem 0.65rem;
          border-radius: 99px;
          display: inline-block;
        }

        .stock-control-flex {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #f4f5f8;
          padding: 3px 6px;
          border-radius: 99px;
          border: 1px solid #e5e7eb;
        }

        .stock-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ffffff;
          color: #111827;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.15s ease;
        }

        .stock-btn:hover {
          background: var(--primary-blue, #0055ff);
          color: #ffffff;
        }

        .stock-count-val {
          font-size: 0.8rem;
          font-weight: 700;
          color: #111827;
          min-width: 60px;
          text-align: center;
        }

        .status-badge-pill {
          font-size: 0.78rem;
          font-weight: 800;
          padding: 0.35rem 0.8rem;
          border-radius: 99px;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
          letter-spacing: -0.01em;
        }

        .status-badge-pill.ok {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .status-badge-pill.low {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        .status-badge-pill.out {
          background: #fff1f2;
          color: #be123c;
          border: 1px solid #fecdd3;
        }

        .dot-green {
          font-size: 0.65rem;
          color: #10b981;
        }

        .dot-icon {
          font-size: 0.82rem;
        }

        .actions-flex {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.4rem;
        }

        .action-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .action-icon-btn.edit { background: #ebf1ff; color: var(--primary-blue, #0055ff); }
        .action-icon-btn.edit:hover { background: #dbeafe; }

        .action-icon-btn.delete { background: #fee2e2; color: #dc2626; }
        .action-icon-btn.delete:hover { background: #fca5a5; }

        .empty-table-cell {
          text-align: center;
          padding: 3rem 1rem !important;
          color: #6b7280;
        }

        @media (max-width: 900px) {
          .inventory-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
