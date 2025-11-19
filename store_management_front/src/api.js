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

// Register example
export function addProduct(formData) {
  return request("/api/products/insertemptyproduct", {
    method: "POST",
    body: JSON.stringify({ 
         product_price:formData.price, 
         product_brcode:formData.barcode, 
         product_name:formData.name, 
    }),
  });
}
