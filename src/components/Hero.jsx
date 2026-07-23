import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onExploreClick, onQuoteClick, heroContent = {} }) {
  const { t } = useLanguage();

  const title1 = heroContent.titleLine1 || t('hero.title1');
  const title2 = heroContent.titleLine2 || t('hero.title2');
  const subtitle = heroContent.subtitle || t('hero.subtitle');
  const btn1 = heroContent.btn1Text || t('hero.shopNow');
  const btn2 = heroContent.btn2Text || t('hero.quoteBtn');
  const heroImg = heroContent.image || '/images/hero_david_white.png';

  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        {/* Left Column: Text & Call to Action */}
        <div className="hero-content">
          <h1 className="hero-title">
            {title1}<br />
            {title2}
          </h1>

          <p className="hero-subtitle">
            {subtitle}
          </p>

          <div className="hero-actions">
            <button className="btn-primary hero-btn" onClick={onExploreClick}>
              {btn1}
            </button>
            <button className="btn-outline hero-quote-btn" onClick={onQuoteClick}>
              <Sparkles size={16} /> {btn2}
            </button>
          </div>
        </div>

        {/* Right Column: 3D Rendered Bust Visual matching reference image */}
        <div className="hero-visual">
          <div className="visual-wrapper">
            
            {/* Floating Isometric 3D Blue Cube graphic matching reference */}
            <div className="floating-blue-cube animate-float">
              <svg viewBox="0 0 100 100" width="60" height="60" fill="none">
                <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="#0055FF" />
                <path d="M50 10 L85 30 L50 50 L15 30 Z" fill="#2973FF" />
                <path d="M50 50 L85 30 L85 70 L50 90 Z" fill="#0044CC" />
              </svg>
            </div>

            {/* Main Classical Bust Sculpture Image */}
            <div className="hero-image-box">
              <img 
                src={heroImg} 
                alt="3D Printed Bust" 
                className="hero-image"
              />
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .hero-section {
          padding: clamp(2rem, 5vw, 4.5rem) 0 clamp(2.5rem, 6vw, 5.5rem) 0;
          background-color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: clamp(2rem, 4vw, 3.5rem);
        }

        .hero-content {
          max-width: 580px;
          width: 100%;
        }

        .hero-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #111827;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2.2vw, 1.15rem);
          line-height: 1.6;
          color: #4B5563;
          margin-bottom: 2rem;
          font-weight: 400;
          max-width: 480px;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .hero-btn {
          font-size: 0.88rem;
          padding: 0.9rem 2.2rem;
          letter-spacing: 0.05em;
          flex: 0 0 auto;
        }

        .hero-quote-btn {
          padding: 0.85rem 1.6rem;
          flex: 0 0 auto;
        }

        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .visual-wrapper {
          position: relative;
          width: 100%;
          max-width: 440px;
          display: flex;
          justify-content: center;
        }

        .hero-image-box {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.08));
        }

        .hero-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          border-radius: var(--radius-md);
        }

        .floating-blue-cube {
          position: absolute;
          top: 30%;
          left: 2%;
          z-index: 3;
          filter: drop-shadow(0 10px 20px rgba(0, 85, 255, 0.35));
        }

        @media (max-width: 968px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2.5rem;
          }

          .hero-content {
            margin: 0 auto;
          }

          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-actions {
            justify-content: center;
          }

          .hero-visual {
            margin: 0 auto;
          }

          .floating-blue-cube {
            left: 5%;
            top: 15%;
          }
        }

        @media (max-width: 480px) {
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }

          .hero-btn, .hero-quote-btn {
            width: 100%;
          }

          .floating-blue-cube {
            width: 45px;
            height: 45px;
            left: 0;
            top: 10%;
          }
        }
      `}</style>
    </section>
  );
}
