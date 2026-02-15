/**
 * Enhanced API Client with automatic token refresh
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

class ApiClient {
  private refreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  private async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        return data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }

  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { skipAuth, skipRefresh, ...fetchConfig } = config;

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchConfig.headers,
    };

    // Add auth token if not skipped
    if (!skipAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Make request
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchConfig,
      headers,
    });

    // Handle token expiration
    if (response.status === 401 && !skipRefresh) {
      const data = await response.json();
      
      if (data.code === 'TOKEN_EXPIRED') {
        // Token expired, try to refresh
        if (!this.refreshing) {
          this.refreshing = true;
          const newToken = await this.refreshToken();
          this.refreshing = false;

          if (newToken) {
            this.onTokenRefreshed(newToken);
            
            // Retry original request with new token
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(`${API_BASE_URL}${endpoint}`, {
              ...fetchConfig,
              headers,
            });
          } else {
            // Refresh failed, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
          }
        } else {
          // Wait for ongoing refresh
          const newToken = await new Promise<string>((resolve) => {
            this.subscribeTokenRefresh(resolve);
          });

          // Retry with new token
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...fetchConfig,
            headers,
          });
        }
      }
    }

    // Parse response
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Request failed');
    }

    return responseData;
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export convenience functions
export const api = {
  get: <T = any>(endpoint: string, config?: RequestConfig) =>
    apiClient.get<T>(endpoint, config),
  post: <T = any>(endpoint: string, data?: any, config?: RequestConfig) =>
    apiClient.post<T>(endpoint, data, config),
  put: <T = any>(endpoint: string, data?: any, config?: RequestConfig) =>
    apiClient.put<T>(endpoint, data, config),
  patch: <T = any>(endpoint: string, data?: any, config?: RequestConfig) =>
    apiClient.patch<T>(endpoint, data, config),
  delete: <T = any>(endpoint: string, config?: RequestConfig) =>
    apiClient.delete<T>(endpoint, config),
};

export default api;
