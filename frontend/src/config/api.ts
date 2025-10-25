// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const apiConfig = {
  baseURL: API_URL,
  
  // API Endpoints
  endpoints: {
    // Auth
    login: `${API_URL}/api/auth/login`,
    register: `${API_URL}/api/auth/register`,
    me: `${API_URL}/api/auth/me`,
    confirmEmail: `${API_URL}/api/auth/confirm-email`,
    
    // Tracks
    tracks: `${API_URL}/api/track`,
    track: (id: string) => `${API_URL}/api/track/${id}`,
    
    // Genres
    genres: `${API_URL}/api/genre`,
    genre: (id: string) => `${API_URL}/api/genre/${id}`,
    
    // Artists
    artists: `${API_URL}/api/artist`,
    artist: (id: string) => `${API_URL}/api/artist/${id}`,
  },
  
  // Helper to get full URL for media files
  getMediaURL: (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  },
};
