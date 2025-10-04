# 🎵 Spotify Clone - Full Stack Application

A full-stack music streaming application built with **React** (Frontend) and **ASP.NET Core** (Backend) with **SQLite** database.

## 📁 Project Structure

```
spotifyClone-fullstack/
├── backend/                    # ASP.NET Core API
│   ├── spotifyClone/          # Main API project
│   ├── spotifyClone.BLL/      # Business Logic Layer
│   ├── spotifyClone.DAL/      # Data Access Layer
│   └── spotifyClone.sln       # Solution file
└── frontend/                   # React application
    ├── public/
    ├── src/
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Backend Setup (ASP.NET Core API)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Restore dependencies:**
   ```bash
   dotnet restore
   ```

3. **Run the API:**
   ```bash
   dotnet run --project spotifyClone
   ```

4. **API will be available at:**
   - HTTP: `http://localhost:5001`
   - Swagger Documentation: `http://localhost:5001/swagger`

### Frontend Setup (React)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Frontend will be available at:**
   - `http://localhost:3000`

## 🎯 Features

### Backend API Features
- ✅ **Genre Management** - CRUD operations for music genres
- ✅ **Artist Management** - Full artist management with tracks relationship
- ✅ **Track Management** - Track creation with artist and genre associations
- ✅ **Repository Pattern** - Clean architecture with generic repositories
- ✅ **SQLite Database** - Lightweight database with Entity Framework Core
- ✅ **Swagger Documentation** - Interactive API documentation
- ✅ **Error Handling** - Comprehensive error handling and validation

### Frontend Features
- ✅ **React Dashboard** - Modern React application with hooks
- ✅ **API Integration** - Connects to backend API endpoints
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Real-time Stats** - Shows counts of genres, artists, and tracks
- ✅ **Loading States** - User-friendly loading and error states
- ✅ **Spotify-inspired UI** - Green color scheme matching Spotify branding

## 🛠 API Endpoints

### Genres
- `GET /api/Genre` - Get all genres
- `POST /api/Genre` - Create new genre
- `GET /api/Genre/{id}` - Get genre by ID
- `PUT /api/Genre/{id}` - Update genre
- `DELETE /api/Genre/{id}` - Delete genre

### Artists
- `GET /api/Artist` - Get all artists
- `POST /api/Artist` - Create new artist
- `GET /api/Artist/{id}` - Get artist by ID
- `GET /api/Artist/{artistId}/tracks` - Get artist's tracks
- `GET /api/Artist/by-name/{name}` - Search artists by name

### Tracks
- `GET /api/Track` - Get all tracks
- `POST /api/Track` - Create new track
- `GET /api/Track/by-title/{title}` - Search tracks by title
- `GET /api/Track/by-artist/{artistId}` - Get tracks by artist
- `GET /api/Track/by-genre/{genreId}` - Get tracks by genre
- `POST /api/Track/{trackId}/add-artist/{artistId}` - Add artist to track

## 🗄 Database

The application uses **SQLite** database with the following entities:
- **Genres** - Music genres (Rock, Pop, Jazz, etc.)
- **Artists** - Music artists with details
- **Tracks** - Individual songs/tracks
- **Artist-Track Relationships** - Many-to-many relationship

## 🔧 Development

### Backend Development
```bash
cd backend
dotnet watch run --project spotifyClone
```

### Frontend Development
```bash
cd frontend
npm start
```

### Database Migrations
```bash
cd backend
dotnet ef migrations add MigrationName --project spotifyClone.DAL --startup-project spotifyClone
dotnet ef database update --project spotifyClone.DAL --startup-project spotifyClone
```

## 📚 Technology Stack

### Backend
- **ASP.NET Core 8** - Web API framework
- **Entity Framework Core** - ORM for database operations
- **SQLite** - Lightweight database
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Modern Hooks** - useState, useEffect for state management
- **CSS3** - Custom styling with gradients and animations
- **Fetch API** - HTTP client for API communication

## 🎨 UI/UX Features
- **Spotify-inspired Design** - Green and black color scheme
- **Glassmorphism Effects** - Modern glass-like UI elements
- **Responsive Layout** - Works on desktop and mobile
- **Loading Animations** - Smooth loading spinners
- **Interactive Elements** - Hover effects and transitions

## 🚀 Deployment

### Backend Deployment
1. Build the application: `dotnet build --configuration Release`
2. Publish: `dotnet publish --configuration Release`
3. Deploy to your preferred hosting service

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your preferred hosting service

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements.

---

**Happy Coding! 🎵**