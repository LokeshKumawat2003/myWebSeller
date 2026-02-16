export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Generic fetch helper. Accepts optional fetch `options` (headers, method, body).
export async function tryFetch(path, options = {}) {
  const merged = Object.assign({ credentials: 'include' }, options)
  const res = await fetch(path, merged)
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    let msg = `Request failed (${res.status})`
    try {
      const json = JSON.parse(body)
      if (json && json.message) msg += `: ${json.message}`
    } catch (e) {}
    throw new Error(msg)
  }
  // try parse JSON
  return res.json()
}

// Token storage helpers (store raw JWT, not the 'Bearer ' prefix)
const TOKEN_KEY = 'AGRI_TOKEN'
export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function getProducts() {
  // Try common backend endpoints; prefer the backend's exposed `/products` route
  // to avoid a noisy 404 from `/api/products` which this backend does not expose.
  const candidates = [`${API_URL}/products`, `${API_URL}/api/products`]
  let lastErr = null
  for (const url of candidates) {
    try {
      const data = await tryFetch(url)
      // Backend may return { products, total, page } or an array
      if (Array.isArray(data)) return data
      if (data && Array.isArray(data.products)) return data.products
      // If data is an object but doesn't contain products array, return it for handling elsewhere
      return data
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr || new Error('No product endpoint available')
}

export async function getFeaturedProducts(limit = 12) {
  const data = await tryFetch(`${API_URL}/products/featured?limit=${limit}`)
  return data.products || data
}

export async function getNewArrivals(limit = 4) {
  const data = await tryFetch(`${API_URL}/new-arrivals?limit=${limit}`)
  return data.products || data
}

export async function getProduct(productId) {
  const candidates = [`${API_URL}/products/${productId}`, `${API_URL}/api/products/${productId}`]
  let lastErr = null
  for (const url of candidates) {
    try {
      return await tryFetch(url)
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr || new Error('Product not found')
}

// --- Additional API helpers for admin/user/seller flows ---

export async function getCategories() {
  return tryFetch(`${API_URL}/categories`)
}

export async function getNavigations() {
  return tryFetch(`${API_URL}/navigations`)
}

export async function authLogin(payload) {
  return tryFetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function authRegister(payload) {
  return tryFetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function adminListSellers(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/admin/sellers`, { headers })
}

export async function adminApproveSeller(sellerId, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
  return tryFetch(`${API_URL}/admin/sellers/${sellerId}/approve`, { method: 'POST', headers })
}

export async function adminApproveProduct(productId, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
  return tryFetch(`${API_URL}/admin/products/${productId}/approve`, { method: 'POST', headers })
}

export async function adminSeedSeller() {
  const t = getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
  return tryFetch(`${API_URL}/admin/seed-seller`, { method: 'POST', headers })
}

export async function sellerGetMyProducts(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/products/seller/my-products`, { headers })
}

export async function getSellerProfile(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/seller/me`, { headers })
}

export async function sellerCreateProduct(payload, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/products`, { method: 'POST', headers, body: JSON.stringify(payload) })
}

// Create product with FormData (for file uploads). If payload is FormData, send without JSON headers.
export async function sellerCreateProductForm(formData, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  // Use fetch directly because tryFetch expects JSON and sets headers
  const res = await fetch(`${API_URL}/products`, { method: 'POST', headers, body: formData, credentials: 'include' })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    let msg = `Request failed (${res.status})`
    try {
      const json = JSON.parse(body)
      if (json && json.message) msg += `: ${json.message}`
    } catch (e) {}
    throw new Error(msg)
  }
  return res.json()
}

export async function sellerRequestAccount(payload, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/seller/register`, { method: 'POST', headers, body: JSON.stringify(payload) })
}

// --- Cart APIs ---
export async function getCart(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/cart`, { headers })
}

export async function addCartItem(payload, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/cart/items`, { method: 'POST', headers, body: JSON.stringify(payload) })
}

export async function updateCartItem(itemId, payload, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/cart/items/${itemId}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
}

export async function deleteCartItem(itemId, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/cart/items/${itemId}`, { method: 'DELETE', headers })
}

// --- Wishlist APIs ---
export async function getWishlist(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/wishlist`, { headers })
}

export async function addToWishlist(payload, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/wishlist/items`, { method: 'POST', headers, body: JSON.stringify(payload) })
}

