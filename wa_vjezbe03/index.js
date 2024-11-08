import express from 'express';
import nekretnine_router from './routes/nekretnine.js';
import ponude_router from './routes/ponude.js';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/nekretnine', nekretnine_router);
app.use('/ponude', ponude_router);


app.listen(PORT, (error) => {
    if(error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
})

