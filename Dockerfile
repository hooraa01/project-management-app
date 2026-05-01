# --- Stage 1: Build Frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build Backend ---
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies for PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source code
COPY backend/ ./backend/

# Copy the built React files from Stage 1 into the backend's static folder
# This matches the static_folder='../frontend/build' config in your app.py
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Expose the port Railway uses
EXPOSE 5000

# Start the application using Gunicorn
WORKDIR /app/backend
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]