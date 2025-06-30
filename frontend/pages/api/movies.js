import neo4j from 'neo4j-driver';

const NEO4J_URI = 'neo4j://127.0.0.1:7687';
const NEO4J_USER = 'neo4j';
const NEO4J_PASS = 'Abcd@1234';

// Helper function to convert Neo4j integers to regular JavaScript numbers
function neo4jIntToNumber(val) {
  if (val == null) return null;
  if (typeof val === 'object' && 'low' in val) {
    return val.low; // For most cases, low is sufficient. If you need 64-bit support, use val.toNumber()
  }
  return val;
}

// Helper function to convert all Neo4j integers in an object
function convertNeo4jIntegers(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && 'low' in value) {
      converted[key] = neo4jIntToNumber(value);
    } else {
      converted[key] = value;
    }
  }
  return converted;
}

export default async function handler(req, res) {
  const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASS));
  const session = driver.session();
  
  try {
    const result = await session.run(`
      MATCH (m:Movie)
      OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)
      OPTIONAL MATCH (m)-[:DIRECTED_BY]->(d:Person)
      OPTIONAL MATCH (m)-[:STARRING]->(a:Person)
      WITH m, 
           collect(DISTINCT g.name) AS genres,
           collect(DISTINCT d.name) AS directors,
           collect(DISTINCT a.name) AS actors
      RETURN m, genres, directors, actors
      ORDER BY m.vote_average DESC
      LIMIT 100
    `);
    
    const movies = result.records.map(r => {
      const movie = convertNeo4jIntegers(r.get('m').properties);
      const genres = r.get('genres');
      const directors = r.get('directors');
      const actors = r.get('actors');
      
      return {
        ...movie,
        genres: genres,
        directors: directors,
        actors: actors,
        // Add computed properties for better display
        displayTitle: movie.title,
        displayYear: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
        displayRating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
        displayBudget: movie.budget ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(movie.budget) : 'Unknown',
        displayRevenue: movie.revenue ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(movie.revenue) : 'Unknown'
      };
    });
    
    res.status(200).json(movies);
  } catch (e) {
    console.error('Movies API error:', e);
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
    await driver.close();
  }
} 