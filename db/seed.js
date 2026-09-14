import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Pool } from 'pg';

const schema = await fs.readFile(
  path.join(import.meta.dirname, './schema.sql'),
  { encoding: 'utf-8' },
);

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

await pool.query(schema);

await pool.end();
