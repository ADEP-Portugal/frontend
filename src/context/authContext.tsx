import { createContext, useContext, useState } from 'react';
import { User } from '../types/user';
import { AuthService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  getUserWithToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  getUserWithToken: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null);

  const getUserWithToken = async () => {
    if (window.location.pathname === "/login" || window.location.pathname == '/reset-password' || window.location.pathname == '/forgot-password' || window.location.pathname == '/email-send') return;
    try {
      const responseUser = await new AuthService().getUserWithToken();
      localStorage.setItem("user", JSON.stringify(responseUser));
      setUser(responseUser);
    } catch (error) {
      console.error("Erro ao buscar usuário com token:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, getUserWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};
