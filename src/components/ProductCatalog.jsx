import React, { useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ShoppingBag, Eye, Star, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCatalog({ 
  selectedCategory, 
  onSelectCategory, 
  onAddToCart, 
  onQuickView,
  products = PRODUCTS
}) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const productList = products && products.length > 0 ? products : PRODUCTS;

  // Filter products
  const filteredProducts = productList.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="catalog-section" id="catalog">
      <div className="container">
        
        {/* Section Title */}
        <div className="catalog-header">
          <div>
            <h2 className="catalog-title">{t('catalog.title')}</h2>
            <p className="catalog-subtitle">{t('catalog.subtitle')}</p>
          </div>

          {/* Search Input */}
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder={t('catalog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {t(`catalog.categories.${cat.id}`) || cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-products text-center">
            <p>{t('catalog.noResults')}</p>
            <button className="btn-secondary" onClick={() => { setSearchQuery(''); onSelectCategory('all'); }}>
              {t('catalog.resetFilters')}
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                
                {/* Image & Badges */}
                <div className="product-img-box">
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-img"
                  />

                  {/* Quick Action Overlay */}
                  <div className="card-actions-overlay">
                    <button 
                      className="quick-view-btn" 
                      onClick={() => onQuickView(product)}
                      title={t('catalog.quickView')}
                    >
                      <Eye size={18} /> {t('catalog.quickView')}
                    </button>
                  </div>
                </div>

                {/* Info & Buy Button */}
                <div className="product-details">
                  
                  <div className="rating-row">
                    <div className="stars">
                      <Star size={14} fill="#F59E0B" color="#F59E0B" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="reviews-count">({product.reviewsCount} {t('catalog.reviews')})</span>
                  </div>

                  <h3 className="product-title" onClick={() => onQuickView(product)}>
                    {product.name}
                  </h3>

                  <p className="product-desc-short">{product.description}</p>

                  <div className="product-footer">
                    <div className="price-tag">
                      <span className="currency">RD$</span>
                      <span className="amount">{product.price.toFixed(2)}</span>
                      <span className="unit">DOP</span>
                    </div>

                    <button 
                      className="btn-primary add-cart-btn"
                      onClick={() => onAddToCart(product)}
                    >
                      <ShoppingBag size={16} /> {t('catalog.add')}
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        .catalog-section {
          padding: 4rem 0 6rem 0;
          background-color: #ffffff;
        }

        .catalog-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .catalog-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 2.4rem;
          color: #111827;
          letter-spacing: -0.02em;
          margin-bottom: 0.4rem;
        }

        .catalog-subtitle {
          font-size: 1.05rem;
          color: #6B7280;
        }

        .search-box {
          position: relative;
          width: 100%;
          max-width: 320px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 2.2rem 0.75rem 2.6rem;
          border-radius: 99px;
          border: 1px solid #E5E7EB;
          background-color: var(--bg-light-gray);
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .search-box input:focus {
          background-color: #FFFFFF;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(0,85,255,0.15);
        }

        .clear-search {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: #9CA3AF;
        }

        .category-filters {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .filter-pill {
          padding: 0.65rem 1.4rem;
          border-radius: 99px;
          background-color: var(--bg-light-gray);
          color: #4B5563;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .filter-pill:hover {
          background-color: #E5E7EB;
          color: #111827;
        }

        .filter-pill.active {
          background-color: var(--primary-blue);
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(0,85,255,0.25);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.2rem;
        }

        .product-card {
          background-color: var(--bg-card);
          border: 1px solid rgba(0,0,0,0.04);
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.08);
        }

        .product-img-box {
          position: relative;
          width: 100%;
          height: 250px;
          background-color: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow: hidden;
        }

        .product-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background-color: var(--primary-blue);
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.3rem 0.8rem;
          border-radius: 99px;
          z-index: 2;
        }

        .product-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-img {
          transform: scale(1.08);
        }

        .card-actions-overlay {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .product-card:hover .card-actions-overlay {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .quick-view-btn {
          background: rgba(17, 24, 39, 0.85);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.5rem 1.2rem;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
        }

        .quick-view-btn:hover {
          background: var(--primary-blue);
        }

        .product-details {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.6rem;
        }

        .stars {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-weight: 700;
          font-size: 0.85rem;
          color: #111827;
        }

        .reviews-count {
          font-size: 0.8rem;
          color: #9CA3AF;
        }

        .product-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
          color: #111827;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .product-title:hover {
          color: var(--primary-blue);
        }

        .product-desc-short {
          font-size: 0.88rem;
          color: #6B7280;
          line-height: 1.4;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid #F3F4F6;
        }

        .price-tag {
          font-family: var(--font-heading);
          font-weight: 800;
          color: #111827;
        }

        .currency {
          font-size: 0.9rem;
          vertical-align: top;
          color: var(--primary-blue);
        }

        .amount {
          font-size: 1.4rem;
        }

        .unit {
          font-size: 0.75rem;
          color: #9CA3AF;
          margin-left: 0.2rem;
        }

        .add-cart-btn {
          font-size: 0.8rem;
          padding: 0.6rem 1.2rem;
        }

        .no-products {
          padding: 4rem 1rem;
          background-color: var(--bg-light-gray);
          border-radius: 20px;
        }

        .no-products p {
          font-size: 1.1rem;
          color: #6B7280;
          margin-bottom: 1.5rem;
        }

        .category-filters {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 0.5rem;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .category-filters::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 980px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .catalog-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .search-box {
            max-width: 100%;
            width: 100%;
          }
          .product-img-box {
            height: 210px;
          }
          .card-actions-overlay {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
