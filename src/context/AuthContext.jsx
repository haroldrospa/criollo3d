import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const MOCK_USERS = [
  {
    id: 'user-admin-1',
    name: 'Admin Criollo3D',
    email: 'admin@criollo3d.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'user-client-1',
    name: 'Cliente Demo',
    email: 'cliente@criollo3d.com',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('criollo3d_auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('criollo3d_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('criollo3d_auth_user');
    }
  }, [user]);

  const login = (email, password) => {
    // Check if match mock accounts or dynamic login
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      setIsLoginModalOpen(false);
      return { success: true, user: foundUser };
    }

    // Default fallback if user types an admin keyword
    if (email.includes('admin')) {
      const adminUser = MOCK_USERS[0];
      setUser(adminUser);
      setIsLoginModalOpen(false);
      return { success: true, user: adminUser };
    }

    // Standard client user creation on the fly
    const newUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
    };
    setUser(newUser);
    setIsLoginModalOpen(false);
    return { success: true, user: newUser };
  };

  const register = (name, email, password) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    };
    setUser(newUser);
    setIsLoginModalOpen(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
