// routes/glumci.js

import express from 'express';
import { glumci, pronadiGlumca, glumacPostoji } from '../middleware/glumci.js';
import { body, validationResult, param, query } from 'express-validator';

const router = express.Router();

// 5. GET /actors - vraća listu glumaca u JSON formatu
/* GET /actors - dodajte route parametar name te provjerite je li tipa string. Uklonite prazne znakove s
početka i kraja stringa koristeći odgovarajući middleware. */ 
// Osigurajte sve rute od reflektiranog XSS napada koristeći odgovarajući middleware.
router.get('/', 
    [
        query('name').optional().isString().withMessage('Ime mora biti tipa string').trim().escape()
    ],
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    async (req, res) => {
        let filtriraniGlumci = glumci;

        const { name } = req.query;

        if (name) {
            filtriraniGlumci = glumci.filter(glumac => glumac.name.toLowerCase().includes(name.toLowerCase()));
        }

        if (filtriraniGlumci.length > 0) {
            return res.status(200).json(filtriraniGlumci);
        } else {
            return res.status(404).json({ message: 'Nema glumaca koji odgovaraju pretrazi' });
        }

    /*if (glumci) {
        return res.status(200).json(glumci);
    }
    return res.status(404).json({ message: 'Nema glumaca '});*/
})

// 6. GET /actors/:id - vraća podatke o glumcu s određenim id -om
// GET /actors/:id - validirajte je li id tipa integer
router.get('/:id', 
    [
        param('id').isInt().withMessage('ID mora biti cijeli broj').toInt(),
        pronadiGlumca
    ], 
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    async (req, res) => {
        res.status(200).json(req.glumac);
})

// 7. POST /actors - dodaje novog glumca u listu glumaca (in-memory)
// POST /actors - validirajte jesu li poslani name i birthYear
router.post('/', 
    [
        body('name').notEmpty().withMessage('Ime ne smije biti prazno').trim().escape(),
        body('birthYear').isInt().withMessage('Godina mora biti cijeli broj').toInt(),
        glumacPostoji
    ], 
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    async (req, res) => {
        const { id, name, birthYear, movies } = req.body;

    /*if (!id || !name || !birthYear || !movies) {
        return res.status(400).json({ message: 'Sva polja moraju biti ispunjena' });
    } ===> ovo je od prije (7.zadatak) */

        const novi_glumac = { id, name, birthYear, movies };
        glumci.push(novi_glumac);

        return res.status(200).json({ message: 'Glumac uspješno dodan!', glumac: novi_glumac });
});


// 8. PATCH /actors/:id - ažurira podatke o glumcu s određenim id -om
// PATCH /actors/:id - validirajte jesu li poslani name ili birthYear
router.patch('/:id', 
    [
        pronadiGlumca,
        body('name').optional().notEmpty().withMessage('Ime ne smije biti prazno').trim().escape(),
        body('birthYear').optional().isInt().withMessage('Godina rođenja mora biti cijeli broj').toInt()
    ], 
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    async (req, res) => {
        const { id } = req.params;
        const { name, birthYear, movies } = req.body;
    
        const glumac = req.glumac;

        if(!glumac) {
            return res.status(404).json({ message: 'Glumac nije pronađen' });
        }
        
        if (name) glumac.name = name;
        if (birthYear) glumac.birthYear = birthYear;
        if (movies) glumac.movies = movies;
    
        return res.status(200).json({ message: 'Glumac uspješno ažuriran', glumac });
    }
);

export default router;