const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
export const api = {
  dashboard: () => request("/dashboard"),
  chat: (message: string, language: string) => request("/chat", { method: "POST", body: JSON.stringify({ message, language }) }),
  diagnosis: (imageName: string) => request("/diagnose", { method: "POST", body: JSON.stringify({ imageName }) }),
  weather: () => request("/weather"),
  markets: () => request("/markets"),
  schemes: () => request("/schemes"),
  crops: () => request("/crops"),
  shops: () => request("/shops"),
};
