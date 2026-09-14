import 'dotenv/config';
import { join } from 'node:path';
import { Pool } from 'pg';
import express, { urlencoded } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

const app = express();
app.set('views', join(import.meta.dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(urlencoded({ extended: false }));

app.post('/sign-up', async (req, res) => {
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
    req.body.username,
    req.body.password,
  ]);
  res.redirect('/');
});

app.get('/sign-up', (_req, res) => res.render('sign-up-form'));
app.get('/', (_req, res) => res.render('index'));

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log('app listening on port 3000!');
});
