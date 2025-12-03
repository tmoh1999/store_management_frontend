import { useNavigate } from "react-router-dom";
export const API_URL = import.meta.env.VITE_API_URL;

export async function request(url, options = {}) {
  const token = localStorage.getItem("token");
  const req_url=API_URL+url;
  console.log(req_url);

  const headers = {
    ...(options.headers || {}),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(req_url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      let errorMsg=text;
      try {
        const json = JSON.parse(text);
        errorMsg = json.error || json.message || text;
      } catch (e) {
        // text was not JSON
        console.log(e);
      }
      
      // Special case: token expired
      if (errorMsg.includes("expired")) {
      	console.log(errorMsg);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      throw new Error(errorMsg);
      //throw new Error(errorMessage || "Request failed");
    }

    return await response.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}
export async function downloadFile(url, filename) {
  const token = localStorage.getItem("token");
  const req_url = API_URL + url;

  try {
    const response = await fetch(req_url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Read text to detect token expiration
      const text = await response.text();

      if (text.includes("expired")) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      throw new Error("Download failed");
    }

    // Read as Blob (very important)
    const blob = await response.blob();

    // Create download link
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Clean blob URL
    window.URL.revokeObjectURL(urlBlob);

  } catch (err) {
    console.error("Download Error:", err);
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
export function removeRow(path) {
  return request(path);
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
export function updateProduct(formData,path) {
  return request(path, {
    method: "POST",
    body: JSON.stringify({ 
         product_price:formData.price, 
         product_brcode:formData.barcode, 
         product_name:formData.name, 
    }),
  });
}
// api.js

// Productq

export function saveProductRow(row) {
  const  path="/api/products/"+row.id+"/update";
  return request(path, {
    method: "POST",
    body: JSON.stringify({ 
         product_price:row.price, 
         product_brcode:row.barcode, 
         product_name:row.name, 
    }),
  });
}

// Option 1: plain function (without navigate)
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Option 2: function with navigate (requires passing navigate)
export function logoutAndRedirect(navigate) {
  logout();
  navigate("/login");
}


export function addSale() {
  return request("/api/sales/add");
}

export function getSales() {
  return request("/api/sales/list");
}

export function addSaleItem(formData,sale_id) {
  return request("/api/sales/items/add",{
  method:"POST",
  body:JSON.stringify({
  	     sale_id:sale_id ,
           price:formData.price ,
           description:formData.description,
           quantity:formData.quantity,
         }),
  });
}

export function getSaleItems(sale_id) {
  
  return request("/api/sales/items/list",{
  method:"POST",
  body:JSON.stringify({
           sale_id:sale_id ,
         }),
  });
}

export function updateSaleItem(row) {
	
  const  path="/api/sales/items/update";
  return request(path,{
  method:"POST",
  body:JSON.stringify({
  	     item_id:row.id ,
           price:row.price ,
           description:row.description,
           quantity:row.quantity,
         }),
  });
  
}

export function confirmSale(sale_id) {
  const path="/api/sales/"+sale_id+"/confirm";
  return request(path);
}


export function getTransactions() {
  return request("/api/transactions/list");
}

export function saveTransactionRow(row) {
  const  path="/api/transactions/"+row.id+"/update";
  return request(path, {
    method: "POST",
    body: JSON.stringify({ 
         note:row.note, 
    }),
  });
}

export function addPurchase() {
  return request("/api/purchases/add");
}

export function getPurchases() {
  return request("/api/purchases/list");
}

export function addPurchaseItem(formData,purchase_id) {
  return request("/api/purchases/items/add",{
  method:"POST",
  body:JSON.stringify({
  	       purchase_id:purchase_id ,
           price:formData.price,
           quantity:formData.quantity,
         }),
  });
}

export function getPurchaseItems(purchase_id) {
  
  return request("/api/purchases/items/list",{
  method:"POST",
  body:JSON.stringify({
           purchase_id:purchase_id ,
         }),
  });
}

export function updatePurchaseItem(row) {
	
  const  path="/api/purchases/items/update";
  return request(path,{
  method:"POST",
  body:JSON.stringify({
  	       item_id:row.id ,
           price:row.price ,
           quantity:row.quantity,
         }),
  });
  
}

export function confirmPurchase(purchase_id) {
  const path="/api/purchases/"+purchase_id+"/confirm";
  return request(path);
}


export function addSupplier(formData) {
  return request("/api/suppliers/add", {
    method: "POST",
    body: JSON.stringify({ 
         name:formData.name, 
         email:formData.email, 
         phone:formData.phone, 
    }),
  });
}

export function getSuppliers() {
  return request("/api/suppliers/list");
}


export function saveSuppliersRow(row) {
  const  path="/api/suppliers/"+row.id+"/update";
  return request(path, {
    method: "POST",
    body: JSON.stringify({ 
         name:row.name, 
         email:row.email, 
         phone:row.phone, 
    }),
  });
}