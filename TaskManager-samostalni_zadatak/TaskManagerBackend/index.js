import express from "express";
import cors from "cors";
import exampleRoutes from './routes/example.js';
import { config } from 'dotenv';

config();

const PORT = 8000;

const app = express();
app.use(cors());
app.use(express.json());

// ovdje dodajemo routes
app.use('/api', exampleRoutes);

app.get("/", (req, res) => {
  res.send("TaskManagerBackend");
});

app.listen(PORT, () => {
  console.log(`Poslužitelj sluša na portu ${PORT}`);
});
