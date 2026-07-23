import React, { useState } from 'react';
import { 
  ShoppingBag, Plus, Edit2, Trash2, Image, Layers, Sparkles, 
  RotateCcw, CheckCircle, Eye, Star, AlertCircle, Save, X, Globe, ArrowLeft
} from 'lucide-react';
import { CATEGORIES } from '../../data/products';

export default function StoreTab({ 
  products, 
  setProducts, 
  featuredCollections, 
  setFeaturedCollections, 
  heroContent, 
  setHeroContent, 
  onToast 
}) {
  const [subTab, setSubTab] = useState('products'); // 'products' | 'collections' | 'hero'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Modal / Form state for product editing
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'toys',
    price: 35.00,
    rating: 5.0,
    reviewsCount: 12,
    image: '/images/prod_funko_grandma.png',
    badge: 'Nuevo Producto',
    description: '',
    materials: 'PLA Premium, Resina SLA',
    colors: '#0055FF, #111827, #FFFFFF',
    dimensions: '15cm x 10cm x 10cm',
    inStock: true
  });

  // -------------------------------------------------------------
  // PRODUCT HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      category: 'toys',
      price: 35.00,
      rating: 5.0,
      reviewsCount: 1,
      image: '/images/prod_funko_grandma.png',
      badge: 'Nuevo 3D',
      description: 'Pieza de impresión 3D de alta precisión terminada y lista para entrega.',
      materials: 'PLA Premium, Resina SLA',
      colors: '#0055FF, #111827, #FFFFFF',
      dimensions: '15cm x 10cm x 10cm',
      inStock: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      ...prod,
      materials: Array.isArray(prod.materials) ? prod.materials.join(', ') : (prod.materials || ''),
      colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : (prod.colors || '')
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productFormData.name || Number(productFormData.price) <= 0) {
      if (onToast) onToast('⚠️ Ingrese un nombre y precio válido para el producto.');
      return;
    }

    const processedMaterials = typeof productFormData.materials === 'string'
      ? productFormData.materials.split(',').map(m => m.trim()).filter(Boolean)
      : productFormData.materials;

    const processedColors = typeof productFormData.colors === 'string'
      ? productFormData.colors.split(',').map(c => c.trim()).filter(Boolean)
      : productFormData.colors;

    if (editingProduct) {
      // Update existing
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...productFormData,
        id: editingProduct.id,
        price: Number(productFormData.price),
        rating: Number(productFormData.rating || 5),
        reviewsCount: Number(productFormData.reviewsCount || 1),
        materials: processedMaterials,
        colors: processedColors
      } : p));

      if (onToast) onToast(`✨ Producto "${productFormData.name}" actualizado.`);
    } else {
      // Add new
      const newId = `prod-custom-${Date.now()}`;
      const created = {
        ...productFormData,
        id: newId,
        price: Number(productFormData.price),
        rating: Number(productFormData.rating || 5),
        reviewsCount: Number(productFormData.reviewsCount || 1),
        materials: processedMaterials,
        colors: processedColors
      };

      setProducts(prev => [created, ...prev]);
      if (onToast) onToast(`🎉 Nuevo producto "${created.name}" añadido al catálogo de la tienda.`);
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`¿Desea eliminar el producto "${name}" del catálogo de la tienda?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      if (onToast) onToast(`🗑️ Producto "${name}" eliminado de la tienda.`);
    }
  };

  const handleToggleStock = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStock = !p.inStock;
        if (onToast) onToast(`📦 Estado de "${p.name}" cambiado a ${nextStock ? 'En Stock' : 'Agotado'}.`);
        return { ...p, inStock: nextStock };
      }
      return p;
    }));
  };

  // -------------------------------------------------------------
  // FEATURED COLLECTIONS HANDLERS
  // -------------------------------------------------------------
  const handleUpdateCollection = (id, field, value) => {
    setFeaturedCollections(prev => prev.map(col => col.id === id ? { ...col, [field]: value } : col));
    if (onToast) onToast(`✨ Colección "${id}" actualizada.`);
  };

  // -------------------------------------------------------------
  // HERO BANNER HANDLERS
  // -------------------------------------------------------------
  const handleUpdateHero = (field, value) => {
    setHeroContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveHeroToast = () => {
    if (onToast) onToast('🚀 Banner Principal Hero de la Tienda guardado.');
  };

  // Filtered Products List
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCatFilter === 'all' || p.category === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="store-management-root animate-fade-in">
      
      {isProductModalOpen ? (
        <div className="clean-editor-wrapper animate-fade-in">
          
          {/* Header Bar: Back Button + Title + Actions */}
          <div className="clean-editor-header">
            <div className="header-left">
              <button 
                type="button" 
                className="clean-back-btn" 
                onClick={() => setIsProductModalOpen(false)}
              >
                <ArrowLeft size={16} /> Volver a Productos del Catálogo
              </button>
              <h1 className="clean-editor-title">
                {editingProduct ? `Editar: ${editingProduct.name}` : 'Añadir Nuevo Producto a la Tienda'}
              </h1>
            </div>
            
            <div className="header-actions">
              <button type="button" className="btn-clean-secondary" onClick={() => setIsProductModalOpen(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-clean-primary" onClick={handleSaveProduct}>
                <Save size={16} /> {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </div>

          {/* Form Content Card */}
          <form onSubmit={handleSaveProduct} className="clean-editor-card">
            
            <div className="clean-form-grid">
              
              {/* Left Column: Image Preview & Stock Options */}
              <div className="clean-media-col">
                <label className="clean-field-lbl">Imagen del Producto</label>
                
                <div className="clean-img-box">
                  <img 
                    src={productFormData.image || '/images/prod_funko_grandma.png'} 
                    alt="Preview" 
                    className="clean-img-preview"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400'; }}
                  />
                </div>

                <div className="clean-field-group mt-3">
                  <label className="clean-sub-lbl">URL o Ruta de Imagen *</label>
                  <input
                    type="text"
                    className="clean-input"
                    placeholder="/images/prod_ejemplo.png"
                    value={productFormData.image}
                    onChange={e => setProductFormData({ ...productFormData, image: e.target.value })}
                    required
                  />
                </div>

                <div className="clean-field-group mt-3">
                  <label className="clean-sub-lbl">Estado de Disponibilidad</label>
                  <div className="clean-stock-options">
                    <label className={`clean-stock-radio ${productFormData.inStock ? 'selected-in' : ''}`}>
                      <input 
                        type="radio" 
                        name="stockStatus" 
                        checked={productFormData.inStock} 
                        onChange={() => setProductFormData({ ...productFormData, inStock: true })} 
                      />
                      <span>En Stock</span>
                    </label>

                    <label className={`clean-stock-radio ${!productFormData.inStock ? 'selected-out' : ''}`}>
                      <input 
                        type="radio" 
                        name="stockStatus" 
                        checked={!productFormData.inStock} 
                        onChange={() => setProductFormData({ ...productFormData, inStock: false })} 
                      />
                      <span>Agotado</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column: Organized Form Sections */}
              <div className="clean-fields-col">
                
                {/* Section 1: Información Principal */}
                <div className="clean-section-block">
                  <h3 className="clean-section-title">1. Información Principal</h3>

                  <div className="clean-field-group">
                    <label className="clean-field-lbl">Nombre del Producto *</label>
                    <input
                      type="text"
                      className="clean-input title-input"
                      placeholder="Ej: Lapicero Corazón Anatómico Rojo"
                      value={productFormData.name}
                      onChange={e => setProductFormData({ ...productFormData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="clean-grid-2 mt-3">
                    <div className="clean-field-group">
                      <label className="clean-field-lbl">Categoría *</label>
                      <select
                        className="clean-select"
                        value={productFormData.category}
                        onChange={e => setProductFormData({ ...productFormData, category: e.target.value })}
                      >
                        {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="clean-field-group">
                      <label className="clean-field-lbl">Precio de Venta (RD$ DOP) *</label>
                      <input
                        type="number"
                        step="0.50"
                        min="1"
                        className="clean-input price-input"
                        value={productFormData.price}
                        onChange={e => setProductFormData({ ...productFormData, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Detalles y Descripción */}
                <div className="clean-section-block mt-4">
                  <h3 className="clean-section-title">2. Detalles del Producto</h3>

                  <div className="clean-field-group">
                    <label className="clean-field-lbl">Etiqueta Badge (Opcional)</label>
                    <input
                      type="text"
                      className="clean-input"
                      placeholder="Ej: Más Vendido, Destacado, Edición Limitada"
                      value={productFormData.badge || ''}
                      onChange={e => setProductFormData({ ...productFormData, badge: e.target.value })}
                    />
                  </div>

                  <div className="clean-field-group mt-3">
                    <label className="clean-field-lbl">Descripción Corta</label>
                    <textarea
                      rows="3"
                      className="clean-textarea"
                      placeholder="Escribe una breve descripción del producto..."
                      value={productFormData.description}
                      onChange={e => setProductFormData({ ...productFormData, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Section 3: Especificaciones 3D */}
                <div className="clean-section-block mt-4">
                  <h3 className="clean-section-title">3. Especificaciones 3D</h3>

                  <div className="clean-grid-2">
                    <div className="clean-field-group">
                      <label className="clean-field-lbl">Materiales Disponibles</label>
                      <input
                        type="text"
                        className="clean-input"
                        placeholder="Ej: PLA Silk Red, Resina SLA"
                        value={productFormData.materials}
                        onChange={e => setProductFormData({ ...productFormData, materials: e.target.value })}
                      />
                    </div>

                    <div className="clean-field-group">
                      <label className="clean-field-lbl">Dimensiones (Alto x Ancho x Profundo)</label>
                      <input
                        type="text"
                        className="clean-input"
                        placeholder="Ej: 15cm x 12cm x 10cm"
                        value={productFormData.dimensions || ''}
                        onChange={e => setProductFormData({ ...productFormData, dimensions: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </form>

        </div>
      ) : (
        <>
      
      {/* Top Header */}
      <div className="store-admin-header">
        <div>
          <div className="badge-live-store">
            <Globe size={14} className="text-blue" />
            <span>Editor en Vivo de la Tienda Criollo3D</span>
          </div>
          <h1 className="store-admin-title">Gestión & Edición de Tienda</h1>
          <p className="store-admin-subtitle">Administra los productos del catálogo, colecciones destacadas y banner principal en tiempo real</p>
        </div>
      </div>

      {/* Navigation Sub-Pills */}
      <div className="store-subtabs-row">
        <button 
          className={`subtab-btn ${subTab === 'products' ? 'active' : ''}`}
          onClick={() => setSubTab('products')}
        >
          <ShoppingBag size={16} /> Productos del Catálogo ({products.length})
        </button>
        <button 
          className={`subtab-btn ${subTab === 'collections' ? 'active' : ''}`}
          onClick={() => setSubTab('collections')}
        >
          <Layers size={16} /> Colecciones Destacadas
        </button>
        <button 
          className={`subtab-btn ${subTab === 'hero' ? 'active' : ''}`}
          onClick={() => setSubTab('hero')}
        >
          <Sparkles size={16} /> Banner Principal Hero
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: PRODUCTOS DEL CATÁLOGO DE TIENDA */}
      {/* ========================================================= */}
      {subTab === 'products' && (
        <div className="store-products-view animate-fade-in">
          
          {/* Controls Bar */}
          <div className="products-controls-card">
            <div className="left-search">
              <input 
                type="text" 
                className="store-search-input"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="category-filter-pills">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`cat-pill ${selectedCatFilter === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCatFilter(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <button className="btn-add-product" onClick={handleOpenAddProduct}>
              <Plus size={18} /> Añadir Nuevo Producto
            </button>
          </div>

          {/* Products Grid */}
          <div className="store-products-grid">
            {filteredProducts.map(prod => (
              <div key={prod.id} className={`store-prod-card ${!prod.inStock ? 'out-of-stock' : ''}`}>
                
                <div className="prod-card-top-img">
                  <img src={prod.image} alt={prod.name} className="prod-thumb" />
                  <span className={`stock-badge ${prod.inStock ? 'in-stock' : 'no-stock'}`}>
                    {prod.inStock ? 'En Stock' : 'Agotado'}
                  </span>
                  {prod.badge && <span className="custom-badge-tag">{prod.badge}</span>}
                </div>

                <div className="prod-card-body">
                  <span className="prod-cat-name">{CATEGORIES.find(c => c.id === prod.category)?.name || prod.category}</span>
                  <h3 className="prod-title">{prod.name}</h3>
                  <p className="prod-desc-line">{prod.description}</p>
                  
                  <div className="prod-price-row">
                    <span className="price-label">Precio Tienda:</span>
                    <strong className="price-val">RD$ {prod.price.toFixed(2)} DOP</strong>
                  </div>

                  <div className="prod-actions-row">
                    <button 
                      className="action-btn toggle-stock-btn" 
                      onClick={() => handleToggleStock(prod.id)}
                      title="Cambiar estado Stock"
                    >
                      {prod.inStock ? 'Marcar Agotado' : 'Marcar Stock'}
                    </button>
                    
                    <button 
                      className="action-btn edit-btn" 
                      onClick={() => handleOpenEditProduct(prod)}
                      title="Editar Producto"
                    >
                      <Edit2 size={15} /> Editar
                    </button>
                    
                    <button 
                      className="action-btn delete-btn" 
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      title="Eliminar de la Tienda"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: COLECCIONES DESTACADAS */}
      {/* ========================================================= */}
      {subTab === 'collections' && (
        <div className="store-collections-view animate-fade-in">
          <div className="collections-intro-banner">
            <h3>🖼️ Edición de Colecciones Destacadas</h3>
            <p>Modifique los títulos e imágenes de las 3 tarjetas destacadas en la página de inicio</p>
          </div>

          <div className="collections-edit-grid">
            {featuredCollections.map((col) => (
              <div key={col.id} className="collection-editor-card">
                <div className="preview-img-box">
                  <img src={col.image} alt={col.title} className="col-preview-img" />
                </div>

                <div className="editor-fields-box">
                  <label className="field-lbl">Título de Colección</label>
                  <input
                    type="text"
                    className="field-input"
                    value={col.title}
                    onChange={e => handleUpdateCollection(col.id, 'title', e.target.value)}
                  />

                  <label className="field-lbl mt-2">Subtítulo Descriptivo</label>
                  <input
                    type="text"
                    className="field-input"
                    value={col.subtitle || ''}
                    onChange={e => handleUpdateCollection(col.id, 'subtitle', e.target.value)}
                  />

                  <label className="field-lbl mt-2">URL de la Imagen de Portada</label>
                  <input
                    type="text"
                    className="field-input"
                    value={col.image}
                    onChange={e => handleUpdateCollection(col.id, 'image', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: BANNER PRINCIPAL HERO */}
      {/* ========================================================= */}
      {subTab === 'hero' && (
        <div className="store-hero-view animate-fade-in">
          
          <div className="hero-editor-grid">
            
            {/* Form Fields */}
            <div className="hero-fields-card">
              <h3 className="card-sec-title"><Sparkles size={18} className="text-blue" /> Editar Textos y Contenido del Hero</h3>
              
              <div className="field-group">
                <label className="field-lbl">Título Línea 1</label>
                <input 
                  type="text"
                  className="field-input"
                  value={heroContent.titleLine1 || ''}
                  onChange={e => handleUpdateHero('titleLine1', e.target.value)}
                />
              </div>

              <div className="field-group mt-2">
                <label className="field-lbl">Título Línea 2 (Azul Resaltado)</label>
                <input 
                  type="text"
                  className="field-input"
                  value={heroContent.titleLine2 || ''}
                  onChange={e => handleUpdateHero('titleLine2', e.target.value)}
                />
              </div>

              <div className="field-group mt-2">
                <label className="field-lbl">Descripción / Subtítulo</label>
                <textarea 
                  rows="3"
                  className="field-textarea"
                  value={heroContent.subtitle || ''}
                  onChange={e => handleUpdateHero('subtitle', e.target.value)}
                />
              </div>

              <div className="grid-2-col mt-2">
                <div className="field-group">
                  <label className="field-lbl">Texto Botón 1 (Comprar)</label>
                  <input 
                    type="text"
                    className="field-input"
                    value={heroContent.btn1Text || ''}
                    onChange={e => handleUpdateHero('btn1Text', e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label className="field-lbl">Texto Botón 2 (Cotizar)</label>
                  <input 
                    type="text"
                    className="field-input"
                    value={heroContent.btn2Text || ''}
                    onChange={e => handleUpdateHero('btn2Text', e.target.value)}
                  />
                </div>
              </div>

              <div className="field-group mt-2">
                <label className="field-lbl">URL Imagen 3D Escultura Principal</label>
                <input 
                  type="text"
                  className="field-input"
                  value={heroContent.image || ''}
                  onChange={e => handleUpdateHero('image', e.target.value)}
                />
              </div>

              <button className="btn-save-hero mt-3" onClick={handleSaveHeroToast}>
                <Save size={16} /> Guardar Cambios en Banner Principal
              </button>
            </div>

            {/* Live Visual Preview Card */}
            <div className="hero-preview-card">
              <span className="preview-tag font-bold">PREVISTA EN VIVO</span>
              
              <div className="mock-hero-box">
                <h1 className="mock-hero-title">
                  {heroContent.titleLine1}<br />
                  <span className="text-blue">{heroContent.titleLine2}</span>
                </h1>
                <p className="mock-hero-sub">{heroContent.subtitle}</p>
                <div className="mock-hero-btns">
                  <span className="mock-btn-blue">{heroContent.btn1Text}</span>
                  <span className="mock-btn-outline">{heroContent.btn2Text}</span>
                </div>
                <div className="mock-hero-img-wrap">
                  <img src={heroContent.image} alt="Hero Preview" className="mock-hero-img" />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
      </>
      )}

      {/* CSS Styles */}
      <style>{`
        .store-management-root {
          padding: 1.5rem;
        }

        .badge-live-store {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.85rem;
          background: #eff6ff;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #0055ff;
          margin-bottom: 0.5rem;
        }

        .store-admin-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #111827;
        }

        .store-admin-subtitle {
          color: #6b7280;
          font-size: 0.92rem;
          margin-bottom: 1.25rem;
        }

        .store-subtabs-row {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.75rem;
        }

        .subtab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .subtab-btn.active {
          background: #0055ff;
          color: #ffffff;
          border-color: #0055ff;
          box-shadow: 0 4px 12px rgba(0, 85, 255, 0.2);
        }

        /* Products View */
        .products-controls-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }

        .store-search-input {
          padding: 0.6rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          width: 260px;
          font-size: 0.88rem;
        }

        .category-filter-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .cat-pill {
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .cat-pill.active {
          background: #111827;
          color: #ffffff;
          border-color: #111827;
        }

        .btn-add-product {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.25rem;
          background: #0055ff;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
        }

        .store-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .store-prod-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .store-prod-card.out-of-stock {
          opacity: 0.65;
        }

        .prod-card-top-img {
          height: 180px;
          background: #f8fafc;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .prod-thumb {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }

        .stock-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .stock-badge.in-stock {
          background: #dcfce7;
          color: #166534;
        }

        .stock-badge.no-stock {
          background: #fee2e2;
          color: #991b1b;
        }

        .custom-badge-tag {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #0055ff;
          color: #ffffff;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .prod-card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .prod-cat-name {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #0055ff;
          margin-bottom: 0.25rem;
        }

        .prod-title {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.4rem;
        }

        .prod-desc-line {
          font-size: 0.82rem;
          color: #6b7280;
          line-height: 1.4;
          margin-bottom: 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .prod-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-top: 1px solid #f3f4f6;
          margin-top: auto;
        }

        .price-label {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .price-val {
          font-size: 1.05rem;
          color: #111827;
        }

        .prod-actions-row {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.75rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.45rem 0.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
        }

        .toggle-stock-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .edit-btn {
          background: #eff6ff;
          color: #0055ff;
          border-color: #bfdbfe;
        }

        .delete-btn {
          background: #fef2f2;
          color: #dc2626;
          border-color: #fecaca;
          flex: 0 0 auto;
          width: 36px;
        }

        /* Collections */
        .collections-edit-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.25rem;
          margin-top: 1rem;
        }

        .collection-editor-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          padding: 1.25rem;
        }

        .col-preview-img {
          width: 100%;
          height: 140px;
          object-fit: contain;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        /* Hero */
        .hero-editor-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .hero-fields-card, .hero-preview-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          padding: 1.5rem;
        }

        .field-lbl {
          font-size: 0.8rem;
          font-weight: 700;
          color: #374151;
          display: block;
          margin-bottom: 0.35rem;
        }

        .field-input, .field-input-text, .field-input-select {
          width: 100%;
          padding: 0.6rem 0.85rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.88rem;
        }

        .field-textarea {
          width: 100%;
          padding: 0.6rem 0.85rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.88rem;
          resize: vertical;
        }

        .btn-save-hero {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: #0055ff;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .mock-hero-box {
          background: #f9fafb;
          border-radius: 14px;
          padding: 1.5rem;
          border: 1px border #e5e7eb;
          margin-top: 1rem;
        }

        .mock-hero-title {
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1.2;
          color: #111827;
        }

        .mock-hero-sub {
          font-size: 0.85rem;
          color: #4b5563;
          margin: 0.75rem 0;
        }

        .mock-hero-btns {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .mock-btn-blue {
          background: #0055ff;
          color: #ffffff;
          padding: 0.4rem 0.85rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .mock-btn-outline {
          border: 1px solid #d1d5db;
          color: #111827;
          padding: 0.4rem 0.85rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .mock-hero-img-wrap {
          text-align: center;
        }

        .mock-hero-img {
          max-height: 140px;
          object-fit: contain;
        }

        /* Clean Product Editor Styles */
        .clean-editor-wrapper {
          padding: 0.25rem 0;
        }

        .clean-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          background: #ffffff;
          padding: 1.25rem 1.5rem;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .clean-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 0.25rem;
          padding: 0;
          transition: color 0.2s ease;
        }
        .clean-back-btn:hover {
          color: #0055ff;
        }

        .clean-editor-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-clean-secondary {
          padding: 0.65rem 1.25rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          color: #475569;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-clean-secondary:hover {
          background: #f8fafc;
        }

        .btn-clean-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.65rem 1.4rem;
          background: #0055ff;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 85, 255, 0.25);
          transition: background 0.2s ease;
        }
        .btn-clean-primary:hover {
          background: #0044cc;
        }

        .clean-editor-card {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          padding: 1.75rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .clean-form-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 2rem;
        }

        .clean-media-col {
          display: flex;
          flex-direction: column;
        }

        .clean-img-box {
          width: 100%;
          height: 240px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          margin-top: 0.35rem;
        }

        .clean-img-preview {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .clean-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .clean-field-lbl {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
        }

        .clean-sub-lbl {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
        }

        .clean-input, .clean-select, .clean-textarea {
          width: 100%;
          padding: 0.65rem 0.85rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #0f172a;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .clean-input:focus, .clean-select:focus, .clean-textarea:focus {
          border-color: #0055ff;
          box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.1);
        }

        .title-input {
          font-size: 1rem;
          font-weight: 700;
        }

        .price-input {
          font-weight: 700;
          color: #0055ff;
        }

        .clean-stock-options {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        .clean-stock-radio {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .clean-stock-radio.selected-in {
          border-color: #16a34a;
          background: #f0fdf4;
          color: #15803d;
        }

        .clean-stock-radio.selected-out {
          border-color: #dc2626;
          background: #fef2f2;
          color: #b91c1c;
        }

        .clean-section-block {
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 1.25rem;
        }
        .clean-section-block:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .clean-section-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #0055ff;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.85rem;
        }

        .clean-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 800px) {
          .clean-form-grid {
            grid-template-columns: 1fr;
          }
          .clean-editor-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }

        @media (max-width: 820px) {
          .modal-studio-grid {
            grid-template-columns: 1fr;
          }
          .hero-editor-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

    </div>
  );
}
