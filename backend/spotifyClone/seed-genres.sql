-- Delete existing genres first (optional, comment out if you want to keep existing ones)
-- DELETE FROM Genres;

-- Insert popular genres
INSERT INTO Genres (Id, Name, NormalizedName, CreatedDate)
VALUES 
    ('pop-001', 'Pop', 'POP', datetime('now')),
    ('rock-001', 'Rock', 'ROCK', datetime('now')),
    ('electronic-001', 'Electronic', 'ELECTRONIC', datetime('now')),
    ('hip-hop-001', 'Hip Hop', 'HIP HOP', datetime('now')),
    ('jazz-001', 'Jazz', 'JAZZ', datetime('now')),
    ('classical-001', 'Classical', 'CLASSICAL', datetime('now')),
    ('country-001', 'Country', 'COUNTRY', datetime('now')),
    ('r-and-b-001', 'R&B', 'R&B', datetime('now')),
    ('indie-001', 'Indie', 'INDIE', datetime('now')),
    ('metal-001', 'Metal', 'METAL', datetime('now')),
    ('j-core-001', 'J-Core', 'J-CORE', datetime('now')),
    ('hi-tech-001', 'Hi-Tech', 'HI-TECH', datetime('now')),
    ('dubstep-001', 'Dubstep', 'DUBSTEP', datetime('now')),
    ('house-001', 'House', 'HOUSE', datetime('now')),
    ('techno-001', 'Techno', 'TECHNO', datetime('now')),
    ('trance-001', 'Trance', 'TRANCE', datetime('now')),
    ('drum-and-bass-001', 'Drum and Bass', 'DRUM AND BASS', datetime('now')),
    ('psytrance-001', 'Psytrance', 'PSYTRANCE', datetime('now'))
ON CONFLICT(Id) DO NOTHING;
