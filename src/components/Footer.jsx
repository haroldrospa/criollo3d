import React, { useState, useEffect } from 'react';
import { CheckCircle2, Instagram, MessageCircle, Facebook, Video, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onNavClick }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Dynamic Social Links configured from Admin Panel
  const [socialLinks, setSocialLinks] = useState(() => {
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

  // Sync state if changed in local storage
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('criollo3d_social_links');
      if (saved) setSocialLinks(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="footer-dark" id="contact">
      <div className="container">
        
        {/* Newsletter Section matching image */}
        <div className="newsletter-row">
          <h3 className="newsletter-title">{t('footer.newsletterTitle')}</h3>

          <form onSubmit={handleSubscribe} className="newsletter-form">
            {subscribed ? (
              <div className="subscribed-msg">
                <CheckCircle2 size={18} /> {t('footer.subscribedMsg')}
              </div>
            ) : (
              <div className="input-pill-wrapper">
                <input 
                  type="email" 
                  placeholder={t('footer.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="newsletter-input"
                />
                <button type="submit" className="btn-primary subscribe-btn">
                  {t('footer.subscribeBtn')}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Dynamic Social Links Bar */}
        <div className="footer-social-row">
          <span className="social-row-title">Redes Sociales & Contacto Oficial:</span>
          <div className="social-pills-group">
            {socialLinks.instagramUrl && (
              <a href={socialLinks.instagramUrl} target="_blank" rel="noreferrer" className="footer-social-pill instagram">
                <Instagram size={16} /> <span>{socialLinks.instagramHandle || 'Instagram'}</span>
              </a>
            )}
            {socialLinks.whatsappUrl && (
              <a href={socialLinks.whatsappUrl} target="_blank" rel="noreferrer" className="footer-social-pill whatsapp">
                <MessageCircle size={16} /> <span>{socialLinks.whatsappPhone || 'WhatsApp'}</span>
              </a>
            )}
            {socialLinks.facebookUrl && (
              <a href={socialLinks.facebookUrl} target="_blank" rel="noreferrer" className="footer-social-pill facebook">
                <Facebook size={16} /> <span>Facebook</span>
              </a>
            )}
            {socialLinks.tiktokUrl && (
              <a href={socialLinks.tiktokUrl} target="_blank" rel="noreferrer" className="footer-social-pill tiktok">
                <Video size={16} /> <span>TikTok</span>
              </a>
            )}
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Bottom Navigation & Brand */}
        <div className="footer-bottom-row">
          
          <div className="footer-brand" onClick={() => onNavClick('home')}>
            <img src="/logo_full_transparent.png" alt="Criollo3D" className="footer-brand-logo-img" />
          </div>

          <div className="footer-nav-links">
            <button onClick={() => onNavClick('home')}>{t('nav.home')}</button>
            <button onClick={() => onNavClick('shop')}>{t('nav.shop')}</button>
            <button onClick={() => onNavClick('about')}>{t('nav.about')}</button>
            <button onClick={() => onNavClick('contact')}>{t('nav.contact')}</button>
            <a href="#privacy">{t('footer.privacy')}</a>
            <a href="#terms">{t('footer.terms')}</a>
          </div>

        </div>

      </div>

      <style>{`
        .footer-dark {
          background-color: var(--bg-dark);
          color: #ffffff;
          padding: 4.5rem 0 3.5rem 0;
        }

        .newsletter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
        }

        .newsletter-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 2.1rem;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .newsletter-form {
          width: 100%;
          max-width: 480px;
        }

        .input-pill-wrapper {
          display: flex;
          align-items: center;
          background: #F3F4F6;
          border-radius: 99px;
          padding: 4px 4px 4px 1.2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .newsletter-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          color: #111827;
          outline: none;
        }

        .newsletter-input::placeholder {
          color: #9CA3AF;
        }

        .subscribe-btn {
          font-size: 0.8rem;
          padding: 0.75rem 1.6rem;
          letter-spacing: 0.05em;
        }

        .subscribed-msg {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #34D399;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .footer-social-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .social-row-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #9ca3af;
        }

        .social-pills-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .footer-social-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #1e2028;
          border: 1px solid #374151;
          color: #f3f4f6;
          padding: 0.5rem 1.1rem;
          border-radius: 99px;
          font-size: 0.84rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .footer-social-pill:hover {
          background: #0055ff;
          border-color: #0055ff;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(0, 85, 255, 0.3);
        }

        .footer-divider {
          height: 1px;
          background: #2E3038;
          margin-bottom: 3rem;
        }

        .footer-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .footer-brand-logo-img {
          height: 42px;
          max-width: 200px;
          width: auto;
          object-fit: contain;
        }

        .blue-3d {
          color: var(--primary-blue);
        }

        .footer-nav-links {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          flex-wrap: wrap;
        }

        .footer-nav-links button, .footer-nav-links a {
          font-size: 0.88rem;
          color: #9CA3AF;
          transition: color 0.2s ease;
          font-weight: 500;
        }

        .footer-nav-links button:hover, .footer-nav-links a:hover {
          color: #ffffff;
        }

        @media (max-width: 850px) {
          .newsletter-row {
            flex-direction: column;
            align-items: flex-start;
          }
          .newsletter-form {
            max-width: 100%;
          }
          .footer-bottom-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
