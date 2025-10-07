import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api";
import { AdminUser } from "../types";

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: AdminUser) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("adminAuthToken")
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          // Try to get current admin with existing token
          const userData = await api.getCurrentAdmin();
          setUser(userData);
        }
      } catch (error: any) {
        console.error("Failed to initialize auth:", error);
        // Token is invalid, remove it
        localStorage.removeItem("adminAuthToken");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.login(credentials.email, credentials.password);

      if (response.token) {
        localStorage.setItem("adminAuthToken", response.token);
        localStorage.setItem("currentAdmin", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        return { success: true };
      } else {
        throw new Error("No token received from server");
      }
        } catch (error: any) {
          console.error("Login failed:", error);
          return { success: false, error: error.message };
        }
  };

  const logout = () => {
    localStorage.removeItem("adminAuthToken");
    localStorage.removeItem("currentAdmin");
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: AdminUser) => {
    setUser(userData);
    localStorage.setItem("currentAdmin", JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
