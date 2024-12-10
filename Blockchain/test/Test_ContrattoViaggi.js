// Import delle dipendenze necessarie per i test
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const indirizzoAutista1 = "0xBcd4042DE499D14e55001CcbB24a551F3b954096";
const indirizzoAutista2 = "0x71bE63f3384f5fb98995898A86B02Fb2426c5788";


// Descrive il set di test per il contratto "Contratto_Registazione_Autenticazione"
describe("ViaggiAutisti", function () {

  // Funzione asincrona per il deployment del contratto
  async function deployContract() {
      // I contratti vengono deployati utilizzando il primo account di default
      const [owner, otherAccount] = await ethers.getSigners();

      // Ottieni il factory del contratto
      const ViaggiAutisti = await ethers.getContractFactory("ViaggiAutisti");
      // Deploy del contratto
      const VIA = await ViaggiAutisti.deploy();

      return { VIA, owner, otherAccount };
  }

  // Set di test per il deployment del contratto
  describe("Deployment", function () {
      it("Deploy del contratto", async function () {
          // Deploy del contratto tramite la fixture
          const {VIA} = await loadFixture(deployContract);
          // Verifica che l'indirizzo del contratto non sia 0 (quindi è stato deployato correttamente)
          expect(VIA.address).to.not.equal(0);
      });
  });

  describe("Registrazione e gestione autisti", function () {

    it("Registrazione di un nuovo autista", async function () {
        const { VIA, owner, autistaAccount } = await loadFixture(deployContract);

        // Esegui la registrazione di un nuovo autista
        await VIA.registraNuovoAutista(indirizzoAutista1, "test@example.com", "Mario", "Rossi");

        // Controlla che l'autista sia stato registrato correttamente
        const autista = await VIA.autisti(indirizzoAutista1);
        
        expect(autista.id).to.equal(indirizzoAutista1);
        expect(autista.email).to.equal("test@example.com");
        expect(autista.nome).to.equal("Mario");
        expect(autista.cognome).to.equal("Rossi");
        expect(autista.numeroViaggi).to.equal(0);
        expect(autista.disponibile).to.be.false;
    });


    it("Aggiornamento disponibilità di un autista", async function () {
        const { VIA, owner, autistaAccount } = await loadFixture(deployContract);

        // Esegui la registrazione di un nuovo autista
        await VIA.registraNuovoAutista(indirizzoAutista1, "test@example.com", "Mario", "Rossi");

        // Aggiorna la disponibilità dell'autista
        await VIA.aggiornaDisponibilitaAutista(indirizzoAutista1, true);

        // Controlla che la disponibilità sia stata aggiornata
        const autista = await VIA.autisti(indirizzoAutista1);
        expect(autista.disponibile).to.be.true;
    });

    it("Ottieni tutti gli autisti", async function () {
      const { VIA, owner } = await loadFixture(deployContract);
  
      // Registra due autisti
      await VIA.registraNuovoAutista(indirizzoAutista1, "test@example.com", "Mario", "Rossi");
      await VIA.registraNuovoAutista(indirizzoAutista2, "peppino@example.com", "Luigi", "Verdi");
  
      // Recupera tutti gli autisti disponibili
      const autistiDisponibili = await VIA.getAllAutisti();
  

      // Array con i dati attesi
      const autistiAttesi = [
          { id: indirizzoAutista1, email: "test@example.com", nome: "Mario", cognome: "Rossi", disponibile: false },
          { id: indirizzoAutista2, email: "peppino@example.com", nome: "Luigi", cognome: "Verdi", disponibile: false },
      ];

      // Verifica che il numero di autisti sia corretto
      expect(autistiDisponibili.length).to.equal(autistiAttesi.length);

      // Verifica che ciascun autista registrato corrisponda a quelli attesi
      for (let i = 0; i < autistiAttesi.length; i++) {
          const registrato = autistiDisponibili[i];
          const atteso = autistiAttesi[i];

          expect(registrato.id).to.equal(atteso.id);
          expect(registrato.email).to.equal(atteso.email);
          expect(registrato.nome).to.equal(atteso.nome);
          expect(registrato.cognome).to.equal(atteso.cognome);
          expect(registrato.disponibile).to.equal(atteso.disponibile);
      }
    });

    it("Ottieni tutti gli autisti disponibili", async function () {
      const { VIA, owner } = await loadFixture(deployContract);
  
      // Registra due autisti
      await VIA.registraNuovoAutista(indirizzoAutista1, "test@example.com", "Mario", "Rossi");
      await VIA.registraNuovoAutista(indirizzoAutista2, "peppino@example.com", "Luigi", "Verdi");
  
      // Aggiorna la disponibilità di uno degli autisti
      await VIA.aggiornaDisponibilitaAutista(indirizzoAutista1, true);
  
      // Recupera tutti gli autisti disponibili
      const autistiDisponibili = await VIA.getAutistaDisponibile();
  
      // Verifica che ci sia solo un autista disponibile e che sia quello giusto
      expect(autistiDisponibili.length).to.equal(1);
      expect(autistiDisponibili[0].email).to.equal("test@example.com");
      expect(autistiDisponibili[0].nome).to.equal("Mario");
      expect(autistiDisponibili[0].cognome).to.equal("Rossi");
      expect(autistiDisponibili[0].disponibile).to.be.true;
    });

  });

  describe("Gestione tratte e viaggi", function () {

    it("Aggiunta di una nuova tratta", async function () {
        const { VIA, owner } = await loadFixture(deployContract);

        // Aggiungi una nuova tratta
        await VIA.aggiungiNuovaTratta("Milano", "Roma", "2024-09-01", "1000 euro");

        // Controlla che la tratta sia stata aggiunta correttamente
        const tratta = await VIA.tratte(1);
        expect(tratta.partenza).to.equal("Milano");
        expect(tratta.arrivo).to.equal("Roma");
        expect(tratta.data).to.equal("2024-09-01");
        expect(tratta.pagamento).to.equal("1000 euro");
        expect(tratta.assegnata).to.be.false;
    });

    it("Tentativo di aggiungere una tratta da un non-admin", async function () {
        const { VIA, otherAccount } = await loadFixture(deployContract);

        // Tentativo di aggiungere una tratta da un non-admin
        await expect(
          VIA.connect(otherAccount).aggiungiNuovaTratta("Milano", "Roma", "2024-09-01", "1000 euro")
        ).to.be.revertedWith("Solo l'admin puo aggiungere una nuova tratta");
    });

    it("Ottieni tutti le tratte", async function () {
      const { VIA, owner } = await loadFixture(deployContract);

      // Aggiungi una nuova tratta
      await VIA.aggiungiNuovaTratta("Milano", "Roma", "2024-09-01", "1000 euro");
      await VIA.aggiungiNuovaTratta("Roma", "Milano", "2024-09-01", "10000000000 euro");
  
      // Recupera tutte le tratte disponibili
      const tratteDisponibili = await VIA.getAllTratte();

      // Array con i dati attesi
      const tratteAttese = [
          { partenza: "Milano", arrivo: "Roma", data: "2024-09-01", pagamento: "1000 euro", assegnata: false },
          { partenza: "Roma", arrivo: "Milano", data: "2024-09-01", pagamento: "10000000000 euro", assegnata: false },
      ];

      // Verifica che il numero di tratte sia corretto
      expect(tratteDisponibili.length).to.equal(tratteAttese.length);

      // Verifica che ciascuna tratta registrata corrisponda a quelle attese
      for (let i = 0; i < tratteAttese.length; i++) {
          const registrata = tratteDisponibili[i];
          const attesa = tratteAttese[i];

          expect(registrata.partenza).to.equal(attesa.partenza);
          expect(registrata.arrivo).to.equal(attesa.arrivo);
          expect(registrata.data).to.equal(attesa.data);
          expect(registrata.pagamento).to.equal(attesa.pagamento);
          expect(registrata.assegnata).to.equal(attesa.assegnata);
      }
    });

    it("Creazione di un viaggio con autista disponibile", async function () {
        const { VIA, owner, autistaAccount } = await loadFixture(deployContract);

        // Registra un autista e aggiungi una tratta
        await VIA.registraNuovoAutista(indirizzoAutista1, "test@example.com", "Mario", "Rossi");
        await VIA.aggiungiNuovaTratta("Milano", "Roma", "2024-09-01", "1000 euro");

        await VIA.aggiornaDisponibilitaAutista(indirizzoAutista1, true);

        // Crea un viaggio con l'autista disponibile
        await VIA.creaViaggio(indirizzoAutista1, 1);

        // Controlla che il viaggio sia stato creato correttamente
        const viaggi = await VIA.mostraTuttiIViaggi();
        expect(viaggi.length).to.equal(1);
        expect(viaggi[0].aut.email).to.equal("test@example.com");
        expect(viaggi[0].t.partenza).to.equal("Milano");
    });

    it("Tentativo di creare un viaggio con autista non disponibile", async function () {
        const { VIA, owner, autistaAccount } = await loadFixture(deployContract);

        // Registra un autista e aggiungi una tratta
        await VIA.registraNuovoAutista(indirizzoAutista1, "test@example.com", "Mario", "Rossi");
        await VIA.aggiungiNuovaTratta("Milano", "Roma", "2024-09-01", "1000 euro");

        // Aggiorna la disponibilità dell'autista a non disponibile
        await VIA.aggiornaDisponibilitaAutista(indirizzoAutista1, false);

        // Tentativo di creare un viaggio con l'autista non disponibile
        await expect(
          VIA.creaViaggio(indirizzoAutista1, 1)
        ).to.be.revertedWith("L'autista non e disponibile");
    });

    it("Tentativo di creare un viaggio su una tratta già assegnata", async function () {
        const { VIA, owner, autistaAccount } = await loadFixture(deployContract);

        // Registra un autista e aggiungi una tratta
        await VIA.registraNuovoAutista(indirizzoAutista1, "test@example.com", "Mario", "Rossi");
        await VIA.aggiungiNuovaTratta("Milano", "Roma", "2024-09-01", "1000 euro");
        await VIA.aggiornaDisponibilitaAutista(indirizzoAutista1, true);
        // Crea un viaggio con l'autista disponibile
        await VIA.creaViaggio(indirizzoAutista1, 1);

        // Tentativo di creare un secondo viaggio sulla stessa tratta
        await expect(
          VIA.creaViaggio(indirizzoAutista1, 1)
        ).to.be.revertedWith("Tratta gia assegnata");
    });

  });

  describe("Visualizzazione dei viaggi", function () {

    it("Visualizzazione di tutti i viaggi", async function () {
        const { VIA, owner, autistaAccount } = await loadFixture(deployContract);

        // Registra un autista e aggiungi una tratta
        await VIA.registraNuovoAutista(indirizzoAutista1, "test@example.com", "Mario", "Rossi");
        await VIA.aggiungiNuovaTratta("Milano", "Roma", "2024-09-01", "1000 euro");

        await VIA.aggiornaDisponibilitaAutista(indirizzoAutista1, true);
        // Crea un viaggio
        await VIA.creaViaggio(indirizzoAutista1, 1);

        // Visualizza tutti i viaggi
        const viaggi = await VIA.mostraTuttiIViaggi();
        expect(viaggi.length).to.equal(1);
        expect(viaggi[0].aut.email).to.equal("test@example.com");
    });

    it("Visualizzazione dei viaggi di un autista", async function () {
        const { VIA, owner, autistaAccount } = await loadFixture(deployContract);

        // Registra un autista e aggiungi una tratta
        await VIA.registraNuovoAutista(indirizzoAutista1, "test@example.com", "Mario", "Rossi");
        await VIA.aggiungiNuovaTratta("Milano", "Roma", "2024-09-01", "1000 euro");
        await VIA.aggiornaDisponibilitaAutista(indirizzoAutista1, true);

        // Crea un viaggio
        await VIA.creaViaggio(indirizzoAutista1, 1);

        // Visualizza i viaggi dell'autista
        const viaggiAutista = await VIA.mostraViaggiAutista(indirizzoAutista1);
        expect(viaggiAutista.length).to.equal(1);
        expect(viaggiAutista[0].aut.email).to.equal("test@example.com");
        expect(viaggiAutista[0].t.partenza).to.equal("Milano");
    });

  });

 

});