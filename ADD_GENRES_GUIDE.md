# Add Genres to Database

## Quick Method - Use DB Browser for SQLite

1. **Download DB Browser for SQLite** (if you haven't already):
   - Go to: https://sqlitebrowser.org/dl/
   - Download and install

2. **Open the database**:
   - Open DB Browser for SQLite
   - Click "Open Database"
   - Navigate to: `backend\spotifyClone\spotifyClone.db`

3. **Run the SQL script**:
   - Click the "Execute SQL" tab
   - Open the file `backend\spotifyClone\seed-genres.sql`
   - Copy all the content
   - Paste into the SQL editor
   - Click the "Execute" button (▶️ play icon)

4. **Verify the genres**:
   - Click "Browse Data" tab
   - Select "Genres" table from dropdown
   - You should see all genres including:
     - Pop, Rock, Electronic, Hip Hop, Jazz, Classical, Country, R&B
     - Indie, Metal, J-Core, Hi-Tech, Dubstep, House, Techno
     - Trance, Drum and Bass, Psytrance

5. **Save changes**:
   - Click "Write Changes" button (or press Ctrl+S)
   - Close DB Browser

## What Genres Were Added

### Popular Genres:
- Pop
- Rock
- Electronic
- Hip Hop
- Jazz
- Classical
- Country
- R&B
- Indie
- Metal

### Electronic Subgenres:
- **J-Core** (Japanese hardcore electronic music)
- **Hi-Tech** (High-tech psytrance/hardcore)
- Dubstep
- House
- Techno
- Trance
- Drum and Bass
- Psytrance

## After Adding Genres

1. The genres will appear in the Upload form dropdown
2. You can now upload tracks and assign them to these genres
3. Tracks will display genre badges on the All Tracks page

## Note

The SQL script uses `ON CONFLICT(Id) DO NOTHING` so you can run it multiple times without creating duplicates.
