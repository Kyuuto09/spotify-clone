# Use the official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj files and restore dependencies
COPY *.csproj ./
COPY ../spotifyClone.DAL/*.csproj ../spotifyClone.DAL/
COPY ../spotifyClone.BLL/*.csproj ../spotifyClone.BLL/

RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Create wwwroot directories if they don't exist
RUN mkdir -p wwwroot/songs wwwroot/artists

# Expose port (Railway will set PORT env variable)
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-5001}
EXPOSE ${PORT:-5001}

ENTRYPOINT ["dotnet", "spotifyClone.dll"]
