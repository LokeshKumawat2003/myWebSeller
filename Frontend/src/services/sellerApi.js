import { API_URL, getAuthToken, tryFetch } from './api';

// Seller Payment APIs
export async function requestPayment(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  return tryFetch(`${API_URL}/payments/request`, { method: 'POST', headers });
}

export async function getSellerPaymentHistory(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/payments/history`, { headers });
}

export async function getSellerEarnings(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/payments/earnings`, { headers });
}
