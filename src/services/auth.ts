import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface LoginResponse {
  result: boolean;
  token: string;
  user: {
    id: string;
    username: string;
  };
  message: string;
  timestamp: string;
}

interface ApiResponse<T> {
  data: T;
  result: boolean;
  timestamp: string;
}

export const authService = {
  async login(username: string): Promise<LoginResponse> {
    try {
      
      const response = await apiClient.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, {
        username,
      });
      
      

      if (!response.data?.data) {
        console.error("No data in response");
        throw new Error("No response data received");
      }

      const loginData = response.data.data;
      
      if (loginData.result && loginData.token) {
        
        
        // Store token and user data
        localStorage.setItem("token", loginData.token);
        localStorage.setItem("user", JSON.stringify(loginData.user));
        
        // Set default authorization header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${loginData.token}`;
        
        // Verify token is set before proceeding
        if (!apiClient.defaults.headers.common['Authorization']) {
          throw new Error("Failed to set authorization header");
        }
        return loginData;
      } else {
        console.error("Login failed - Response data:", {
          result: loginData.result,
          hasToken: !!loginData.token,
          message: loginData.message
        });
        throw new Error(loginData.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error details:", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete apiClient.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  getUser(): { id: string; username: string } | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
}; 