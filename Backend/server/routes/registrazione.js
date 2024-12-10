import express from "express";
const router = express.Router();

import { registraAutista, aggiungiNuovaTratta, creaViaggio } from './../scripts/interazione_contratto.js'


// Endpoint per registrare un autista
router.post('/registraAutista', async (req, res) => {

  const { autistaAddress, email, nome, cognome, admin} = req.body;

  // Salvo l'autista sulla blockchain
  const { success, message} = await registraAutista(autistaAddress, email, nome, cognome, admin);
    
    if(success === true)
      res.json({ success: success });
    else 
      res.json({ success: success, message: message  });
 

});

// Endpoint per salvare una tratta
router.post('/registraTratta', async (req, res) => {

  const { partenza, arrivo, data, pagamento, admin} = req.body;

  // Salvo l'autista sulla blockchain
  const { success, message} = await aggiungiNuovaTratta(partenza, arrivo, data, pagamento, admin);
    
    if(success === true)
      res.json({ success: success });
    else 
      res.json({ success: success, message: message  });
 

});

// Endpoint per salvare un viaggio
router.post('/registraViaggio', async (req, res) => {

  const { autistaAddress, trattaId, admin} = req.body;

  // Salvo l'autista sulla blockchain
  const { success, message} = await creaViaggio(autistaAddress, trattaId, admin);
    
    if(success === true)
      res.json({ success: success });
    else 
      res.json({ success: success, message: message  });
 

});

export default router;
