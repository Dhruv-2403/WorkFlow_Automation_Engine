const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export function apiFetch(path, init) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`
  return fetch(url, init)
}
