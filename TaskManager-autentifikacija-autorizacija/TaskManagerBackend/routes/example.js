import express from "express";
import { connectToDatabase } from "../db.js";
import { ObjectId } from "mongodb";
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// GET
router.get("/tasks", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(req.userId) }); // dohvati sve taskove
        res.status(200).json(user.tasks);
    } catch (error) {
        console.error('Greška prilikom dohvaćanja taskova:', error);
        res.status(500).json({ error: 'Greška prilikom dohvaćanja taskova.'});
    }
});

// POST
router.post('/tasks', async (req, res) => {
    try {
        const { naslov, opis, tags } = req.body;

        if (!naslov || !opis) {
            return res.status(400).json({ error: 'Nedostaju sva polja.' });
        }

        const newTask = {
            id: new ObjectId().toString(),
            naslov,
            opis,
            zavrsen: false,
            tags: tags || [],
        };

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(req.userId) },
            { $push: { tasks: newTask } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Korisnik nije pronađen' });
        }

        res.status(201).json(newTask);
    } catch (error) {
        console.error('Greška prilikom dodavanja taska:', error);
        res.status(500).json({ error: 'Greška prilikom dodavanja taska' });
    }
});

// PUT
router.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        const result = await usersCollection.updateOne(
            { 
                _id: new ObjectId(req.userId),
                'tasks.id': id
            },
            { $set: { 'tasks.$.zavrsen': true } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Task nije pronađen' });
        }

        res.status(200).json({ message: 'Task je ispunjen' });
    } catch (error) {
        console.error('Greška prilikom označavanja taska:', error);
        res.status(500).json({ error: 'Greška prilikom označavanja taska'});
    }
});

// DELETE
router.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db  = await connectToDatabase();
        const usersCollection = db.collection('users');

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(req.userId) },
            { $pull: { tasks: { id: id } } }
        );

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Task nije pronađen'});
        }

        res.status(200).json({ message: 'Task je uspješno obrisan '});
    } catch (error) {
        console.error('Greška prilikom brisanja taska:', error);
        res.status(500).json({ error: 'Greška prilikom brisanja taska '});
    }
});

export default router;
