import React from 'react';
import { FEATURED_COLLECTIONS } from '../data/products';

export default function FeaturedCollections({ onSelectCategory }) {
  return (
    <section className="featured-section" id="shop">
      <div className="container">
        
        <h2 className="section-title">Featured Collections</h2>

        <div className="collections-grid">
          {FEATURED_COLLECTIONS.map((col) => (
            <div key={col.id} className="collection-card">
              
              <div className="collection-img-box">
                <img src={col.image} alt={col.title} className="collection-img" />
              </div>

              <div className="collection-info">
                <h3 className="collection-name">{col.title}</h3>
                <button 
                  className="btn-primary collection-btn"
                  onClick={() => onSelectCategory(col.id)}
                >
                  {col.buttonText}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      <style>{`
        .featured-section {
          padding: 3rem 0 5rem 0;
          background-color: #ffffff;
        }

        .section-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 2.2rem;
          color: #111827;
          margin-bottom: 2.5rem;
          letter-spacing: -0.02em;
        }

        .collections-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .collection-card {
          background-color: var(--bg-light-gray);
          border-radius: 20px;
          padding: 2.5rem 1.5rem 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }

        .collection-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.06);
        }

        .collection-img-box {
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .collection-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.4s ease;
        }

        .collection-card:hover .collection-img {
          transform: scale(1.06);
        }

        .collection-info {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }

        .collection-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.6rem;
          color: #111827;
        }

        .collection-btn {
          font-size: 0.8rem;
          padding: 0.65rem 1.6rem;
          width: auto;
          min-width: 130px;
        }

        @media (max-width: 900px) {
          .collections-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .collections-grid {
            grid-template-columns: 1fr;
          }
          .section-title {
            font-size: 1.8rem;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
