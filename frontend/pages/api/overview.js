import neo4j from 'neo4j-driver';
const NEO4J_URI = 'neo4j://127.0.0.1:7687';
const NEO4J_USER = 'neo4j';
const NEO4J_PASS = 'Abcd@1234';

export default async function handler(req, res) {
  const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASS));
  const session = driver.session();
  try {
    const movies = (await session.run('MATCH (m:Movie) RETURN count(m) AS count')).records[0].get('count').toInt();
    const actors = (await session.run('MATCH (a:Actor) RETURN count(a) AS count')).records[0].get('count').toInt();
    const genres = (await session.run('MATCH (g:Genre) RETURN count(g) AS count')).records[0].get('count').toInt();
    res.status(200).json({ movies, actors, genres });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
    await driver.close();
  }
} 