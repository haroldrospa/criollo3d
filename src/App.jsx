import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedCollections from './components/FeaturedCollections';
import ProductCatalog from './components/ProductCatalog';
import AboutUs from './components/AboutUs';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';
import LoginModal from './components/LoginModal';
import AdminPanel from './components/admin/AdminPanel';
import { PRODUCTS, FEATURED_COLLECTIONS } from './data/products';

const DEFAULT_HERO_CONTENT = {
  titleLine1: 'EXPLORA EL MUNDO DE LA',
  titleLine2: 'IMPRESIÓN 3D',
  subtitle: 'Descubre soluciones innovadoras en impresión 3D y desafía los límites de lo posible.',
  btn1Text: 'COMPRAR AHORA',
  btn2Text: 'COTIZAR PIEZA 3D',
  image: '/images/hero_david_white.png'
};

function AppContent() {
  const { user, isAdmin, openLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState(() => isAdmin ? 'admin' : 'home');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Store Content State with localStorage Persistence
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('criollo3d_store_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [featuredCollections, setFeaturedCollections] = useState(() => {
    const saved = localStorage.getItem('criollo3d_store_collections');
    return saved ? JSON.parse(saved) : FEATURED_COLLECTIONS;
  });

  const [heroContent, setHeroContent] = useState(() => {
    const saved = localStorage.getItem('criollo3d_store_hero');
    return saved ? JSON.parse(saved) : DEFAULT_HERO_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem('criollo3d_store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('criollo3d_store_collections', JSON.stringify(featuredCollections));
  }, [featuredCollections]);

  useEffect(() => {
    localStorage.setItem('criollo3d_store_hero', JSON.stringify(heroContent));
  }, [heroContent]);

  // Automatically switch to Admin Panel when logging in as Admin
  React.useEffect(() => {
    if (isAdmin) {
      setActiveTab('admin');
    }
  }, [isAdmin]);
  
  // Cart State
  const [cartItems, setCartItems] = useState([
    {
      id: 'prod-1',
      cartId: 'cart-init-1',
      name: 'Criollo Watch 3D Minimal',
      price: 45.00,
      image: '/images/cat_watch.png',
      selectedMaterial: 'Resina Tough',
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Toast Alerts
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3500);
  };

  // Tab switch handler with Admin Auth Guard
  const handleTabChange = (tabId) => {
    if (tabId === 'admin') {
      if (!user) {
        showToast('🔒 Debes iniciar sesión como Administrador');
        openLoginModal();
        return;
      }
      if (!isAdmin) {
        showToast('⚠️ Acceso restringido a cuentas de Administrador');
        return;
      }
    }
    setActiveTab(tabId);
  };

  // Cart Actions
  const handleAddToCart = (product, qty = 1, material = null, color = null) => {
    const cartId = `${product.id}-${material || 'default'}-${color || 'default'}`;
    
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.cartId === cartId);
      if (existing) {
        return prevItems.map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [
          ...prevItems,
          {
            ...product,
            cartId,
            selectedMaterial: material || product.materials?.[0],
            selectedColor: color || product.colors?.[0],
            quantity: qty
          }
        ];
      }
    });

    showToast(`🛒 "${product.name}" agregado al carrito`);
  };

  const handleUpdateQuantity = (cartId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(cartId);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.cartId === cartId || item.id === cartId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveItem = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId && item.id !== cartId));
    showToast('Elemento eliminado del carrito');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setActiveTab('shop');
    const elem = document.getElementById('catalog');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    setActiveTab('shop');
    const elem = document.getElementById('catalog');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuoteClick = () => {
    setActiveTab('quote');
    const elem = document.getElementById('quote');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If activeTab is 'admin' and user is admin, show Admin Panel view!
  if (activeTab === 'admin' && isAdmin) {
    return (
      <div className="app">
        <AdminPanel
          onExitAdmin={() => setActiveTab('home')}
          onToast={showToast}
          products={products}
          setProducts={setProducts}
          featuredCollections={featuredCollections}
          setFeaturedCollections={setFeaturedCollections}
          heroContent={heroContent}
          setHeroContent={setHeroContent}
        />
        <NotificationToast 
          toast={toast} 
          onClose={() => setToast(null)} 
        />
      </div>
    );
  }

  return (
    <div className="app">
      
      {/* Top Header */}
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenSearch={() => {
          setActiveTab('shop');
          const elem = document.getElementById('catalog');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main>
        {/* 1. Hero Section */}
        <Hero 
          onExploreClick={handleExploreClick}
          onQuoteClick={handleQuoteClick}
          heroContent={heroContent}
        />

        {/* 2. Featured Collections Grid */}
        <FeaturedCollections 
          onSelectCategory={handleCategorySelect}
          collections={featuredCollections}
        />

        {/* 3. Product Catalog */}
        <ProductCatalog 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddToCart={handleAddToCart}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          products={products}
        />

        {/* 4. About Us Section */}
        <AboutUs />
      </main>

      {/* Footer */}
      <Footer onNavClick={(id) => {
        handleTabChange(id);
        const elem = document.getElementById(id);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Quick View Product Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Login & Auth Modal */}
      <LoginModal 
        onNotification={showToast}
        onLoginSuccess={(u) => {
          if (u?.role === 'admin') {
            setActiveTab('admin');
          }
        }}
      />

      {/* Notification Toast */}
      <NotificationToast 
        toast={toast} 
        onClose={() => setToast(null)} 
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
