import React from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

export default function NotificationToast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="toast-container animate-fade-in">
      <div className="toast-content">
        <CheckCircle2 size={20} className="toast-icon" />
        <span className="toast-msg">{toast.message}</span>
        <button className="toast-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 300;
        }

        .toast-content {
          background: #111827;
          color: #ffffff;
          padding: 0.9rem 1.4rem;
          border-radius: 99px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
          font-size: 0.9rem;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .toast-icon {
          color: var(--primary-blue);
        }

        .toast-close {
          color: #9CA3AF;
          margin-left: 0.5rem;
        }

        .toast-close:hover {
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
