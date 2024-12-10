import express from "express";
const router = express.Router();

import { aggiornaDisponibilitaAutista } from './../scripts/interazione_contratto.js'


// Endpoint per registrare un autista
router.post('/autistaAggiornaDisponibilita', async (req, res) => {

  const { autistaAddress, disponibilita} = req.body;

  // Salvo l'autista sulla blockchain
  const { success, message} = await aggiornaDisponibilitaAutista(autistaAddress, disponibilita);
    
    if(success === true)
      res.json({ success: success });
    else 
      res.json({ success: success, message: message  });
 

});


export default router;
