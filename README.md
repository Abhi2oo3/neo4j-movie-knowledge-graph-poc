# Movie Knowledge Graph Dashboard

A modern, interactive dashboard for exploring movie data using a knowledge graph approach. Built with Neo4j, Next.js, Material UI, and modern charting libraries.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [License](#license)

---

## Overview
This dashboard lets you explore movies, actors, genres, keywords, and their relationships using a graph database. It provides interactive charts, a force-directed graph explorer, and a modern UI inspired by the Vuexy admin template.

---

## Features
- Dashboard with KPIs and charts
- Movies, Actors, Genres, Keywords pages
- Interactive Graph Explorer
- Powerful search and recommendations
- Watchlist and Profile management
- Responsive, professional Material UI design

---

## Demo
To see a demo, run the app locally (see setup below) and visit [http://localhost:3000](http://localhost:3000).

---

## Prerequisites
Before you start, make sure you have:

- **Node.js** (v16 or higher): [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Python 3.x**: [Download Python](https://www.python.org/downloads/)
- **pip** (comes with Python)
- **Neo4j Desktop** (recommended) or Neo4j Community Edition: [Download Neo4j](https://neo4j.com/download/)
- **Git** (optional, for cloning the repo): [Download Git](https://git-scm.com/downloads)

---

## Setup Instructions

### 1. Clone the Repository
If you have Git installed:
```sh
git clone <your-repo-url>
cd <your-repo-folder>
```
Or download the ZIP from GitHub and extract it.

### 2. Set Up Neo4j
- Install and open **Neo4j Desktop** (or run Neo4j Community Edition).
- Create a new project and a new database (e.g., `movie-kg`).
- Set a password (e.g., `Abcd@1234`).
- Start the database and note the **Bolt URL** (usually `bolt://localhost:7687` or `neo4j://localhost:7687`).

### 3. Prepare the ETL (Python)
- Open a terminal and navigate to the `etl` folder:
  ```sh
  cd etl
  ```
- Install Python dependencies:
  ```sh
  pip install -r requirements.txt
  ```
- Make sure you have the TMDB 5000 dataset (CSV files) in the `data/` folder. If not, download from [Kaggle TMDB 5000 Dataset](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata) and place the CSVs in `data/`.

### 4. Run the ETL Script
- In the `etl` folder, run:
  ```sh
  python etl_to_neo4j.py
  ```
- This will load movies, actors, genres, keywords, and relationships into your Neo4j database.
- If you see errors, check your Neo4j connection details in the script and ensure the database is running.

### 5. Set Up the Frontend (Next.js)
- Open a new terminal and navigate to the `frontend` folder:
  ```sh
  cd ../frontend
  ```
- Install Node.js dependencies:
  ```sh
  npm install
  ```

### 6. Configure Neo4j Connection (Optional for Production)
- By default, the API uses hardcoded Neo4j credentials. For production, set environment variables or update the credentials in `frontend/pages/api/*.js`.

### 7. Start the Development Server
- In the `frontend` folder, run:
  ```sh
  npm run dev
  ```
- The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Usage
- **Dashboard:** See KPIs, genre pie, keyword bar, and top movies.
- **Movies/Actors/Genres/Keywords:** Browse and filter entities.
- **Graph Explorer:** Visualize and interact with the movie knowledge graph.
- **Search:** Find movies, actors, genres, and more.
- **Profile:** View and edit your user profile.
- **Watchlist:** Add and manage your favorite movies.

---

## Troubleshooting
- **Neo4j connection errors:**
  - Ensure Neo4j is running and credentials are correct.
  - Check the Bolt URL and password in the API scripts.
- **ETL errors:**
  - Make sure the TMDB CSV files are present in `etl/data/`.
  - Check Python and pip installation.
- **Frontend errors:**
  - Ensure all dependencies are installed (`npm install`).
  - Restart the dev server if you change API code.
- **Port conflicts:**
  - If port 3000 is in use, stop other apps or run `npm run dev -- -p 3001` to use a different port.

---

## Project Structure
```
POC project/
  ├── etl/                # Python ETL script and requirements
  │   └── etl_to_neo4j.py
  ├── data/               # TMDB 5000 dataset CSVs
  ├── frontend/           # Next.js app
  │   ├── components/     # React components
  │   ├── pages/          # Next.js pages and API routes
  │   ├── styles/         # CSS
  │   └── utils/          # Helper functions
  ├── Solution_Architecture.md  # Solution & architecture doc
  └── README.md           # This file
```

---

## License
MIT 