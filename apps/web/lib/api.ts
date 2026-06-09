const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }
  return res.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    fetchAPI<T>(endpoint, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
  post: <T>(endpoint: string, data: unknown, token?: string) =>
    fetchAPI<T>(endpoint, { method: 'POST', body: JSON.stringify(data), headers: token ? { Authorization: `Bearer ${token}` } : {} }),
  put: <T>(endpoint: string, data: unknown, token?: string) =>
    fetchAPI<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), headers: token ? { Authorization: `Bearer ${token}` } : {} }),
  delete: <T>(endpoint: string, token?: string) =>
    fetchAPI<T>(endpoint, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} }),
};

export default api;
