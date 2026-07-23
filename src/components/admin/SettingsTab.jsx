import React, { useState } from 'react';
import { Share2, Save, CheckCircle, Globe, Phone, Instagram, Facebook, Video, MessageCircle, ShieldCheck } from 'lucide-react';

export const DEFAULT_SOCIAL_LINKS = {
  whatsappPhone: '829 510 3468',
  whatsappUrl: 'https://wa.me/18295103468',
  instagramHandle: '@CRIOLLO3D',
  instagramUrl: 'https://instagram.com/criollo3d',
  facebookUrl: 'https://facebook.com/criollo3d',
  tiktokUrl: 'https://tiktok.com/@criollo3d',
  websiteUrl: 'https://www.criollo3d.com'
};

export default function SettingsTab({ socialLinks, setSocialLinks, onToast }) {
  const [formData, setFormData] = useState({ ...socialLinks });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSocialLinks(formData);
    localStorage.setItem('criollo3d_social_links', JSON.stringify(formData));
    if (onToast) onToast('✨ Enlaces de Redes Sociales actualizados con éxito.');
  };

  return (
    <div className="pro-settings-tab animate-fade-in">
      
      {/* Header Banner */}
      <div className="settings-hero-header">
        <div>
          <h1 className="settings-hero-title">Configuración de Redes Sociales & Contacto</h1>
          <p className="settings-hero-sub">Edita los enlaces de WhatsApp, Instagram, Facebook y TikTok que aparecen en la tienda y facturas</p>
        </div>
      </div>

      <div className="settings-grid">
        
        {/* Main Links Form */}
        <div className="settings-card">
          <form onSubmit={handleSubmit} className="settings-form">
            <h3 className="card-section-title"><Share2 size={18} /> Canales de Redes Sociales Oficiales</h3>

            {/* WhatsApp */}
            <div className="settings-field-group">
              <label className="field-label">
                <MessageCircle size={16} className="text-emerald" /> WhatsApp (Teléfono / Número):
              </label>
              <input
                type="text"
                className="settings-input"
                placeholder="829 510 3468"
                value={formData.whatsappPhone || ''}
                onChange={e => setFormData({ ...formData, whatsappPhone: e.target.value })}
                required
              />
            </div>

            <div className="settings-field-group">
              <label className="field-label">
                <MessageCircle size={16} className="text-emerald" /> WhatsApp (Enlace Directo / wa.me):
              </label>
              <input
                type="url"
                className="settings-input"
                placeholder="https://wa.me/18295103468"
                value={formData.whatsappUrl || ''}
                onChange={e => setFormData({ ...formData, whatsappUrl: e.target.value })}
                required
              />
            </div>

            {/* Instagram */}
            <div className="settings-field-group">
              <label className="field-label">
                <Instagram size={16} className="text-pink" /> Instagram (Usuario / Handle):
              </label>
              <input
                type="text"
                className="settings-input"
                placeholder="@CRIOLLO3D"
                value={formData.instagramHandle || ''}
                onChange={e => setFormData({ ...formData, instagramHandle: e.target.value })}
                required
              />
            </div>

            <div className="settings-field-group">
              <label className="field-label">
                <Instagram size={16} className="text-pink" /> Instagram (Enlace Perfil):
              </label>
              <input
                type="url"
                className="settings-input"
                placeholder="https://instagram.com/criollo3d"
                value={formData.instagramUrl || ''}
                onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
                required
              />
            </div>

            {/* Facebook */}
            <div className="settings-field-group">
              <label className="field-label">
                <Facebook size={16} className="text-blue" /> Facebook (Enlace Página):
              </label>
              <input
                type="url"
                className="settings-input"
                placeholder="https://facebook.com/criollo3d"
                value={formData.facebookUrl || ''}
                onChange={e => setFormData({ ...formData, facebookUrl: e.target.value })}
              />
            </div>

            {/* TikTok */}
            <div className="settings-field-group">
              <label className="field-label">
                <Video size={16} className="text-dark" /> TikTok (Enlace Perfil):
              </label>
              <input
                type="url"
                className="settings-input"
                placeholder="https://tiktok.com/@criollo3d"
                value={formData.tiktokUrl || ''}
                onChange={e => setFormData({ ...formData, tiktokUrl: e.target.value })}
              />
            </div>

            {/* Website URL */}
            <div className="settings-field-group">
              <label className="field-label">
                <Globe size={16} className="text-cyan" /> Sitio Web Oficial:
              </label>
              <input
                type="url"
                className="settings-input"
                placeholder="https://www.criollo3d.com"
                value={formData.websiteUrl || ''}
                onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
              />
            </div>

            <div className="settings-submit-row">
              <button type="submit" className="save-settings-btn">
                <Save size={18} /> Guardar Enlaces de Redes Sociales
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="settings-card preview-card">
          <h3 className="card-section-title"><Globe size={18} /> Vista Previa en Tienda & Facturas</h3>
          
          <div className="preview-box">
            <p className="preview-sub">Los cambios se reflejarán inmediatamente en el pie de página de la tienda y en la impresión de comprobantes A4:</p>

            <div className="preview-items-list">
              <div className="preview-item-row">
                <span>💬 WhatsApp:</span>
                <strong>{formData.whatsappPhone}</strong>
              </div>
              <div className="preview-item-row">
                <span>📸 Instagram:</span>
                <strong>{formData.instagramHandle}</strong>
              </div>
              <div className="preview-item-row">
                <span>📘 Facebook:</span>
                <span className="truncate-url">{formData.facebookUrl}</span>
              </div>
              <div className="preview-item-row">
                <span>🎵 TikTok:</span>
                <span className="truncate-url">{formData.tiktokUrl}</span>
              </div>
              <div className="preview-item-row">
                <span>🌐 Sitio Web:</span>
                <span className="truncate-url">{formData.websiteUrl}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .pro-settings-tab {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-hero-header {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .settings-hero-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .settings-hero-sub {
          font-size: 0.88rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 1.5rem;
        }

        .settings-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .card-section-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .settings-field-group {
          margin-bottom: 1.1rem;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.35rem;
        }

        .settings-input {
          width: 100%;
          padding: 0.65rem 0.9rem;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.88rem;
          color: #0f172a;
          outline: none;
          transition: border-color 0.2s;
        }
        .settings-input:focus {
          border-color: #0055ff;
          box-shadow: 0 0 0 3px rgba(0, 85, 255, 0.1);
        }

        .save-settings-btn {
          background: #0055ff;
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 800;
          padding: 0.75rem 1.6rem;
          border-radius: 99px;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(0, 85, 255, 0.25);
        }
        .save-settings-btn:hover {
          background: #0044cc;
          transform: translateY(-1px);
        }

        .settings-submit-row {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
        }

        .preview-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem;
        }

        .preview-sub {
          font-size: 0.82rem;
          color: #64748b;
          margin-top: 0;
          margin-bottom: 1rem;
        }

        .preview-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.85rem;
        }

        .preview-item-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .truncate-url {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #0055ff;
        }

        .text-emerald { color: #10b981; }
        .text-pink { color: #ec4899; }
        .text-blue { color: #3b82f6; }
        .text-dark { color: #0f172a; }
        .text-cyan { color: #06b6d4; }

        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .settings-card {
            padding: 1rem;
            border-radius: 16px;
          }
          .settings-hero-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }
      `}</style>

    </div>
  );
}

