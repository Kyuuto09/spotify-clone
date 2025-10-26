# Use the official .NET SDK image for building
# Updated: 2025-10-25
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj files and restore dependencies
COPY spotifyClone/*.csproj ./spotifyClone/
COPY spotifyClone.DAL/*.csproj ./spotifyClone.DAL/
COPY spotifyClone.BLL/*.csproj ./spotifyClone.BLL/

WORKDIR /app/spotifyClone
RUN dotnet restore

# Copy everything else and build
WORKDIR /app
COPY . .
WORKDIR /app/spotifyClone
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/spotifyClone/out .

# Create wwwroot directories if they don't exist
RUN mkdir -p wwwroot/songs wwwroot/artists

ENTRYPOINT ["dotnet", "spotifyClone.dll"]
