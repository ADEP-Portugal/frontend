import { createContext, useContext, useState, useEffect } from 'react';
import { useLogin } from '../hooks/auth';
import { User } from '../types/user';
import { useQuery } from '@tanstack/react-query';
import { AuthService } from '../services/auth.service';
import api from '../lib/axios';
import { toast } from 'sonner';

interface AuthContextType {
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  user: User | null;
  token: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = useLogin((response) => {
    setToken(response.token);
    setUser(response.user);
    setLoading(false);
  }, (error) => {
    if (error.status === 401) {
      toast.error("Credenciais inválidas");
    } else {
      toast.error("Erro ao realizar login");
    }
    setLoading(false);
  });
  const { data } = useQuery({ queryKey: ['refresh'], queryFn: new AuthService().refresh })

  // Função para efetuar o login
  const login = async (email: string, password: string) => {
    setLoading(true);
    await mutateAsync({ email, password });
    toast.success('Login realizado com sucesso!');
  };

  // Função para efetuar logout
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Ao montar, tenta renovar a sessão usando o refresh token armazenado no cookie HttpOnly
  useEffect(() => {
    if (data) {
      setToken(data.token);
      setUser(data.user);
    }
  }, [data]);

  // Interceptor para adicionar o token em requisições futuras
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
