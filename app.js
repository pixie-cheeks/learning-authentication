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

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

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
