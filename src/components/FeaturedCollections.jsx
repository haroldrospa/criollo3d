import React from 'react';
import { FEATURED_COLLECTIONS } from '../data/products';
import { useLanguage } from '../context/LanguageContext';

export default function FeaturedCollections({ onSelectCategory }) {
  const { t } = useLanguage();

  return (
    <section className="featured-section" id="shop">
      <div className="container">
        
        <h2 className="section-title">{t('collections.title')}</h2>

        <div className="collections-grid">
          {FEATURED_COLLECTIONS.map((col) => {
            const itemTrans = t(`collections.items.${col.id}`);
            return (
              <div key={col.id} className="collection-card">
                
                <div className="collection-img-box">
                  <img src={col.image} alt={itemTrans.title || col.title} className="collection-img" />
                </div>

                <div className="collection-info">
                  <h3 className="collection-name">{itemTrans.title || col.title}</h3>
                  <button 
                    className="btn-primary collection-btn"
                    onClick={() => onSelectCategory(col.id)}
                  >
                    {t('collections.shopNow')}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .featured-section {
          padding: clamp(2.5rem, 5vw, 4.5rem) 0 clamp(3rem, 6vw, 5rem) 0;
          background-color: #ffffff;
        }

        .section-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: clamp(1.8rem, 4vw, 2.3rem);
          color: #111827;
          margin-bottom: clamp(1.8rem, 4vw, 2.8rem);
          letter-spacing: -0.02em;
        }

        .collections-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(1.2rem, 3vw, 2rem);
        }

        .collection-card {
          background-color: var(--bg-light-gray);
          border-radius: 20px;
          padding: clamp(1.5rem, 3vw, 2.5rem) 1.25rem clamp(1.5rem, 3vw, 2rem) 1.25rem;
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
          height: clamp(160px, 20vw, 210px);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
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
          gap: 1rem;
        }

        .collection-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: clamp(1.2rem, 2.5vw, 1.55rem);
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

        @media (max-width: 580px) {
          .collections-grid {
            grid-template-columns: 1fr;
          }
          .section-title {
            text-align: center;
          }
          .collection-btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
