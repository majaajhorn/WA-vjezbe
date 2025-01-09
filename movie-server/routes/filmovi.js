// routes/filmovi.js

import express from 'express';
import { body, validationResult, param, query } from 'express-validator';
import { filmovi, pronadiFilm, filmPostoji } from '../middleware/filmovi.js';


const router = express.Router();


// 1. GET /movies - vraća listu filmova u JSON formatu
/* GET /movies - dodajte 2 query parametra min_year i max_year te validirajte jesu li oba tipa integer.
Ako su poslani, provjerite jesu li min_year i max_year u ispravnom rasponu (npr. min_year <
max_year ). Ako je poslan samo jedan parametar, provjerite je li tipa integer. */ 
router.get('/', 
    [
        query('min_year').optional().isInt().withMessage('Min year mora biti cijeli broj').toInt().escape(),
        query('max_year').optional().isInt().withMessage('Max year mora biti cijeli broj').toInt().escape()
    ],
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    async (req, res) => {
        let filtriraniFilmovi = filmovi;
        const { min_year, max_year } = req.query;

        if (min_year && max_year && parseInt(min_year) >= parseInt(max_year)) {
            return res.status(400).json({ message: 'Min year mora biti manji od max year' });
        }

        if (min_year) {
            filtriraniFilmovi = filtriraniFilmovi.filter((film) => film.year >= parseInt(min_year));
        }

        if (max_year) {
            filtriraniFilmovi = filtriraniFilmovi.filter((film) => film.year <= parseInt(max_year));
        }

        if (filtriraniFilmovi.length > 0) {
            return res.status(200).json(filtriraniFilmovi);
        } else {
            return res.status(404).json({ message: 'Nema filmova u zadanom rasponu godina' });
        }
    /*if (filmovi) {
        return res.status(200).json(filmovi);
    }
    return res.status(404).json({ message: 'Nema filmova '});*/
})

// 2. GET /movies/:id - vraća podatke o filmu s određenim id -om
// GET /movies/:id - validirajte je li id tipa integer
router.get('/:id', 
    [
        param('id').isInt().withMessage('ID mora biti cijeli broj').toInt().escape(),
        pronadiFilm
    ], 
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    async (req, res) => {
        res.status(200).json(req.film);
});

// 3. POST /movies - dodaje novi film u listu filmova (in-memory)
// POST /movies - validirajte jesu li poslani title , year , genre i director
router.post('/', 
    [
        body('title').notEmpty().withMessage('Naslov je obavezan').escape(),
        body('year').isInt().withMessage('Godina je obavezna').toInt(),
        body('genre').notEmpty().withMessage('Žanr je obavezan').escape(),
        body('director').notEmpty().withMessage('Direktor je obavezan').escape(),
        filmPostoji,
    ], 
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    async (req, res) => {
        const { id, title, year, genre, director } = req.body;

    /*if (!id || !title || !year || !genre || !director) {
        return res.status(400).json({ message: 'Sva polja moraju biti ispunjena' });
    }*/

        const novi_film = { id, title, year, genre, director };
        filmovi.push(novi_film);

        return res.status(200).json({ message: 'Film uspješno dodan!', film: novi_film });
    }
);


// 4. PATCH /movies/:id - ažurira podatke o filmu s određenim id -om
// PATCH /movies/:id - validirajte jesu li poslani title , year , genre ili director
router.patch('/:id', 
    [
        pronadiFilm,
        body('title').optional().notEmpty().withMessage('Naslov ne smije biti prazan').escape(),
        body('year').optional().isInt().withMessage('Godina ne smije biti prazna').toInt(),
        body('genre').optional().notEmpty().withMessage('Žanr ne smije biti prazan').escape(),
        body('director').optional().notEmpty().withMessage('Direktor ne smije biti prazan').escape()
    ], 
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    async (req, res) => {
        const { title, year, genre, director } = req.body;
        const film = req.film;

        if (!film) {
            return res.status(404).json({ message: 'Film nije pronađen' });
        }

        if (title) film.title = title;
        if (year) film.year = year;
        if (genre) film.genre = genre;
        if (director) film.director = director;

        return res.status(200).json({ message: 'Film uspješno ažuriran', film });
    }
);

export default router;
