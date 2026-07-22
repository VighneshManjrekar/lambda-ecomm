# Lambda E-commerce

A hybrid analytics e-commerce platform with Cassandra, MongoDB, and Elasticsearch backends.

## Prerequisites

- Python 3.12
- Conda
- Docker & Docker Compose

## Setup & Running the Server

### 1. Create & Activate Environment
```bash
conda create -n hybrid-analytics python=3.12 -y
conda activate hybrid-analytics
```

### 2. Install Dependencies
```bash
cd server
pip install -r requirements.txt
```

### 3. Start Services
```bash
# From project root, start all services (Cassandra, MongoDB, Elasticsearch)
docker-compose up -d
```
> After compose up, wait for few minutes (2-3 minutes depending on the system, on macbook air m4 it takes 1-2 minutes) to let all db initialize and setup for the first time

### 4. Run Server
Rename `/server/.env.example` to `/server/.env`
```bash
# From server directory
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Project Structure

- **server/** - FastAPI backend with database clients
- **client/** - Frontend HTML/CSS/JavaScript
- **analytics_dashboard.ipynb** - Jupyter notebook for analytics

## Note

Seed data using Seed Products and Seed Events button to run `analytics_dashboard.ipynb` correctly