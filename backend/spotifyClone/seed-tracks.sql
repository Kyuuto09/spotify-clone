-- Add J-Core / Hi-Tech genre if not exists
INSERT OR IGNORE INTO Genres (Id, Name, Description, CreatedDate) 
VALUES ('j-core-001', 'J-Core', 'Japanese hardcore electronic music', datetime('now'));

-- Add Hi-Tech genre
INSERT OR IGNORE INTO Genres (Id, Name, Description, CreatedDate) 
VALUES ('hi-tech-001', 'Hi-Tech', 'High-tech psytrance and hardcore', datetime('now'));

-- Add artists
INSERT OR IGNORE INTO Artists (Id, Name, Bio, CreatedDate) 
VALUES ('katagiri-001', 'かたぎり (Katagiri)', 'Japanese electronic music producer', datetime('now'));

INSERT OR IGNORE INTO Artists (Id, Name, Bio, CreatedDate) 
VALUES ('psyqui-001', 'Psyqui', 'Japanese electronic music producer', datetime('now'));

-- Add Track 1: かたぎり - true DJ MAG top ranker's song 前編 (かたぎり Remix)
INSERT INTO Tracks (Id, Title, Description, AudioUrl, PosterUrl, ReleaseDate, CreatedDate, GenreId) 
VALUES (
    'track-katagiri-001', 
    'true DJ MAG top ranker''s song 前編 (かたぎり Remix)',
    'かたぎり (Katagiri) Remix',
    '/songs/katagiri-true-dj-mag.mp3',
    'https://i1.sndcdn.com/artworks-000615898804-6nbf7w-t500x500.jpg',
    datetime('now'),
    datetime('now'),
    'j-core-001'
);

-- Link artist to track 1
INSERT INTO TrackArtists (TrackId, ArtistId)
VALUES ('track-katagiri-001', 'katagiri-001');

-- Add Track 2: Psyqui - What Is Vibe
INSERT INTO Tracks (Id, Title, Description, AudioUrl, PosterUrl, ReleaseDate, CreatedDate, GenreId) 
VALUES (
    'track-psyqui-001', 
    'What Is Vibe',
    'Psyqui - Hi-Tech Electronic',
    '/songs/psyqui-what-is-vibe.mp3',
    'https://i1.sndcdn.com/artworks-xJxqLrnzIJQh-0-t500x500.jpg',
    datetime('now'),
    datetime('now'),
    'hi-tech-001'
);

-- Link artist to track 2
INSERT INTO TrackArtists (TrackId, ArtistId)
VALUES ('track-psyqui-001', 'psyqui-001');
