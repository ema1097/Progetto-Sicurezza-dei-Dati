import express from "express";
const router = express.Router();

import { getAllAutisti, getAllTratte, getAutistaDisponibile, mostraTuttiIViaggi, mostraViaggiAutista } from './../scripts/interazione_contratto.js'


// Endpoint per ottenre tutti gli autista
router.post('/allAutisti', async (req, res) => {
  // Salvo l'autista sulla blockchain
  const { success, message} = await getAllAutisti();    
    if(success === true)
      res.json({ success: success, message: message });
    else 
      res.json({ success: success, message: message  });
});

// Endpoint per ottenre tutti gli autista
router.post('/getAllAutistiDisponibile', async (req, res) => {
    // Salvo l'autista sulla blockchain
    const { success, message} = await getAutistaDisponibile();    
      if(success === true)
        res.json({ success: success, message: message });
      else 
        res.json({ success: success, message: message  });
  });

// Endpoint per ottenre tutti gli autista
router.post('/allTratte', async (req, res) => {
    // Salvo l'autista sulla blockchain
    const { success, message} = await getAllTratte();    
      if(success === true)
        res.json({ success: success, message: message });
      else 
        res.json({ success: success, message: message  });
  });

router.post('/mostraTuttiIviaggi', async (req, res) => {
    // Salvo l'autista sulla blockchain
    const { success, message} = await mostraTuttiIViaggi();    
      if(success === true)
        res.json({ success: success, message: message });
      else 
        res.json({ success: success, message: message  });
  });

  router.post('/mostraTuttiIviaggiAutista', async (req, res) => {

    const {autistaAddress} = req.body;

    // Salvo l'autista sulla blockchain
    const { success, message} = await mostraViaggiAutista(autistaAddress);  
      if(success === true)
        res.json({ success: success, message: message });
      else 
        res.json({ success: success, message: message  });
  });


export default router;
