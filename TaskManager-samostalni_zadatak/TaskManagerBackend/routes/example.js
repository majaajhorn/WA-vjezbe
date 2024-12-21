import express from "express";
import { connectToDatabase } from "../db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET
router.get("/tasks", async (req, res) => {
    try {
        const db = await connectToDatabase();
        const tasksCollection = db.collection('tasks');
        const tasks = await tasksCollection.find().toArray(); // dohvati sve taskove
        res.status(200).json(tasks);
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
            return res.status(400).json({ error: 'Nedostaju sva polja.'});
        }

        const newTask = {
            naslov,
            opis,
            zavrsen: false, // default stanje za novi task
            tags: tags || [], // default prazno polje ako nema tagova
        };

        const db = await connectToDatabase();
        const tasksCollection = db.collection('tasks');

        const result = await tasksCollection.insertOne(newTask);
        res.status(201).json({
            message: 'Uspješno dodan task',
            task: {
              _id: result.insertedId,
              naslov,
              opis,
              zavrsen: false,
              tags: tags || [],
            },
          });
    } catch (error) {
        console.error('Greška prilikom dodavanja taska:', error);
        res.status(500).json({ error: 'Greška prilikom dodavanja taska'});
    }
});

// PUT
router.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await connectToDatabase();
        const tasksCollection = db.collection('tasks');

        const result = await tasksCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { zavrsen: true } }
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
        const tasksCollection = db.collection('tasks');

        const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });

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
