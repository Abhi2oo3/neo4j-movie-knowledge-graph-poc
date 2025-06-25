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
      WHERE m.vote_count IS NOT NULL AND m.budget IS NOT NULL
      RETURN m.title AS title, m.vote_count AS vote_count, m.budget AS budget
      ORDER BY m.vote_count DESC
      LIMIT 200
    `);
    const data = result.records.map(r => ({
      title: r.get('title'),
      vote_count: parseInt(r.get('vote_count')),
      budget: parseInt(r.get('budget'))
    }));
    // Create histogram bins for vote_count
    const bins = Array(10).fill(0);
    const maxVote = Math.max(...data.map(d => d.vote_count), 1);
    data.forEach(d => {
      const bin = Math.floor((d.vote_count / maxVote) * 9);
      bins[bin]++;
    });
    const histogram = bins.map((count, i) => ({ vote_bin: `${i * 10}%`, count }));
    // For budget line, just use the data as is
    res.status(200).json(data.map((d, i) => ({ ...d, vote_bin: histogram[i % 10]?.vote_bin || '0%' })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
    await driver.close();
  }
} 