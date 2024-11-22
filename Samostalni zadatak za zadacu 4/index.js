import e from 'express';
import express from 'express';
import fs from 'fs/promises';

const app = express();
app.use(express.json());
const PORT = 3001;

async function citajDatoteku() {
    try {
        const data = await fs.readFile('zaposlenici.json', 'utf8');
        return data;
    } catch (error) {
        console.error('Greška pri čitanju datoteke:', error);
        return null;
    }
}

async function dodajZaposlenika(noviZaposlenik) {
    try {
        let data = await citajDatoteku();
        if (!data) {
            throw new Error('Ne mogu pronaći datoteku.');
        }

        const zaposlenici = JSON.parse(data);
        const zaposlenik_postoji = zaposlenici.some(z => z.id === noviZaposlenik.id);

        if (zaposlenik_postoji) {
            throw new Error('Zaposlenik s tim ID-om već postoji.');
        }

        zaposlenici.push(noviZaposlenik);
        await fs.writeFile('zaposlenici.json', JSON.stringify(zaposlenici));
    } catch (error) {
        console.error('Greška pri dodavanju zaposlenika:', error);
        throw error;
    }
}

app.get('/zaposlenici', async (req, res) => {
    let pozicija = req.query.pozicija;
    let sortiraj_po_godinama = req.query.godine_staza; // sortiraj po godinama staža uzlazno/silazno
    let godine_staza_min = parseInt(req.query.godine_staza_min); // filter po min broju godina staža
    let godine_staza_max = parseInt(req.query.godine_staza_max); // filter po max broju godina staža

    try {
        const data = await citajDatoteku();
        let zaposlenici = JSON.parse(data);

        if (!data) {
            return res.status(400).json('Ne mogu pronaći datoteku.');
        }

        // jesu li ID i godine_staza brojevi, te ime i prezime stringovi
        let zaposlenici_validirani = zaposlenici.filter(zaposlenik => {
            return (
                typeof zaposlenik.id === 'number' &&
                typeof zaposlenik.godine_staza === 'number' &&
                typeof zaposlenik.ime === 'string' &&
                typeof zaposlenik.prezime === 'string' &&
                typeof zaposlenik.pozicija === 'string'
            );
        });

        // filtriranje po poziciji
        if (pozicija) {
            zaposlenici_validirani = zaposlenici_validirani.filter(zaposlenik => zaposlenik.pozicija === pozicija);
        } 

        // filtriranje po minimalnom broju godina staza
        if (!isNaN(godine_staza_min)) {
            zaposlenici_validirani = zaposlenici_validirani.filter(zaposlenik => zaposlenik.godine_staza >= godine_staza_min);
        }

        // filtriranje po maksimalnom broju godina staza
        if (!isNaN(godine_staza_max)) {
            zaposlenici_validirani = zaposlenici_validirani.filter(zaposlenik => zaposlenik.godine_staza <= godine_staza_max);
        }

        // sortiranje po godinama staža
        if (sortiraj_po_godinama === 'asc') {
            zaposlenici_validirani.sort((a, b) => a.godine_staza - b.godine_staza);
        } else if (sortiraj_po_godinama === 'desc') {
            zaposlenici_validirani.sort((a, b) => b.godine_staza - a.godine_staza);
        }

        return res.status(200).json(zaposlenici_validirani);

    } catch (error) {
        console.error('Greška pri filtriranju zaposlenika:', error);
        res.status(500).send('Greška pri filtriranju zaposlenika.');    
    }
})

app.get('/zaposlenici/:id', async (req, res) => {
    try {
        const data = await citajDatoteku();
        const zaposlenici = JSON.parse(data);
        const id = parseInt(req.params.id);
        const zaposlenik = zaposlenici.find(z => z.id === id);
        
        if (isNaN(id)) {
            return res.status(400).send('ID mora biti broj.');
        }

        if (!data) {
            return res.status(400).json('Ne mogu pronaći datoteku.')
        }

        if (!zaposlenik) {
            return res.status(404).send('Zaposlenik s tim ID-om ne postoji.');
        }

        if (typeof zaposlenik.id !== 'number' || typeof zaposlenik.godine_staza !== 'number' || typeof zaposlenik.ime !== 'string' || typeof zaposlenik.prezime !== 'string' || typeof zaposlenik.pozicija !== 'string') {
            return res.status(400).json({ error: 'Podaci zaposlenika nisu ispravni.' });
        }

        res.status(200).json(zaposlenik);
    } catch (error) {
        console.error('Greška pri čitanju datoteke:', error);
        res.status(500).send('Greška pri čitanju datoteke.');
    }
})

app.post('/zaposlenici', async (req, res) => {
    const body = req.body;

    try {
        let data = await citajDatoteku();

        if (!data) {
            return res.status(400).send('Ne mogu pronaći datoteku.');
        }

        const zaposlenici = JSON.parse(data);
        const kljucevi = Object.keys(zaposlenici[0]);

        for (let kljuc of kljucevi) {
            if (!body[kljuc]) {
              return res.status(400).send(`Greška! Nedostaje atribut ${kljuc}!`);
            }
        }

        if (typeof body.id !== 'number' || 
            typeof body.godine_staza !== 'number' || 
            typeof body.ime !== 'string' || 
            typeof body.prezime !== 'string' || 
            typeof body.pozicija !== 'string') {
            return res.status(400).send('Greška! Podaci zaposlenika nisu ispravni.');
        }

        if (zaposlenici.some(z => z.id === body.id)) {
            return res.status(400).send('Greška! Zaposlenik s tim ID-om već postoji.');
        }

        await dodajZaposlenika(body);
        res.status(200).send('Zaposlenik uspješno dodan');


    } catch (error) {
        console.error('Greška pri dodavanju zaposlenika:', error);
        res.status(500).send('Greška pri dodavanju zaposlenika.');
    }
})

app.listen(PORT, (error) => {
    if(error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
})