import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch genres
      const genresResponse = await fetch('/api/Genre');
      const genresData = await genresResponse.json();
      setGenres(genresData);

      // Fetch artists
      const artistsResponse = await fetch('/api/Artist');
      const artistsData = await artistsResponse.json();
      setArtists(artistsData);

      // Fetch tracks
      const tracksResponse = await fetch('/api/Track');
      const tracksData = await tracksResponse.json();
      setTracks(tracksData);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data from API');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">
          <h2>Loading Spotify Clone...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <p>Make sure the backend API is running on http://localhost:5001</p>
          <button onClick={fetchData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎵 Spotify Clone</h1>
        <p>Full-stack music streaming application</p>
      </header>

      <main className="App-main">
        <div className="dashboard">
          <div className="stats-card">
            <h2>📊 Statistics</h2>
            <div className="stats">
              <div className="stat">
                <span className="stat-number">{genres.length}</span>
                <span className="stat-label">Genres</span>
              </div>
              <div className="stat">
                <span className="stat-number">{artists.length}</span>
                <span className="stat-label">Artists</span>
              </div>
              <div className="stat">
                <span className="stat-number">{tracks.length}</span>
                <span className="stat-label">Tracks</span>
              </div>
            </div>
          </div>

          <div className="data-section">
            <div className="data-card">
              <h3>🎼 Genres</h3>
              {genres.length > 0 ? (
                <ul>
                  {genres.slice(0, 5).map(genre => (
                    <li key={genre.id}>{genre.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No genres found. Create some using the API!</p>
              )}
            </div>

            <div className="data-card">
              <h3>🎤 Artists</h3>
              {artists.length > 0 ? (
                <ul>
                  {artists.slice(0, 5).map(artist => (
                    <li key={artist.id}>
                      <strong>{artist.name}</strong>
                      {artist.description && <span> - {artist.description}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No artists found. Create some using the API!</p>
              )}
            </div>

            <div className="data-card">
              <h3>🎵 Tracks</h3>
              {tracks.length > 0 ? (
                <ul>
                  {tracks.slice(0, 5).map(track => (
                    <li key={track.id}>
                      <strong>{track.title}</strong>
                      {track.description && <span> - {track.description}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tracks found. Create some using the API!</p>
              )}
            </div>
          </div>

          <div className="api-info">
            <h3>🔗 API Endpoints</h3>
            <p>Backend API is available at: <code>http://localhost:5001</code></p>
            <p>Swagger documentation: <code>http://localhost:5001/swagger</code></p>
            <div className="endpoints">
              <div className="endpoint-group">
                <strong>Genres:</strong> /api/Genre
              </div>
              <div className="endpoint-group">
                <strong>Artists:</strong> /api/Artist
              </div>
              <div className="endpoint-group">
                <strong>Tracks:</strong> /api/Track
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="App-footer">
        <p>Spotify Clone - Full Stack Application (React + ASP.NET Core + SQLite)</p>
        <button onClick={fetchData} className="refresh-btn">
          🔄 Refresh Data
        </button>
      </footer>
    </div>
  );
}

export default App;