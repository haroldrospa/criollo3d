import React, { useState } from 'react';
import { X, ShoppingBag, Star, ShieldCheck, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const { t } = useLanguage();
  if (!product) return null;

  const [selectedMaterial, setSelectedMaterial] = useState(product.materials?.[0] || 'PLA Ultra');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '#0055FF');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedMaterial, selectedColor);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-grid">
          
          {/* Left: Product Image Box */}
          <div className="modal-img-box">
            <img src={product.image} alt={product.name} className="modal-img" />
          </div>

          {/* Right: Info & Controls */}
          <div className="modal-info">
            <span className="modal-badge">{product.badge || 'Criollo 3D'}</span>
            <h2 className="modal-title">{product.name}</h2>

            <div className="modal-rating">
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <strong>{product.rating}</strong>
              <span>({product.reviewsCount} {t('modal.reviews')})</span>
            </div>

            <div className="modal-price">
              ${product.price.toFixed(2)} <span className="modal-currency">USD</span>
            </div>

            <p className="modal-desc">{product.description}</p>

            {/* Material Selector */}
            {product.materials && (
              <div className="modal-option-group">
                <label className="option-label">{t('modal.material')}</label>
                <div className="materials-pills">
                  {product.materials.map(mat => (
                    <button
                      key={mat}
                      className={`mat-pill ${selectedMaterial === mat ? 'active' : ''}`}
                      onClick={() => setSelectedMaterial(mat)}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Buy Button */}
            <div className="modal-buy-row">
              <div className="modal-qty-picker">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button className="btn-primary modal-add-btn" onClick={handleAdd}>
                <ShoppingBag size={18} /> {t('modal.addBtn')} - ${(product.price * quantity).toFixed(2)}
              </button>
            </div>

            {/* Shipping & Guarantees */}
            <div className="modal-guarantees">
              <div><Truck size={16} /> {t('modal.shipping')}</div>
              <div><ShieldCheck size={16} /> {t('modal.guarantee')}</div>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(17, 24, 39, 0.6);
          backdrop-filter: blur(6px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-content {
          background: #ffffff;
          width: 100%;
          max-width: 860px;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }

        .modal-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #F3F4F6;
          color: #111827;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: var(--primary-blue);
          color: #ffffff;
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
        }

        .modal-img-box {
          background: var(--bg-light-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
        }

        .modal-img {
          max-width: 100%;
          max-height: 340px;
          object-fit: contain;
        }

        .modal-info {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
        }

        .modal-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary-blue);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .modal-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.8rem;
          color: #111827;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .modal-rating {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.88rem;
          color: #4B5563;
          margin-bottom: 1rem;
        }

        .modal-price {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.8rem;
          color: var(--primary-blue);
          margin-bottom: 1rem;
        }

        .modal-currency {
          font-size: 0.9rem;
          color: #6B7280;
        }

        .modal-desc {
          font-size: 0.95rem;
          color: #4B5563;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .modal-option-group {
          margin-bottom: 1.5rem;
        }

        .option-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .materials-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .mat-pill {
          padding: 0.45rem 0.9rem;
          border-radius: 8px;
          border: 1px solid #D1D5DB;
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
        }

        .mat-pill.active {
          border-color: var(--primary-blue);
          background: var(--primary-blue-light);
          color: var(--primary-blue);
          font-weight: 700;
        }

        .modal-buy-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .modal-qty-picker {
          display: flex;
          align-items: center;
          border: 1px solid #D1D5DB;
          border-radius: 99px;
          height: 48px;
          padding: 0 0.5rem;
        }

        .modal-qty-picker button {
          width: 32px;
          height: 32px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #374151;
        }

        .modal-qty-picker span {
          width: 32px;
          text-align: center;
          font-weight: 700;
        }

        .modal-add-btn {
          flex: 1;
          height: 48px;
          font-size: 0.82rem;
        }

        .modal-guarantees {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: #6B7280;
          padding-top: 1rem;
          border-top: 1px solid #F3F4F6;
        }

        .modal-guarantees div {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        @media (max-width: 768px) {
          .modal-grid {
            grid-template-columns: 1fr;
          }
          .modal-img-box {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
