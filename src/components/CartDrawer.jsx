import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutCompleted, setCheckoutCompleted] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutCompleted(true);
      confetti({ particleCount: 80, spread: 60 });
    }, 1000);
  };

  return (
    <div className="cart-backdrop animate-fade-in" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title-box">
            <ShoppingBag size={22} className="text-blue" />
            <h3>{t('cart.title')} ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</h3>
          </div>
          <button className="cart-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="shipping-bar-box">
          {remainingForFreeShipping > 0 ? (
            <p className="shipping-text">
              {t('cart.freeShippingGoal')}<strong>{remainingForFreeShipping.toFixed(2)} USD</strong>{t('cart.freeShippingGoalEnd')}
            </p>
          ) : (
            <p className="shipping-text text-green">
              {t('cart.freeShippingUnlocked')}
            </p>
          )}
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: `${progressToFreeShipping}%` }}></div>
          </div>
        </div>

        {/* Content */}
        {checkoutCompleted ? (
          <div className="checkout-success text-center">
            <div className="success-icon">
              <Check size={40} />
            </div>
            <h3>{t('cart.successTitle')}</h3>
            <p>{t('cart.successSub')}</p>
            <button 
              className="btn-primary" 
              onClick={() => {
                onClearCart();
                setCheckoutCompleted(false);
                onClose();
              }}
            >
              {t('cart.continueBtn')}
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart text-center">
            <ShoppingBag size={56} className="empty-icon" />
            <h4>{t('cart.emptyTitle')}</h4>
            <p>{t('cart.emptySub')}</p>
            <button className="btn-primary" onClick={onClose}>
              {t('cart.browseBtn')}
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.cartId || item.id} className="cart-item">
                  <div className="cart-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-title-row">
                      <h4>{item.name}</h4>
                      <button 
                        className="remove-btn" 
                        onClick={() => onRemoveItem(item.cartId || item.id)}
                        title="Eliminar elemento"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.selectedMaterial && (
                      <span className="cart-item-mat">Mat: {item.selectedMaterial}</span>
                    )}

                    <div className="cart-item-price-row">
                      <div className="item-qty-picker">
                        <button onClick={() => onUpdateQuantity(item.cartId || item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.cartId || item.id, item.quantity + 1)}>+</button>
                      </div>

                      <strong className="item-total-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="cart-footer">
              <div className="summary-line">
                <span>{t('cart.subtotal')}</span>
                <strong>${subtotal.toFixed(2)} USD</strong>
              </div>
              <div className="summary-line">
                <span>{t('cart.shipping')}</span>
                <span>{remainingForFreeShipping === 0 ? t('cart.free') : '$4.99 USD'}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-line total-line">
                <span>{t('cart.total')}</span>
                <span className="cart-total-price">
                  ${(subtotal + (remainingForFreeShipping === 0 ? 0 : 4.99)).toFixed(2)} USD
                </span>
              </div>

              <button 
                className="btn-primary checkout-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? t('cart.processing') : (
                  <>
                    {t('cart.checkoutBtn')} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </>
        )}

      </div>

      <style>{`
        .cart-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(17, 24, 39, 0.5);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          justify-content: flex-end;
        }

        .cart-drawer {
          background: #ffffff;
          width: 100%;
          max-width: 440px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0,0,0,0.15);
        }

        .cart-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E5E7EB;
        }

        .cart-title-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .cart-title-box h3 {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.2rem;
          color: #111827;
        }

        .cart-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #374151;
        }

        .shipping-bar-box {
          background: #F8F9FB;
          padding: 0.9rem 1.5rem;
          border-bottom: 1px solid #E5E7EB;
        }

        .shipping-text {
          font-size: 0.82rem;
          color: #4B5563;
          margin-bottom: 0.4rem;
        }

        .text-green { color: #10B981; }

        .progress-bg {
          height: 6px;
          width: 100%;
          background: #E5E7EB;
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--primary-blue);
          border-radius: 99px;
          transition: width 0.4s ease;
        }

        .empty-cart {
          padding: 4rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
        }

        .empty-icon {
          color: #D1D5DB;
          margin-bottom: 1rem;
        }

        .empty-cart h4 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }

        .empty-cart p {
          font-size: 0.9rem;
          color: #6B7280;
          margin-bottom: 1.5rem;
        }

        .cart-items-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          display: flex;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #F3F4F6;
        }

        .cart-item-img {
          width: 70px;
          height: 70px;
          border-radius: 12px;
          background: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem;
          flex-shrink: 0;
        }

        .cart-item-img img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .cart-item-details {
          flex: 1;
        }

        .cart-item-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .cart-item-title-row h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #111827;
        }

        .remove-btn {
          color: #9CA3AF;
          transition: color 0.2s ease;
        }

        .remove-btn:hover { color: #EF4444; }

        .cart-item-mat {
          display: block;
          font-size: 0.78rem;
          color: #6B7280;
          margin-top: 0.2rem;
        }

        .cart-item-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.6rem;
        }

        .item-qty-picker {
          display: flex;
          align-items: center;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          height: 28px;
        }

        .item-qty-picker button {
          width: 24px;
          height: 100%;
          font-weight: 700;
        }

        .item-qty-picker span {
          width: 24px;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .item-total-price {
          font-weight: 700;
          color: var(--primary-blue);
          font-size: 0.95rem;
        }

        .cart-footer {
          padding: 1.5rem;
          background: #FAFAFA;
          border-top: 1px solid #E5E7EB;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #4B5563;
          margin-bottom: 0.5rem;
        }

        .summary-divider {
          height: 1px;
          background: #E5E7EB;
          margin: 0.75rem 0;
        }

        .summary-line.total-line {
          font-weight: 700;
          color: #111827;
          font-size: 1.05rem;
          margin-bottom: 1.2rem;
        }

        .cart-total-price {
          color: var(--primary-blue);
          font-size: 1.25rem;
          font-weight: 800;
        }

        .checkout-btn {
          width: 100%;
          padding: 0.95rem;
        }

        .checkout-success {
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
        }

        .success-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: var(--primary-blue-light);
          color: var(--primary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .checkout-success h3 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .checkout-success p {
          font-size: 0.95rem;
          color: #6B7280;
          margin-bottom: 1.8rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
