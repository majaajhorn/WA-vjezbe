import express from 'express';
import { connectToDatabase } from './db.js';
import { ObjectId } from 'mongodb';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

let db = await connectToDatabase();

app.get('/', (req, res) => {
    res.send('Pizza app');
});

app.get('/users', async (req, res) => {
    let users_collection = db.collection('users');
    let allUsers = await users_collection.find().toArray();
    res.status(200).json(allUsers);
  });


app.get('/pizze', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let allPizze = await pizze_collection.find().toArray();
    res.status(200).json(allPizze);
})


app.get('/pizze/:naziv', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let naziv_param = req.params.naziv;
    let pizza = await pizze_collection.findOne({ naziv: naziv_param });

    res.status(200).json(pizza);
})

//////  1. zadatak (dodavanje pizze)  //////////
app.post('/pizze', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let novaPizza = req.body;

    const obavezniKljucevi = ['naziv', 'cijena', 'sastojci', 'slika'];

    if (!obavezniKljucevi.every(kljuc => kljuc in novaPizza)) {
        return res.status(400).json({ error: 'Nedostaju obavezni ključevi.' });
    }

    if (typeof novaPizza.cijena !== 'number' || novaPizza.cijena <= 0) {
        return res.status(400).json({ error: 'Cijena mora biti veća od 0.' });
    }

    if (!Array.isArray(novaPizza.sastojci) || !novaPizza.sastojci.every(item => typeof item === 'string')) {
        return res.status(400).json({ error: 'Sastojci moraju biti polje stringova.'});
    }

    try {
        let result = await pizze_collection.insertOne(novaPizza);
        res.status(201).json(result.insertedId); // 201 jer smo kreirali novi resurs, vraćamo klijentu ID novododanog dokumenta
    } catch (error) {
        console.error('Greška prilikom dodavanja pizze:', error);
        res.status(400).json({ error: 'Greška prilikom dodavanja pizze.' });
    }
});

//////  2. zadatak (pravljenje narudžbe) ///////////
app.post('/narudzba', async (req, res) => {
    let narudzbe_collection = db.collection('pizza_narudzbe');
    let novaNarudzba = req.body;
    let pizza_collection = db.collection('pizze');
    let dostupne_pizze = await pizza_collection.find().toArray();

    let obavezniKljucevi = ['ime', 'adresa', 'telefon', 'pizza_stavke'];

    // kljucevi koje cemo provjeravati za svaku pizzu (stavku narudzba)
    let obavezniKljuceviStavke = ['naziv', 'količina', 'veličina'];

    // pretvaramo objekt novaNaruzba u Array kljuceva, pa provjeravamo sa Array.includes()
    if (!obavezniKljucevi.every(kljuc => kljuc in novaNarudzba)) {
        return res.status(400).json({ error: 'Nedostaju obavezni ključevi.'});
    }

    // za svaku stavku narudzbe provjeravamo obavezne kljuceve na isti nacin
    if (!novaNarudzba.pizza_stavke.every(stavka => obavezniKljuceviStavke.every(kljuc => kljuc in stavka))) {
        return res.status(400).json({ error: 'Nedostaju obavezni kljucevi u stavci narudzbe'});
    }

    // provjeravamo da li je korisnik unio broj (treba biti string brojeva) 
    if (!novaNarudzba.telefon || novaNarudzba.telefon.trim() === '' || isNaN(novaNarudzba.telefon)) {
        return res.status(400).json({ error: 'Broj telefona mora biti samo broj.' });
    }

    // dodajemo dodatne provjere za svaku stavku narudzbe
    // negacija uvjeta: buduci da 'every' vraca true ako je za svaki element polja uvjet ispunjen
    // provjeravamo 3 uvjeta: količina je int i veća od 0, veličina je jedna od triju veličina
    if (!novaNarudzba.pizza_stavke.every(stavka => {
        return Number.isInteger(stavka.količina) && stavka.količina > 0 && ['mala', 'srednja', 'velika'].includes(stavka.veličina);
    })) {
        return res.status(400).json({ error: 'Neispravni podaci u stavci naružbe' });
    }

    // provjera postoji li pizza u bazi 
    if (!novaNarudzba.pizza_stavke.every(stavka => dostupne_pizze.some(pizza => pizza.naziv === stavka.naziv))) {
        return res.status(400).json({ error: 'Odabrali ste pizzu koju nemamo u ponudi.'});
    }

    
    let ukupnaCijena = 0;
    
    for (const stavka of novaNarudzba.pizza_stavke) {
        let pizza = dostupne_pizze.find(pizza => pizza.naziv === stavka.naziv);
        
        if (!pizza || typeof pizza.cijena !== 'number') {
            return res.status(400).json({ error: `Pizza '${stavka.naziv} nije pronađena ili cijena nije ispravna.` });
        }

        let cijenaPizza = pizza.cijena;
        let umnozak = 1;

        if (stavka.velicina === 'srednja') {
            umnozak = 1.5;
        } else if (stavka.velicina === 'velika') {
            umnozak = 2;
        }

        ukupnaCijena += cijenaPizza * stavka.količina * umnozak;
    }

    novaNarudzba.ukupnaCijena = ukupnaCijena;

    try {
        let result = await narudzbe_collection.insertOne(novaNarudzba);
        res.status(201).json({ insertedId: result.insertedId });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
    }
});

