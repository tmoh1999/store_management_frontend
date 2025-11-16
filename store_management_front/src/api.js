// src/api.js
export const API_URL = import.meta.env.VITE_API_URL;

// Example API: GET /testapi
export async function test() {
  const response = await fetch(`${API_URL}/testapi`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  // Convert to JSON
  const data = await response.json();
  return data;
}