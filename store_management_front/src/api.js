export const API_URL = import.meta.env.VITE_API_URL;

// Central fetch helper
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json(); // parse JSON
  } catch (err) {
    console.error("API request error:", err);
    throw err; // allow component to handle the error
  }
}

// Example GET
export function test() {
  return request("/testapi");
}

// Products
export function getProducts() {
  return request("/products");
}

export function addProduct(product) {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: "DELETE",
  });
}

// Sales
export function getSales() {
  return request("/sales");
}

export function addSale(sale) {
  return request("/sales", {
    method: "POST",
    body: JSON.stringify(sale),
  });
}

export function deleteSale(id) {
  return request(`/sales/${id}`, {
    method: "DELETE",
  });
}

// Login example
export function login(username, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}