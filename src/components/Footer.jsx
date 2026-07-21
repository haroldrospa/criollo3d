import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onNavClick }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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

        <div className="footer-divider"></div>

        {/* Bottom Navigation & Brand */}
        <div className="footer-bottom-row">
          
          <div className="footer-brand" onClick={() => onNavClick('home')}>
            <div className="footer-logo-wrapper">
              <img src="/logo_icon_transparent.png" alt="Criollo 3D Emblem" className="footer-logo-img" />
            </div>
            <span className="footer-brand-title">
              CRIOLLO <span className="blue-3d">3D</span>
            </span>
          </div>

          <div className="footer-nav-links">
            <button onClick={() => onNavClick('home')}>{t('nav.home')}</button>
            <button onClick={() => onNavClick('shop')}>{t('nav.shop')}</button>
            <button onClick={() => onNavClick('quote')}>{t('nav.quote')}</button>
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

        .footer-logo-wrapper {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        .footer-brand-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.35rem;
          color: #ffffff;
          letter-spacing: -0.02em;
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
