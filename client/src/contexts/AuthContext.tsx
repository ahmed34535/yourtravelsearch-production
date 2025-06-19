import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  twoFactorEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on page load
    const storedUser = localStorage.getItem('yourtravelsearch_user');
    const sessionExpiration = localStorage.getItem('sessionExpiration');
    
    if (storedUser) {
      // Check if session has expired (only if expiration is set)
      if (sessionExpiration) {
        const expirationDate = new Date(sessionExpiration);
        if (new Date() > expirationDate) {
          // Session expired, clear stored data
          localStorage.removeItem('yourtravelsearch_user');
          localStorage.removeItem('sessionExpiration');
          setUser(null);
        } else {
          setUser(JSON.parse(storedUser));
        }
      } else {
        // No expiration set (session-only), keep user logged in
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let userData: User | null = null;
    
    if (email === "demo@travalsearch.com" && password === "demo123") {
      userData = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "demo@yourtravelsearch.com",
        isAdmin: false,
        twoFactorEnabled: false
      };
    } else if ((email === "admin@yourtravelsearch.com" || email === "admin@travalsearch.com") && password === "admin123") {
      userData = {
        id: 2,
        firstName: "Admin",
        lastName: "User",
        email: email,
        isAdmin: true,
        twoFactorEnabled: false
      };
    }
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('yourtravelsearch_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('yourtravelsearch_user');
    localStorage.removeItem('sessionExpiration');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}