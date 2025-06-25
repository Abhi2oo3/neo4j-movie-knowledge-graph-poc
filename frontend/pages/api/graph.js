import neo4j from 'neo4j-driver';

const NEO4J_URI = 'neo4j://127.0.0.1:7687';
const NEO4J_USER = 'neo4j';
const NEO4J_PASS = 'Abcd@1234';

export default async function handler(req, res) {
  const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASS));
  const session = driver.session();
  try {
    // Parse filters
    const { genres, popMin, popMax, revMin, revMax } = req.query;
    let genreFilter = '';
    if (genres) {
      const genreList = genres.split(',').map(g => `'${g}'`).join(',');
      genreFilter = `AND g.name IN [${genreList}]`;
    }
    const popMinVal = popMin ? parseFloat(popMin) : 0;
    const popMaxVal = popMax ? parseFloat(popMax) : 100;
    const revMinVal = revMin ? parseInt(revMin) : 0;
    const revMaxVal = revMax ? parseInt(revMax) : 1000000000;
    const result = await session.run(`
      MATCH (m:Movie)<-[:ACTED_IN]-(a:Actor), (m)-[:HAS_GENRE]->(g:Genre)
      WHERE m.popularity >= $popMin AND m.popularity <= $popMax
        AND m.revenue >= $revMin AND m.revenue <= $revMax
        ${genreFilter}
      RETURN m, a, g LIMIT 100
    `, {
      popMin: popMinVal,
      popMax: popMaxVal,
      revMin: revMinVal,
      revMax: revMaxVal
    });
    const nodes = {};
    const links = [];
    result.records.forEach(record => {
      const m = record.get('m').properties;
      const a = record.get('a').properties;
      const g = record.get('g').properties;
      nodes[m.id] = { id: m.id, label: 'Movie', title: m.title };
      nodes[a.name] = { id: a.name, label: 'Actor', name: a.name };
      nodes[g.name] = { id: g.name, label: 'Genre', name: g.name };
      links.push({ source: a.name, target: m.id, type: 'ACTED_IN' });
      links.push({ source: m.id, target: g.name, type: 'HAS_GENRE' });
    });
    res.status(200).json({ nodes: Object.values(nodes), links });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
    await driver.close();
  }
} 