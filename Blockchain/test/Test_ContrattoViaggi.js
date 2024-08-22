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