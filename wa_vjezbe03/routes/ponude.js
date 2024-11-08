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
// id_ponuda, id_nekretnina, ime, prezime, ponudena_cijena, telefon -> spremiti u polje objekata

// PROVJERE:
// 

let sve_ponude = [];

// ruta za slanje nove ponude
router.post('/', (req, res) => {
    const { id_ponuda, id_nekretnina, ime, prezime, ponudena_cijena, telefon } = req.body;

    if (!id_ponuda || !id_nekretnina || !ime || !prezime || !ponudena_cijena || !telefon) {
        return res.status(400).send('Niste poslali sve potrebne podatke o ponudi.');
    }

    // provjere: cijena > 0, id_nekretnine = podaci.id
    // moramo provjeriti da su id-evi od ponude i nekretnine brojevi i da su ponudene cijene takoder brojevi
    if (isNaN(id_ponuda) || isNaN(id_nekretnina) || isNaN(ponudena_cijena) || id_ponuda <= 0 || id_nekretnina <= 0 ||ponudena_cijena < 0) {
        return res.status(400).json( { message: 'Neispravni podaci: ID-evi moraju biti pozitivni brojevi, i ponuđena cijena ne smije biti negativna.'});
    }

    const pronadena_nekretnina = podaci.find(nekretnina => nekretnina.id === id_nekretnina);

    if (!pronadena_nekretnina) {
        return res.status(400).json({message: 'Nekretnina s ovim ID-em ne postoji.'});
    }

    // ovdje ćemo spremiti ponudu
    const detaljna_ponuda = { id_ponuda, id_nekretnina, ime, prezime, ponudena_cijena, telefon };

    // punimo polje objekata
    sve_ponude.push(detaljna_ponuda);

    res.status(200).json( {
        message: `Vaša ponuda s ID-em ${id_ponuda} je uspješno zaprimljena`,
        ponuda: detaljna_ponuda
    });
});

export default router;