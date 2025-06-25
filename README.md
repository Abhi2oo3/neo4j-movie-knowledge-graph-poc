# Neo4j Movie Knowledge Graph POC

## Overview
This project demonstrates how to build a knowledge graph using Neo4j from a movie dataset (TMDB 5000), and visualize it in a Next.js frontend.

## Architecture
- **Data Source:** TMDB 5000 Movie Dataset (Kaggle)
- **ETL:** Python script to load data into Neo4j
- **Database:** Neo4j (local Docker or Desktop)
- **API & Frontend:** Next.js app with graph visualization

## Setup Steps
1. Download the TMDB 5000 Movie Dataset from Kaggle and place it in the `data/` folder.
2. Run the ETL script in `etl/` to populate Neo4j.
3. Start Neo4j locally (Docker or Desktop).
4. Start the Next.js frontend in `frontend/` to visualize the graph.

## Folders
- `data/` - Raw dataset files
- `etl/` - Python ETL script
- `frontend/` - Next.js app

## Requirements
- Python 3.x
- Node.js (v18+ recommended)
- Neo4j (Docker or Desktop)

## Usage
See detailed instructions in each folder. 