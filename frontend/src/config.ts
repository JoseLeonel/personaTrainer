// Si existe la variable de entorno (ej. en Vercel o Render), úsala. 
// Si no, usa dinámicamente la IP/hostname actual para que funcione en WiFi desde el teléfono.
export const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;