export async function removeFromWishlist(itemId, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/wishlist/items/${itemId}`, { method: 'DELETE', headers })
}

export async function checkWishlistStatus(productId, variant, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  const params = new URLSearchParams({ product: productId, variant: JSON.stringify(variant) })
  return tryFetch(`${API_URL}/wishlist/status?${params}`, { headers })
}

// --- Orders / Checkout ---
export async function checkoutOrder(payload, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/orders/checkout`, { method: 'POST', headers, body: JSON.stringify(payload) })
}

// --- Reviews ---
export async function createReview(payload, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/reviews`, { method: 'POST', headers, body: JSON.stringify(payload) })
}

// --- Banners & Categories ---
export async function listBanners() {
  return tryFetch(`${API_URL}/banners`)
}

export async function listCategories() {
  return tryFetch(`${API_URL}/categories`)
}

export async function getCategoryDisplays() {
  return tryFetch(`${API_URL}/category-display`)
}

// --- Payments (stub) ---
export async function createPaymentIntent(payload, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/payments/create`, { method: 'POST', headers, body: JSON.stringify(payload) })
}

export async function sellerUpdateProduct(productId, payload, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/products/${productId}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
}

export async function sellerUpdateProductForm(productId, formData, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  const res = await fetch(`${API_URL}/products/${productId}`, { method: 'PUT', headers, body: formData, credentials: 'include' })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    let msg = `Request failed (${res.status})`
    try {
      const json = JSON.parse(body)
      if (json && json.message) msg += `: ${json.message}`
    } catch (e) {}
    throw new Error(msg)
  }
  return res.json()
}

export async function sellerDeleteProduct(productId, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/products/${productId}`, { method: 'DELETE', headers })
}

export async function getUserOrders(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/orders`, { headers })
}

export async function getSellerOrders(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/seller/orders`, { headers })
}

export async function updateOrderStatus(orderId, status, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/orders/${orderId}/status`, { method: 'PUT', headers, body: JSON.stringify({ status }) })
}

export async function getOrder(orderId, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/orders/${orderId}`, { headers })
}

export async function getOrderTracking(orderId, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/orders/${orderId}/track`, { headers })
}

// --- Support APIs ---
export async function createSupportTicket(payload, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/support`, { method: 'POST', headers, body: JSON.stringify(payload) })
}

export async function getUserSupportTickets(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/support`, { headers })
}

export async function postSupportMessage(ticketId, message, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/support/${ticketId}/message`, { method: 'POST', headers, body: JSON.stringify({ message }) })
}

export async function getAssignedSupportTickets(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/support/assigned`, { headers })
}

export async function postSupportResponse(ticketId, message, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/support/${ticketId}/support-message`, { method: 'POST', headers, body: JSON.stringify({ message }) })
}

export async function updateSupportTicketStatus(ticketId, status, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/support/${ticketId}/status`, { method: 'PUT', headers, body: JSON.stringify({ status }) })
}

export async function getAllSupportTickets(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/support/all`, { headers })
}

export async function assignSupportTicket(ticketId, assignedTo, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/support/${ticketId}/assign`, { method: 'PUT', headers, body: JSON.stringify({ assignedTo }) })
}

// Address Management API
export async function getUserAddresses(token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/auth/addresses`, { headers })
}

export async function addUserAddress(addressData, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/auth/addresses`, { method: 'POST', headers, body: JSON.stringify(addressData) })
}

export async function updateUserAddress(addressId, addressData, token) {
  const t = token || getAuthToken()
  const headers = Object.assign({ 'Content-Type': 'application/json' }, t ? { Authorization: `Bearer ${t}` } : {})
  return tryFetch(`${API_URL}/auth/addresses/${addressId}`, { method: 'PUT', headers, body: JSON.stringify(addressData) })
}

export async function deleteUserAddress(addressId, token) {
  const t = token || getAuthToken()
  const headers = t ? { Authorization: `Bearer ${t}` } : {}
  return tryFetch(`${API_URL}/auth/addresses/${addressId}`, { method: 'DELETE', headers })
}
// OTP-based authentication functions
export async function sendOTPRegister(payload) {
  return tryFetch(`${API_URL}/auth/otp/send-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function sendOTPLogin(payload) {
  return tryFetch(`${API_URL}/auth/otp/send-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function verifyOTPRegister(payload) {
  return tryFetch(`${API_URL}/auth/otp/verify-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function verifyOTPLogin(payload) {
  return tryFetch(`${API_URL}/auth/otp/verify-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}