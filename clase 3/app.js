import express, { json } from 'express';
import movies from './movies.json' assert { type: 'json' };
import crypto from 'crypto'; //Se utiliza para generar ID aleatorias
import { z } from 'zod';
const app = express();

app.use(express.json());
app.disable('x-powered-by'); // desabilita el header X-Powered-By: Express

app.get('/movies', (req, res) => {
  const { genre } = req.query;

  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }

  res.json(movies);
});

//Filtrar por ID

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;

  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).json({ message: 'movie not found' });
});

//Crear película

app.post('/movies', (req, res) => {
  const { title, year, director, duration, poster, genre, rate } = req.body;

  const newMovie = {
    id: crypto.randomUUID(),
    title,
    year,
    director,
    duration,
    poster,
    rate: rate ?? 0,
    genre,
  };

  //Esto no sería REST, porque estamos guardando el estado de la aplicación en memoria.

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
