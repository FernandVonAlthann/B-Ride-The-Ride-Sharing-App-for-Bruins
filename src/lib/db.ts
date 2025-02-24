// /src/lib/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://postgres:bride@128.97.220.169:5432/mydatabase",
});

export default pool;
