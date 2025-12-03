// src/services/api.ts
export const API_BASE = import.meta.env.VITE_API_BASE || '';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string,string> || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'same-origin',
    ...options,
    headers
  });

  if (!res.ok) {
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { message: text }; }
    const err: any = new Error(data?.message || 'Erro na requisição');
    err.status = res.status;
    err.body = data;
    throw err;
  }

  // se não houver corpo
  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}
