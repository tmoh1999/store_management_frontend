export const API_URL = import.meta.env.VITE_API_URL;

export async function request(url, options = {}) {
  const token = localStorage.getItem("token");
  const req_url=API_URL+url;
  console.log(req_url);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(req_url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Request failed");
    }

    return await response.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
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
export function login(formData) {
  return request("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ username:formData.username, 
     password:formData.password,}),
  }
);
}
// Register example
export function register(formData) {
  return request("/api/users/register", {
    method: "POST",
    body: JSON.stringify({ username:formData.username, 
     password:formData.password,}),
  }
);



}
// Productq
export function getProducts() {
  return request("/api/products/productlist");
}