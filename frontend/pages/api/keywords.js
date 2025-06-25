import neo4j from 'neo4j-driver';

const NEO4J_URI = 'neo4j://127.0.0.1:7687';
const NEO4J_USER = 'neo4j';
const NEO4J_PASS = 'Abcd@1234';

export default async function handler(req, res) {
  const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASS));
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (m:Movie)
      UNWIND m.keywords AS keyword
      RETURN keyword AS keyword, count(*) AS count
      ORDER BY count DESC
      LIMIT 30
    `);
    const data = result.records.map(r => ({
      keyword: r.get('keyword'),
      count: r.get('count').toInt()
    }));
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
    await driver.close();
  }
} 