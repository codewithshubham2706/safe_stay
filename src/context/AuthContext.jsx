import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    // Check web client strictly in sessionStorage (privacy model)
    const sessionToken = window.sessionStorage.getItem('safestay_jwt');
    const sessionUser = window.sessionStorage.getItem('safestay_user');

    if (sessionToken && sessionUser) {
      try {
        setToken(sessionToken);
        setUser(JSON.parse(sessionUser));
      } catch (e) {
        window.sessionStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken, persistMobile = false) => {
    setUser(userData);
    setToken(jwtToken);
    setIsMobileMode(persistMobile);

    if (persistMobile) {
      // Mobile persistent storage simulation (FlutterSecureStorage)
      localStorage.setItem('safestay_mobile_jwt', jwtToken);
      localStorage.setItem('safestay_mobile_user', JSON.stringify(userData));
    } else {
      // Web client: STRICTLY window.sessionStorage (cleared when browser/tab closes)
      window.sessionStorage.setItem('safestay_jwt', jwtToken);
      window.sessionStorage.setItem('safestay_user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.sessionStorage.clear();
    localStorage.removeItem('safestay_mobile_jwt');
    localStorage.removeItem('safestay_mobile_user');
  };

  const updateUserPreferences = (aiPreferences) => {
    if (!user) return;
    const updatedUser = { ...user, aiPreferences };
    setUser(updatedUser);
    if (isMobileMode) {
      localStorage.setItem('safestay_mobile_user', JSON.stringify(updatedUser));
    } else {
      window.sessionStorage.setItem('safestay_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateUserPreferences, isMobileMode, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
