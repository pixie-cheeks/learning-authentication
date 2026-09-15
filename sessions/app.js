import { configDotenv } from 'dotenv';
import path from 'node:path';
import { Pool } from 'pg';
import express from 'express';
import session from 'express-session';
import connectPG from 'connect-pg-simple';

configDotenv({ path: path.resolve(import.meta.dirname, '../.env') });
const PGStore = connectPG(session);

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new PGStore({
  pool,
  createTableIfMissing: true,
  tableName: 'sessions',
});

app.use(
  session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day or 24 hours
    },
  }),
);

app.get('/', (_req, res) => {
  res.send(/* HTML */ `<h1>HELLOO</h1>`);
});

app.listen(3000);
