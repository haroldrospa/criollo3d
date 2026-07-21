import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedCollections from './components/FeaturedCollections';
import ProductCatalog from './components/ProductCatalog';
import CustomQuoteSection from './components/CustomQuoteSection';
import AboutUs from './components/AboutUs';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
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

  return (
    <div className="app">
      
      {/* Top Header */}
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
        />

        {/* 2. Featured Collections Grid */}
        <FeaturedCollections 
          onSelectCategory={handleCategorySelect}
        />

        {/* 3. Product Catalog */}
        <ProductCatalog 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddToCart={handleAddToCart}
          onQuickView={(prod) => setQuickViewProduct(prod)}
        />

        {/* 4. Custom 3D Quote Generator Section */}
        <CustomQuoteSection 
          onQuoteSubmitted={(quote) => showToast(`✉️ Cotización #${quote.quoteId} enviada con éxito`)}
        />

        {/* 5. About Us Section */}
        <AboutUs />
      </main>

      {/* Footer */}
      <Footer onNavClick={(id) => {
        setActiveTab(id);
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
      <AppContent />
    </LanguageProvider>
  );
}
