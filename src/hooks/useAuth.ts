import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; username: string } | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
    token: null,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      const user = authService.getUser();
      
      if (token && user) {
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          user,
          token,
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (username: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log("Starting login process for:", username);
      
      const response = await authService.login(username);
      console.log("Login successful:", response);

      // Set auth state before navigation
      setState({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
        error: null,
        token: response.token,
      });

      // Add a small delay before navigation to ensure state is updated
      setTimeout(() => {
        navigate("/main", { replace: true });
      }, 100);

    } catch (error) {
      console.error("Login failed:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await authService.logout();
      
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
        token: null,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Logout failed",
      }));
    }
  }, [navigate]);

  return {
    ...state,
    login,
    logout,
  };
}; 