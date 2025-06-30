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
    // Get recommendations based on high-rated movies with good vote counts
    const result = await session.run(`
      MATCH (m:Movie)
      WHERE m.vote_average >= 7.0 AND m.vote_count >= 1000
      OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)
      WITH m, collect(DISTINCT g.name) AS genres
      RETURN m, genres
      ORDER BY m.vote_average DESC, m.vote_count DESC
      LIMIT 20
    `);
    
    const recommendations = result.records.map(r => {
      const movie = convertNeo4jIntegers(r.get('m').properties);
      const genres = r.get('genres');
      
      return {
        ...movie,
        genres: genres,
        // Add computed properties for better display
        displayTitle: movie.title,
        displayYear: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
        displayRating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
        recommendationScore: calculateRecommendationScore(movie)
      };
    });
    
    // Sort by recommendation score
    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    res.status(200).json(recommendations);
  } catch (e) {
    console.error('Recommendations API error:', e);
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
    await driver.close();
  }
}

function calculateRecommendationScore(movie) {
  // Simple recommendation scoring algorithm
  const rating = movie.vote_average || 0;
  const voteCount = movie.vote_count || 0;
  const popularity = movie.popularity || 0;
  
  // Weighted score: 40% rating, 30% vote count (normalized), 30% popularity
  const normalizedVoteCount = Math.min(voteCount / 10000, 1); // Normalize to 0-1
  const normalizedPopularity = Math.min(popularity / 100, 1); // Normalize to 0-1
  
  return (rating * 0.4) + (normalizedVoteCount * 0.3) + (normalizedPopularity * 0.3);
} 