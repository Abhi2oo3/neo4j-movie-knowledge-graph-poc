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

export default async function handler(req, res) {
  const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASS));
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (g:Genre)<-[:HAS_GENRE]-(m:Movie)
      WHERE g.name IS NOT NULL
      RETURN g.name AS genre, count(m) AS count
      ORDER BY count DESC
    `);
    const data = result.records.map(r => ({
      genre: r.get('genre'),
      count: neo4jIntToNumber(r.get('count'))
    }));
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
    await driver.close();
  }
} 