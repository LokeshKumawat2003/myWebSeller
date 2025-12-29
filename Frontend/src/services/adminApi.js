import { API_URL, getAuthToken, tryFetch } from "./api";

// Admin Sellers APIs
export async function adminListSellers(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/admin/sellers`, { headers });
}

export async function adminListAdmins(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/admin/admins`, { headers });
}

export async function adminApproveSeller(sellerId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/admin/sellers/${sellerId}/approve`, {
    method: "POST",
    headers,
  });
}

export async function adminBlockSeller(sellerId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/admin/sellers/${sellerId}/block`, {
    method: "POST",
    headers,
  });
}

export async function adminUnblockSeller(sellerId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/admin/sellers/${sellerId}/unblock`, {
    method: "POST",
    headers,
  });
}

export async function adminRejectSeller(sellerId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/admin/sellers/${sellerId}/reject`, {
    method: "POST",
    headers,
  });
}

// Admin Products APIs
export async function adminApproveProduct(productId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/products/admin/${productId}/status`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status: "approved" }),
  });
}

export async function adminGetAllProducts(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/products/admin/all`, { headers });
}

export async function adminUpdateProductStatus(productId, status, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/products/admin/${productId}/status`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status }),
  });
}

export async function adminBlockProduct(productId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/products/admin/${productId}/block`, {
    method: "POST",
    headers,
  });
}

export async function adminUnblockProduct(productId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/products/admin/${productId}/unblock`, {
    method: "POST",
    headers,
  });
}

export async function adminDeleteProduct(productId, token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/products/admin/${productId}`, {
    method: "DELETE",
    headers,
  });
}

export async function adminToggleFeatured(productId, token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/products/admin/${productId}/featured`, {
    method: "PUT",
    headers,
  });
}

export async function adminToggleTrending(productId, token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/products/admin/${productId}/trending`, {
    method: "PUT",
    headers,
  });
}

export async function adminToggleNew(productId, token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/products/admin/${productId}/new`, {
    method: "PUT",
    headers,
  });
}

// Admin Orders APIs
export async function adminGetAllOrders(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/admin/orders`, { headers });
}

export async function adminUpdateOrderStatus(orderId, status, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status }),
  });
}

export async function adminMarkOrderDelivered(orderId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/admin/orders/${orderId}/deliver`, {
    method: "POST",
    headers,
  });
}

// Admin Users APIs
export async function adminGetAllUsers(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/users`, { headers });
}

// Seed test seller (for testing)
export async function adminSeedSeller(token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/admin/seed-seller`, { method: "POST", headers });
}

// Seed basic categories (for testing)
export async function adminSeedCategories(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/admin/seed-categories`, { method: "POST", headers });
}

// Admin Categories APIs
export async function adminListCategories(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/categories`, { headers });
}

export async function adminCreateCategory(payload, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

export async function adminUpdateCategory(categoryId, payload, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteCategory(categoryId, token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers,
  });
}

// Admin Payments APIs
export async function adminListPayments(
  status = "",
  page = 1,
  limit = 50,
  token
) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("page", page);
  params.append("limit", limit);
  return tryFetch(`${API_URL}/payments/admin/list?${params}`, { headers });
}

export async function adminApprovePayment(paymentId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/payments/admin/${paymentId}/approve`, {
    method: "POST",
    headers,
  });
}

export async function adminRejectPayment(paymentId, rejectionReason, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/payments/admin/${paymentId}/reject`, {
    method: "POST",
    headers,
    body: JSON.stringify({ rejectionReason }),
  });
}

export async function adminPayPayment(paymentId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/payments/admin/${paymentId}/pay`, {
    method: "POST",
    headers,
  });
}

export async function adminGetPaymentAnalytics(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/payments/admin/analytics`, { headers });
}

// Admin Banners APIs
export async function adminListBanners(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/banners`, { headers });
}

export async function adminCreateBanner(bannerData, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/banners`, {
    method: "POST",
    headers,
    body: JSON.stringify(bannerData),
  });
}

export async function adminUpdateBanner(bannerId, bannerData, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/banners/${bannerId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(bannerData),
  });
}

export async function adminDeleteBanner(bannerId, token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/banners/${bannerId}`, {
    method: "DELETE",
    headers,
  });
}

// Admin New Arrivals APIs
export async function adminListNewArrivals(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/new-arrivals/admin/list`, { headers });
}

export async function adminAddToNewArrivals(productId, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/new-arrivals/admin/${productId}`, {
    method: "POST",
    headers,
  });
}

export async function adminRemoveFromNewArrivals(productId, token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/new-arrivals/admin/${productId}`, {
    method: "DELETE",
    headers,
  });
}

export async function adminUpdateNewArrivalOrder(productId, order, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/new-arrivals/admin/order/${productId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ order }),
  });
}

// Admin Navigation APIs
export async function adminListNavigations(token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/navigations`, { headers });
}

export async function adminCreateNavigation(data, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/navigations`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
}

export async function adminUpdateNavigation(id, data, token) {
  const t = token || getAuthToken();
  const headers = t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
  return tryFetch(`${API_URL}/navigations/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
}

export async function adminDeleteNavigation(id, token) {
  const t = token || getAuthToken();
  const headers = t ? { Authorization: `Bearer ${t}` } : {};
  return tryFetch(`${API_URL}/navigations/${id}`, {
    method: "DELETE",
    headers,
  });
}
