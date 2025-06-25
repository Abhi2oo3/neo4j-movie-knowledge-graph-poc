import csv
from neo4j import GraphDatabase
import ast

NEO4J_URI = "neo4j://127.0.0.1:7687"
NEO4J_USER = "neo4j"
NEO4J_PASS = "Abcd@1234"  # Change as needed

MOVIES_CSV = "../data/tmdb_5000_movies.csv"
CREDITS_CSV = "../data/tmdb_5000_credits.csv"

def load_movie_and_properties(tx, movie):
    # Parse genres, keywords, and all relevant properties
    genres = []
    keywords = []
    try:
        genres = [g['name'] for g in ast.literal_eval(movie.get('genres', '[]'))]
    except Exception:
        pass
    try:
        keywords = [k['name'] for k in ast.literal_eval(movie.get('keywords', '[]'))]
    except Exception:
        pass
    tx.run(
        """
        MERGE (m:Movie {id: $id})
        SET m.title = $title,
            m.release_date = $release_date,
            m.popularity = toFloat($popularity),
            m.revenue = toInteger($revenue),
            m.vote_count = toInteger($vote_count),
            m.budget = toInteger($budget),
            m.keywords = $keywords
        """,
        id=movie['id'],
        title=movie['title'],
        release_date=movie['release_date'],
        popularity=movie.get('popularity', 0),
        revenue=movie.get('revenue', 0),
        vote_count=movie.get('vote_count', 0),
        budget=movie.get('budget', 0),
        keywords=keywords
    )
    # Genres relationships
    for genre in genres:
        tx.run(
            """
            MERGE (g:Genre {name: $name})
            WITH g
            MATCH (m:Movie {id: $movie_id})
            MERGE (m)-[:HAS_GENRE]->(g)
            """,
            name=genre, movie_id=movie['id']
        )

def load_actors_and_directors(tx, movie_id, cast, crew):
    # Add actors (top 5)
    for actor in cast[:5]:
        tx.run(
            """
            MERGE (a:Actor {name: $name})
            WITH a
            MATCH (m:Movie {id: $movie_id})
            MERGE (a)-[:ACTED_IN]->(m)
            """,
            name=actor['name'], movie_id=movie_id
        )
    # Add directors
    for member in crew:
        if member.get('job') == 'Director':
            tx.run(
                """
                MERGE (d:Director {name: $name})
                WITH d
                MATCH (m:Movie {id: $movie_id})
                MERGE (d)-[:DIRECTED]->(m)
                """,
                name=member['name'], movie_id=movie_id
            )

def main():
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))
    # Load movies
    with open(MOVIES_CSV, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        movies = list(reader)
    # Load credits (actors, directors)
    with open(CREDITS_CSV, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        credits = {row['movie_id']: row for row in reader}
    with driver.session() as session:
        for movie in movies:
            session.write_transaction(load_movie_and_properties, movie)
            credit = credits.get(movie['id'])
            if credit:
                try:
                    cast = ast.literal_eval(credit['cast'])
                except Exception:
                    cast = []
                try:
                    crew = ast.literal_eval(credit['crew'])
                except Exception:
                    crew = []
                session.write_transaction(load_actors_and_directors, movie['id'], cast, crew)
    driver.close()

if __name__ == "__main__":
    main() 