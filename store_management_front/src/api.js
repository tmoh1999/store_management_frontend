// src/api.js

export const API_URL = import.meta.env.VITE_API_URL;

// Example API: GET /test_api
export async function test() {
  const response = await fetch(`${API_URL}/testapi`);
  return response.json();
}
