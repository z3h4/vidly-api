const express = require('express');
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, genreId, numberInStock, dailyRentalRate } = req.body;

  const genre = await Genre.findById(genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const movie = new Movie({
    title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock,
    dailyRentalRate
  });

  await movie.save();
  res.send(movie);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, genreId, numberInStock, dailyRentalRate } = req.body;

  const genre = await Genre.findById(genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  let movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock,
      dailyRentalRate
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

router.delete('/id', [auth, admin, validateObjectId], async (req, res) => {
  const movie = Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');

  res.send(movie);
});

module.exports = router;
