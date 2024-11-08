import express from 'express';
const router = express.Router();

// podaci o nekretninama
const podaci = [
    { 
        id: 1, 
        naziv: "Mirna",
        opis: "Kuća na dva kata, blizina mora",
        cijena: 600000,
        lokacija: "Pula",
        broj_soba: 3,
        povrsina: 150,  
    },
    {
        id: 2, 
        naziv: "Perla",
        opis: "Apartman u sklopu turističkog kompleksa",
        cijena: 420000,
        lokacija: "Premantura",
        broj_soba: 2,
        povrsina: 75,  
    }
]

// ruta za dohvaćanje svih nekretnina
router.get("/", (req, res) => {
    //res.send("Ovo su sve nekretnine");
    res.status(200).json(podaci);
})

// ruta za dohvaćanje nekretnine po ID-u
router.get("/:id", (req, res) => {
    const nekretnina_id = req.params.id;

    // provjera da li je korisnik unio id
    if (isNaN(nekretnina_id)) {
        return res.status(400).json({ message: 'Proslijedili ste parametar id koji nije broj!' });
    }

    const nekretnina = podaci.find(n => n.id == nekretnina_id);

    if (nekretnina) {
        res.status(200).json(nekretnina);
    } else {
        res.status(400).json({ message: 'Nekretnina s traženim ID-em ne postoji.' });
    }
})

// ruta za dodavanje nove nekretnine
router.post("/dodaj", (req, res) => {
    const nova_nekretnina = req.body;
    const kljucevi = Object.keys(nova_nekretnina);

    // Provjera da li su svi potrebni podaci poslani
    if (!(kljucevi.includes('id') && kljucevi.includes('naziv') && kljucevi.includes('opis') && kljucevi.includes('cijena') && kljucevi.includes('lokacija') && kljucevi.includes('broj_soba') && kljucevi.includes('povrsina'))) {
        return res.status(400).json({ message: 'Niste poslali sve potrebne podatke za unos nove nekretnine' });
    }

    // Provjera da cijena i broj soba nisu negativni
    if (nova_nekretnina.cijena < 0 || nova_nekretnina.broj_soba < 0) {
        return res.status(400).json({ message: 'Cijena nekretnine i broj soba ne može biti negativan. Unesite ispravno podatke.' });
    }

    // U polje podataka spremamo novu nekretninu
    podaci.push(nova_nekretnina);

    res.status(201).send(`Uspješno ste dodali novu nekretninu s nazivom ${nova_nekretnina.naziv}.`);
});

// ruta za ažuriranje nekretnine potpuno
router.put('/:id', (req, res) => {
    const nekretnina_id = req.params.id;
    const nova_nekretnina = req.body;
    const kljucevi = Object.keys(nova_nekretnina);

    if (isNaN(nekretnina_id)) {
        return res.status(400).json({ message: 'Proslijedili ste parametar id koji nije broj!' });
    }

    if (kljucevi.cijena || kljucevi.broj_soba < 0) {
        return res.status(401).json({ message: 'Cijena nekretnine i broj soba ne može biti negativan. Unesite ispravno podake.'});
    }

    const index = podaci.findIndex(nekretnina => nekretnina.id == nekretnina_id);

    if (index === -1) {
        return res.status(404).json({ message: 'Nekretnina s traženim ID-em ne postoji.' });
    }

    podaci[index] = nova_nekretnina;

    return res.status(200).json({ message: 'Ažurirano!', azurirani_podatak: nova_nekretnina });

});

// ruta za ažuriranje nekretnine djelomično
router.patch("/:id", (req, res) => {
    const nekretnina_id = req.params.id;

    if (isNaN(nekretnina_id)) {
        return res.status(400).json({ message: 'Proslijedili ste parametar id koji nije broj!' });
    }

    const index = podaci.findIndex(nekretnina => nekretnina.id == nekretnina_id);

    if (index === -1) {
        return res.status(404).json({ message: 'Nekretnina s traženim ID-em ne postoji.' });
    }

    const nekretnina = podaci[index];
    const azurirana_nekretnina = { ...nekretnina, ...req.body };

    podaci[index] = azurirana_nekretnina;
    res.status(200).json({ message: 'Nekretnina djelomično ažurirana!', azurirani_podatak: azurirana_nekretnina });
});

// ruta za brisanje nekretnine
router.delete('/:id', (req, res) => {
    const nekretnina_id = req.params.id;

    // provjera da li je korisnik unio id
    if (isNaN(nekretnina_id)) {
        return res.status(400).json({ message: 'Proslijedili ste parametar id koji nije broj!' });
    }

    const index = podaci.findIndex(nekretnina => nekretnina.id == nekretnina_id);

    if (index !== -1) {
        podaci.splice(index, 1);
        res.status(200).json( { message: 'Nekretnina uspješno obrisana.'});
    } else {
        res.status(400).json( { message: 'Nekretnina s traženim ID-em ne postoji.'});
    }
});

export default router;