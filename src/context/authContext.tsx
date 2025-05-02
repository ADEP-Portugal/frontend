import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User } from '../types/user';
import { AuthService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  getUserWithToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getUserWithToken = async () => {
    if(window.location.pathname === "/login") return;
    try {
      const responseUser = await new AuthService().getUserWithToken();
      localStorage.setItem("user", JSON.stringify(responseUser));
      setUser(responseUser);
    } catch (error) {
      console.error("Erro ao buscar usuário com token:", error);
    }
  };

  useEffect(() => {
    if (window.location.pathname !== "/login" && window.location.pathname !== '/reset-password' && window.location.pathname !== '/forgot-password' && window.location.pathname !== '/email-send') {
      getUserWithToken();

      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          getUserWithToken();
        }, 60000);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, getUserWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};
