// server/index.js
import express from "express";
import cors from 'cors';
import http from 'http'; 
import { fileURLToPath } from 'url';
import path from 'path';

import registrazione from './routes/registrazione.js';
import servizio from './routes/gestioneServizio.js';
import allInfo from './routes/getInfo.js';

const PORT = process.env.PORT || 3007;
const HOST = '127.0.0.1';
const app = express();

// Ottieni il percorso del file corrente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use('/registrazione', registrazione);
app.use('/servizio', servizio);
app.use('/info', allInfo);

const server = http.createServer(app); // Crea il server HTTP

server.listen(PORT, HOST, function () {
  const address = server.address().address;
  const port = server.address().port;

  console.log("Listening on " + address + ":" + port);
});

export default app; 
