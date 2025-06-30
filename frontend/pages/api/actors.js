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
    // Query for actors and directors separately, then combine
    const actorsResult = await session.run(`
      MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
      WITH a, collect(DISTINCT m) AS movies
      RETURN a, movies, 'Actor' AS type
      ORDER BY size(movies) DESC
      LIMIT 50
    `);
    
    const directorsResult = await session.run(`
      MATCH (d:Director)-[:DIRECTED]->(m:Movie)
      WITH d, collect(DISTINCT m) AS movies
      RETURN d, movies, 'Director' AS type
      ORDER BY size(movies) DESC
      LIMIT 50
    `);
    
    // Process actors
    const actors = actorsResult.records.map(r => {
      const person = convertNeo4jIntegers(r.get('a').properties);
      const movies = r.get('movies');
      const type = r.get('type');
      
      const movieList = movies.map(movie => ({
        id: convertNeo4jIntegers(movie.properties).id,
        title: movie.properties.title,
        release_date: movie.properties.release_date,
        vote_average: convertNeo4jIntegers(movie.properties).vote_average,
        poster_path: movie.properties.poster_path
      }));
      
      return {
        ...person,
        movies: movieList,
        type: type,
        movie_count: movies.length,
        // Add computed properties for better display
        displayName: person.name,
        displayAge: person.birthday ? calculateAge(person.birthday) : 'Unknown',
        displayPopularity: person.popularity ? person.popularity.toFixed(1) : 'N/A'
      };
    });
    
    // Process directors
    const directors = directorsResult.records.map(r => {
      const person = convertNeo4jIntegers(r.get('d').properties);
      const movies = r.get('movies');
      const type = r.get('type');
      
      const movieList = movies.map(movie => ({
        id: convertNeo4jIntegers(movie.properties).id,
        title: movie.properties.title,
        release_date: movie.properties.release_date,
        vote_average: convertNeo4jIntegers(movie.properties).vote_average,
        poster_path: movie.properties.poster_path
      }));
      
      return {
        ...person,
        movies: movieList,
        type: type,
        movie_count: movies.length,
        // Add computed properties for better display
        displayName: person.name,
        displayAge: person.birthday ? calculateAge(person.birthday) : 'Unknown',
        displayPopularity: person.popularity ? person.popularity.toFixed(1) : 'N/A'
      };
    });
    
    // Combine and sort by movie count
    const allPeople = [...actors, ...directors].sort((a, b) => b.movie_count - a.movie_count);
    
    res.status(200).json(allPeople);
  } catch (e) {
    console.error('Actors API error:', e);
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
    await driver.close();
  }
}

function calculateAge(birthDate) {
  if (!birthDate) return 'Unknown';
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
} 