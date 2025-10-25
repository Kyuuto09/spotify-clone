# Adding Music Tracks - Instructions

## 📁 File Upload Setup Complete!

The backend now supports actual file uploads for audio and images.

### ✅ What's Been Done:

1. **Backend API Endpoint**: `POST /api/track/upload`
   - Accepts multipart/form-data
   - Saves audio files to `wwwroot/songs/`
   - Saves cover images to `wwwroot/images/`
   - Supports: MP3, WAV, FLAC (audio) and JPG, PNG, WebP (images)

2. **Frontend Upload Form**:
   - File upload for audio (required)
   - File upload for cover image (optional)
   - Genre dropdown (fetched from backend)
   - Title, description, release date fields

### 🎵 To Add the Two Tracks:

#### Step 1: Download the Audio Files
You mentioned you'll download these two songs:

1. **かたぎり (Katagiri)** - "true DJ MAG top ranker's song 前編 (かたぎり Remix)"
   - Place in: `backend/spotifyClone/wwwroot/songs/`
   - Rename to: `katagiri-true-dj-mag.mp3`

2. **Psyqui** - "What Is Vibe"
   - Place in: `backend/spotifyClone/wwwroot/songs/`
   - Rename to: `psyqui-what-is-vibe.mp3`

#### Step 2: Add to Database
Run this SQL script on the SQLite database (`spotifyClone.db`):

```bash
cd backend/spotifyClone
sqlite3 spotifyClone.db < seed-tracks.sql
```

Or open the database with a SQLite browser and run `seed-tracks.sql`

### 🖼️ Cover Images:
The SQL script already includes the cover URLs:
- Katagiri: `https://i1.sndcdn.com/artworks-000615898804-6nbf7w-t500x500.jpg`
- Psyqui: `https://i1.sndcdn.com/artworks-xJxqLrnzIJQh-0-t500x500.jpg`

### 🎸 Genres Added:
- **J-Core**: Japanese hardcore electronic music
- **Hi-Tech**: High-tech psytrance and hardcore

### 🚀 Usage:

**Option 1: Use the Upload Form**
1. Start backend: `cd backend/spotifyClone && dotnet run`
2. Start frontend: `cd frontend && npm run dev`
3. Go to http://localhost:3000/upload
4. Upload the audio files with the form

**Option 2: Manual Database Insert**
1. Place MP3 files in `backend/spotifyClone/wwwroot/songs/` with correct names
2. Run the SQL script to add tracks to database
3. Tracks will appear on the tracks page

### 📂 File Structure:
```
backend/spotifyClone/
├── wwwroot/
│   ├── songs/          # Audio files here
│   │   ├── katagiri-true-dj-mag.mp3
│   │   └── psyqui-what-is-vibe.mp3
│   └── images/         # Cover images (optional - using URLs for now)
├── spotifyClone.db     # SQLite database
└── seed-tracks.sql     # SQL script to add tracks
```

### 🔗 API Endpoints:
- `GET /api/track` - Get all tracks
- `GET /api/genre` - Get all genres
- `POST /api/track/upload` - Upload new track with files
- `POST /api/track` - Create track with URLs (old method)

