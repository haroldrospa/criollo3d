import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ onExploreClick, onQuoteClick }) {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        {/* Left Column: Text & Call to Action */}
        <div className="hero-content">
          <h1 className="hero-title">
            EXPLORE THE<br />
            WORLD OF<br />
            3D PRINTING
          </h1>

          <p className="hero-subtitle">
            Discover innovative 3D printing solutions and push the boundaries of what's possible.
          </p>

          <div className="hero-actions">
            <button className="btn-primary hero-btn" onClick={onExploreClick}>
              SHOP NOW
            </button>
            <button className="btn-outline hero-quote-btn" onClick={onQuoteClick}>
              <Sparkles size={16} /> Cotizar Pieza 3D
            </button>
          </div>
        </div>

        {/* Right Column: 3D Rendered Bust Visual matching reference image */}
        <div className="hero-visual">
          <div className="visual-wrapper">
            
            {/* Floating Isometric 3D Blue Cube graphic matching reference */}
            <div className="floating-blue-cube animate-float">
              <svg viewBox="0 0 100 100" width="70" height="70" fill="none">
                <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="#0055FF" />
                <path d="M50 10 L85 30 L50 50 L15 30 Z" fill="#2973FF" />
                <path d="M50 50 L85 30 L85 70 L50 90 Z" fill="#0044CC" />
              </svg>
            </div>

            {/* Main Classical Bust Sculpture Image */}
            <div className="hero-image-box">
              <img 
                src="/images/hero_david_white.png" 
                alt="3D Printed Michelangelo David Bust" 
                className="hero-image"
              />
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .hero-section {
          padding: 4rem 0 5rem 0;
          background-color: #ffffff;
          position: relative;
          overflow: hidden;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 3rem;
        }

        .hero-content {
          max-width: 580px;
        }

        .hero-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 3.8rem;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #111827;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }

        .hero-subtitle {
          font-size: 1.15rem;
          line-height: 1.6;
          color: #4B5563;
          margin-bottom: 2.2rem;
          font-weight: 400;
          max-width: 480px;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-btn {
          font-size: 0.9rem;
          padding: 0.95rem 2.4rem;
          letter-spacing: 0.06em;
        }

        .hero-quote-btn {
          padding: 0.9rem 1.8rem;
        }

        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .visual-wrapper {
          position: relative;
          width: 100%;
          max-width: 460px;
          display: flex;
          justify-content: center;
        }

        .hero-image-box {
          width: 100%;
          max-width: 420px;
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
          top: 35%;
          left: 5%;
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

          .hero-title {
            font-size: 2.8rem;
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
            left: 0;
            top: 20%;
          }
        }

        @media (max-width: 580px) {
          .hero-title {
            font-size: 2.2rem;
          }

          .hero-section {
            padding: 2.5rem 0 3.5rem 0;
          }
        }
      `}</style>
    </section>
  );
}
