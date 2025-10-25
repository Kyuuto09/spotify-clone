# 🎵 Add Tracks to Database - Simple Guide

## ⚡ Quick Method (Recommended):

### Use the Upload Form:
1. Start backend: `cd backend/spotifyClone; dotnet run`
2. Start frontend: `cd frontend; npm run dev`
3. Go to: http://localhost:3000/upload
4. Upload your tracks directly!

---

## 📊 Alternative: Manual Database Insert

Since PowerShell doesn't support SQLite easily, use one of these:

### Option 1: DB Browser for SQLite (Easiest)
1. Download: https://sqlitebrowser.org/dl/
2. Open `backend/spotifyClone/spotifyClone.db`
3. Go to "Execute SQL" tab
4. Paste contents of `seed-tracks.sql`
5. Click "Execute"

### Option 2: VS Code Extension
1. Install extension: "SQLite" by alexcvzz
2. Right-click `spotifyClone.db` → "Open Database"
3. Right-click database → "New Query"
4. Paste `seed-tracks.sql` content
5. Run query

### Option 3: Online SQLite Viewer
1. Go to: https://sqliteviewer.app/
2. Upload `spotifyClone.db`
3. Run the SQL from `seed-tracks.sql`
4. Download the modified database

---

## 📂 Don't Forget:
Place your audio files in:
- `backend/spotifyClone/wwwroot/songs/katagiri-true-dj-mag.mp3`
- `backend/spotifyClone/wwwroot/songs/psyqui-what-is-vibe.mp3`

## ✅ SQL Script Creates:
- ✅ J-Core genre
- ✅ Hi-Tech genre  
- ✅ かたぎり (Katagiri) artist
- ✅ Psyqui artist
- ✅ 2 tracks with cover images

