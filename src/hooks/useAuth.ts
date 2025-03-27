import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (username: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(username);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.logout();
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
      // Even if the server request fails, we still want to clear local storage and redirect
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    logout,
    isLoading,
    error,
  };
}; 