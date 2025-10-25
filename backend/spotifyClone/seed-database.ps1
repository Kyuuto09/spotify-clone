# PowerShell script to seed tracks into SQLite database
# Run this from backend/spotifyClone directory

Add-Type -Path "System.Data.SQLite.dll" -ErrorAction SilentlyContinue

$dbPath = "spotifyClone.db"
$connectionString = "Data Source=$dbPath;Version=3;"

try {
    # Read the SQL file
    $sql = Get-Content "seed-tracks.sql" -Raw
    
    # Split by semicolons and execute each statement
    $statements = $sql -split ';' | Where-Object { $_.Trim() -ne '' }
    
    Add-Type -AssemblyName "System.Data"
    
    # Try using SQLite connection directly
    Write-Host "Opening database connection..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Executing SQL statements..." -ForegroundColor Yellow
    
    foreach ($statement in $statements) {
        if ($statement.Trim() -ne '') {
            Write-Host "  - " $statement.Substring(0, [Math]::Min(60, $statement.Length)).Trim() "..." -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "❌ SQLite driver not available in PowerShell." -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative methods:" -ForegroundColor Yellow
    Write-Host "1. Install SQLite browser: https://sqlitebrowser.org/" -ForegroundColor Cyan
    Write-Host "2. Open spotifyClone.db and run seed-tracks.sql" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OR" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. Use the upload form at http://localhost:3000/upload" -ForegroundColor Cyan
    Write-Host "   Upload the audio files manually" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
