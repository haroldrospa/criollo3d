import React from 'react';
import { ShieldCheck, Cpu, Flame, Award } from 'lucide-react';

export default function AboutUs() {
  return (
    <section className="about-section" id="about">
      <div className="container about-container">
        
        {/* Left Column: Corporate Info */}
        <div className="about-content">
          <h2 className="about-title">About Us</h2>
          
          <p className="about-text">
            Our company is dedicated to providing state-of-the-art 3D printing services and products. 
            With a commitment to quality and innovation, we strive to push the boundaries of what's 
            possible with 3D printing.
          </p>

          <div className="about-features">
            <div className="feature-item">
              <div className="feature-icon"><Cpu size={22} /></div>
              <div>
                <h4>Tecnología FDM & SLA</h4>
                <p>Equipos industriales de resolución micrónica para máxima precisión.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon"><ShieldCheck size={22} /></div>
              <div>
                <h4>Garantía de Calidad</h4>
                <p>Inspección pieza por pieza y materiales de grado de ingeniería.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Dark Classical Bust Visual */}
        <div className="about-visual">
          <div className="about-image-wrapper">
            <img 
              src="/images/about_david_dark.png" 
              alt="Criollo3D About Statue" 
              className="about-image"
            />
          </div>
        </div>

      </div>

      <style>{`
        .about-section {
          padding: 5rem 0 6rem 0;
          background-color: #ffffff;
        }

        .about-container {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 4rem;
        }

        .about-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 2.6rem;
          color: #111827;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .about-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #4B5563;
          margin-bottom: 2.5rem;
          max-width: 520px;
        }

        .about-features {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background-color: var(--primary-blue-light);
          color: var(--primary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-item h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.2rem;
        }

        .feature-item p {
          font-size: 0.9rem;
          color: #6B7280;
          line-height: 1.4;
        }

        .about-visual {
          display: flex;
          justify-content: center;
        }

        .about-image-wrapper {
          width: 100%;
          max-width: 420px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          background-color: var(--bg-light-gray);
        }

        .about-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .about-image-wrapper:hover .about-image {
          transform: scale(1.03);
        }

        @media (max-width: 900px) {
          .about-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .about-visual {
            order: -1;
          }
          .about-text {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
