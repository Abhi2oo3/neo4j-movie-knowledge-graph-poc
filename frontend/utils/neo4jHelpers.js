// Helper function to convert Neo4j integers to regular JavaScript numbers
export function neo4jIntToNumber(val) {
  if (val == null) return null;
  if (typeof val === 'object' && 'low' in val) {
    return val.low; // For most cases, low is sufficient. If you need 64-bit support, use val.toNumber()
  }
  return val;
}

// Helper function to convert all Neo4j integers in an object
export function convertNeo4jIntegers(obj) {
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

// Helper function to safely convert Neo4j count results
export function safeNeo4jCount(result) {
  if (!result || !result.records || result.records.length === 0) return 0;
  return neo4jIntToNumber(result.records[0].get('count')) || 0;
} 