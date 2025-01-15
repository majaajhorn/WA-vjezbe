// routes/auth.js
import express from 'express';
import { connectToDatabase } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// registracija
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Korisničko ime i lozinka su potrebni' });
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // provjera postoji li korisnik
        const korisnikPostoji = await usersCollection.findOne({ username });
        if (korisnikPostoji) {
            return res.status(400).json({ error: 'Korisnik već postoji' });
        }

        // hashiramo password
        const hashedPassword = await bcrypt.hash(password, 10);

        // stvaranje novog korisnika
        const newUser = {
            username,
            password: hashedPassword,
            tasks: []
        };

        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'Korisnik je uspješno registriran' });
    } catch (error) {
        res.status(500).json({ error: 'Greška prilikom registracije korisnika' });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Korisnik nije pronađen' });
        }

        // provjera lozinki
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Greška prilikom prijave!' });
        }

        // stvaranje jwt tokena
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Greška prilikom prijave' });
    }
});

export default router;