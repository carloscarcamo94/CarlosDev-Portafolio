// ==========================================
// Archivo: js/api.js 
// Capa de Servicios: Peticiones HTTP
// ==========================================

const API_BASE_URL = "https://api-contactform.onrender.com/api";

async function getLibrosData() {
    const response = await fetch(`${API_BASE_URL}/libros/actuales`);
    if (response.status === 204) return null; // No hay contenido
    if (!response.ok) throw new Error("No se pudo conectar con el servidor de libros");
    
    return await response.json(); // Retorna la Promesa con los datos
}

async function getViajesData() {
    const response = await fetch(`${API_BASE_URL}/viajes/destinos`);
    if (response.status === 204) return null; // No hay contenido
    if (!response.ok) throw new Error("No se pudo conectar con el servidor de viajes");
    
    return await response.json(); // Retorna la Promesa con los datos
}

async function getSpotifyActualData() {
    const response = await fetch(`${API_BASE_URL}/spotify/actual`);
    if (response.status === 204) return null; // No hay contenido
    if (!response.ok) throw new Error("No se pudo conectar con el servidor de Spotify");
    
    return await response.json(); // Retorna la Promesa con los datos
}

async function getSpotifyTopTracksData() {
    const response = await fetch(`${API_BASE_URL}/spotify/top-tracks`);
    if (response.status === 204) return null; // No hay contenido
    if (!response.ok) throw new Error("No se pudo conectar con el servidor de Spotify para solicitar el Top Tracks");
    
    return await response.json(); // Retorna la Promesa con los datos
}

async function getSteamCurrentStatus() {
    const response = await fetch(`${API_BASE_URL}/steam/current`);
    if (response.status === 204) return null; // No hay contenido
    if (!response.ok) throw new Error("No se pudo conectar con el servidor de Steam para solicitar el estado actual");
    
    return await response.json(); // Retorna la Promesa con los datos
}

async function getSteamTopPlayed() {
    const response = await fetch(`${API_BASE_URL}/steam/top-played`);
    if (response.status === 204) return null; // No hay contenido
    if (!response.ok) throw new Error("No se pudo conectar con el servidor de Steam para solicitar el Top de Juegos");
    
    return await response.json(); // Retorna la Promesa con los datos
}

async function getSteamAchievements() {
    const response = await fetch(`${API_BASE_URL}/steam/achievements`);
    if (response.status === 204) return null; // No hay contenido
    if (!response.ok) throw new Error("No se pudo conectar con el servidor de Steam para solicitar los logros");
    
    return await response.json(); // Retorna la Promesa con los datos
}