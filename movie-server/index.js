import express from 'express';
import filmoviRouter from './routes/filmovi.js';
import glumciRouter from './routes/glumci.js';


const app = express();
app.use(express.json());

// middleware na razini aplikacije
const requestLogger = (req, res, next) => {
    const date = new Date().toISOString(); 
    const formiran_datum = date.replace('T', ' ').split('.')[0];
    const method = req.method; 
    const url = req.originalUrl; 
    console.log(`[movie-server] [${formiran_datum}] ${method} ${url}`);
    next(); 
};

app.use(requestLogger);
app.use('/movies', filmoviRouter);
app.use('/actors', glumciRouter);

app.get('/', (req, res) => {
    return res.status(200).send('Dobrodošli na movie server!');
})

let PORT = 3000;

app.listen(PORT, error => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Poslužitelj dela na portu ${PORT}`);
    }
})



/*Dodajte novi middleware na razini Express aplikacije koji će logirati svaki dolazni zahtjev na konzolu u
sljedećm formatu: 
[movie-server] [2024-06-01 12:00:00] GET /movies

*/