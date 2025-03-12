// /src/lib/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://postgres:bride@128.97.220.169:5432/mydatabase",
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function getClient() {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  
  client.query = (...args) => {
    console.log('QUERY:', args[0]);
    return query.apply(client, args);
  };
  
  client.release = () => {
    console.log('Client released');
    release.apply(client);
  };
  
  return client;
}

export default pool;