app.patch('/pizze/:naziv', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let naziv_param = req.params.naziv;
    let novaCijena = req.body.cijena;

    try {
        let result = await pizze_collection.updateOne({ naziv: naziv_param }, { $set: { cijena: novaCijena }});

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Pizza nije pronađena.'});
        }

        res.status(200).json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse});
    }
});

app.get('/narudzbe', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let narudzbe = await narudzbe_collection.find().toArray();

    if (narudzbe.length === 0) {
        return res.status(404).json({ error: 'Nema narudžbi'});
    }

    res.status(200).json(narudzbe);
});

app.get('/narudzbe/:id', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let id_param = req.params.id;
    let narudzba = await narudzbe_collection.findOne({ _id: new ObjectId(id_param) }); // instanciramo objekt ObjectId

    if(!narudzba) {
        return res.status(404).json({ error: 'Narudžna nije pronađena'});
    }

    res.status(200).json(narudzba);
});

app.patch('/narudzbe/:id', async (req, res) => {
    let narudzbe_collection = db.collection('narudzbe');
    let id_param = req.params.id;
    let noviStatus = req.body.status; // npr.isporučeno, u pripremi, otkazano

    try {
        let result = await narudzbe_collection.updateOne({ _id: new ObjectId(id_param) }, { $set: { status: noviStatus }});

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Narudzba nije pronadena'});
        }

        res.status(200).json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse});
    }
});

app.put('/pizze', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let noviMeni = req.body;

    try {
        await pizze_collection.deleteMany({}); // brišemo sve pizze iz kolekcije
        let result = await pizze_collection.insertMany(noviMeni); // dodajemo novi meni (polje objekata)
        res.status(200).json({ insertedCount: result.insertedCount });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
    }
});

app.delete('/pizze/:naziv', async (req, res) => {
    let pizze_collection = db.collection('pizze');
    let naziv_param = req.params.naziv;

    try {
        let result = await pizze_collection.deleteOne({ naziv: naziv_param }); // brišemo prema nazivu
        res.status(200).json({ deletedCount: result.deletedCount });
    } catch (error) {
        console.log(error.errorResponse);
        res.status(400).json({ error: error.errorResponse });
    }
});

const PORT = 3000;
app.listen(PORT, error => {
    if (error) {
        console.log('Greška prilikom pokretanja servera', error);
    }
    console.log(`Pizza poslužitelj dela na localhost:${PORT}`);
})
