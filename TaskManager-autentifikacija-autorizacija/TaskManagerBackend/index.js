import express from "express";
import cors from "cors";
import exampleRoutes from './routes/example.js';
import { config } from 'dotenv';
import authRoutes from './routes/auth.js';

config();

const PORT = 8000;

const app = express();
//app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

// ovdje dodajemo routes
app.use('/api', exampleRoutes);

app.get("/", (req, res) => {
  res.send("TaskManagerBackend");
});

app.listen(PORT, () => {
  console.log(`Poslužitelj sluša na portu ${PORT}`);
});
