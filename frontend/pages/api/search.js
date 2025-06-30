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
  const { q, filter = 'all' } = req.query;
  if (!q) return res.status(200).json([]);
  
  const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASS));
  const session = driver.session();
  
  try {
    let query;
    let params = { q: q.toLowerCase() };

    if (filter === 'Movie') {
      query = `
        MATCH (m:Movie)
        WHERE toLower(m.title) CONTAINS $q 
           OR toLower(m.overview) CONTAINS $q
           OR toLower(m.original_title) CONTAINS $q
        RETURN m, 'Movie' AS label
        ORDER BY m.vote_average DESC
        LIMIT 20
      `;
    } else if (filter === 'Person') {
      query = `
        MATCH (p:Person)
        WHERE toLower(p.name) CONTAINS $q 
           OR toLower(p.biography) CONTAINS $q
        RETURN p, 'Person' AS label
        LIMIT 20
      `;
    } else if (filter === 'Genre') {
      query = `
        MATCH (g:Genre)
        WHERE toLower(g.name) CONTAINS $q
        RETURN g, 'Genre' AS label
        LIMIT 20
      `;
    } else {
      // Search all types
      query = `
        MATCH (n)
        WHERE (n:Movie AND (toLower(n.title) CONTAINS $q OR toLower(n.overview) CONTAINS $q))
           OR (n:Person AND toLower(n.name) CONTAINS $q)
           OR (n:Genre AND toLower(n.name) CONTAINS $q)
        RETURN n, labels(n)[0] AS label
        ORDER BY 
          CASE WHEN n:Movie THEN n.vote_average ELSE 0 END DESC,
          CASE WHEN n:Person THEN 1 ELSE 2 END
        LIMIT 20
      `;
    }

    const result = await session.run(query, params);
    const data = result.records.map(r => {
      const node = convertNeo4jIntegers(r.get('n').properties);
      const label = r.get('label');
      
      // Add computed properties for better display
      const item = { ...node, label };
      
      if (label === 'Movie') {
        item.displayTitle = node.title;
        item.displaySubtitle = node.release_date ? `Released: ${node.release_date}` : 'Release date unknown';
        item.displayDescription = node.overview || 'No description available';
      } else if (label === 'Person') {
        item.displayTitle = node.name;
        item.displaySubtitle = node.birthday ? `Born: ${node.birthday}` : 'Birthday unknown';
        item.displayDescription = node.biography || 'No biography available';
      } else {
        item.displayTitle = node.name;
        item.displaySubtitle = label;
        item.displayDescription = 'Click to view details';
      }
      
      return item;
    });
    
    res.status(200).json(data);
  } catch (e) {
    console.error('Search error:', e);
    res.status(500).json({ error: e.message });
  } finally {
    await session.close();
    await driver.close();
  }
}
