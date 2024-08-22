// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ViaggiAutisti is AccessControl {
    bytes32 public constant DRIVER_ROLE = keccak256("DRIVER_ROLE");

    struct Autista {
        string email;
        string nome;
        string cognome;
        uint numeroViaggi;
        bool disponibile;
    }

    struct Tratta {
        uint id;
        string partenza;
        string arrivo;
        string data;
        string pagamento;
        bool assegnata;
    }

    struct Viaggio {
        Autista aut;
        Tratta t;
    }

    // Mappings per salvare autisti, tratte e viaggi
    mapping(address => Autista) public autisti;
    mapping(uint => Tratta) public tratte;
    Viaggio[] public viaggi;

    uint public tratteCount;

    constructor (){
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        tratteCount = 0;
    }

    // Metodo per registrare un nuovo autista e assegnare il ruolo DRIVER_ROLE
    function registraNuovoAutista(address autistaAddress, string memory email, string memory nome, string memory cognome) public {
        Autista memory nuovoAutista = Autista({
            email: email,
            nome: nome,
            cognome: cognome,
            numeroViaggi: 0,
            disponibile: false  // L'autista non è disponibile per default alla registrazione
        });
        autisti[autistaAddress] = nuovoAutista;
        _grantRole(DRIVER_ROLE, autistaAddress);
    }

    // Metodo per aggiornare la disponibilità di un autista
    function aggiornaDisponibilitaAutista(address autistaAddress, bool disponibilita) public {
        require(hasRole(DRIVER_ROLE, autistaAddress), "Indirizzo non associato a nessun autista");
        autisti[autistaAddress].disponibile = disponibilita;
    }

    // Metodo per aggiungere una nuova tratta, solo dall'admin
    function aggiungiNuovaTratta(string memory partenza, string memory arrivo, string memory data, string memory pagamento) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Solo l'admin puo aggiungere una nuova tratta");
        tratteCount++;
        Tratta memory nuovaTratta = Tratta({
            id: tratteCount,
            partenza: partenza,
            arrivo: arrivo,
            data: data,
            pagamento: pagamento,
            assegnata: false
        });
        tratte[tratteCount] = nuovaTratta;
    }

    // Metodo per creare un viaggio, utilizzabile solo dall'admin
    function creaViaggio(address autistaAddress, uint trattaId) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Solo l'admin puo creare un viaggio");
        require(hasRole(DRIVER_ROLE, autistaAddress), "Indirizzo non associato a nessun autista");
        require(tratte[trattaId].assegnata == false, "Tratta gia assegnata");
        require(autisti[autistaAddress].disponibile == true, "L'autista non e disponibile");

        Autista storage autista = autisti[autistaAddress];
        Tratta storage tratta = tratte[trattaId];

        tratta.assegnata = true;
        autista.numeroViaggi++;
        autista.disponibile = false;  // L'autista diventa non disponibile dopo l'assegnazione

        Viaggio memory nuovoViaggio = Viaggio({
            aut: autista,
            t: tratta
        });

        viaggi.push(nuovoViaggio);
    }

    // Metodo per mostrare tutti i viaggi con annesso l'autista associato
    function mostraTuttiIViaggi() public view returns (Viaggio[] memory) {
        return viaggi;
    }

    // Metodo per mostrare per un autista tutti i viaggi con i relativi dati associati
    function mostraViaggiAutista(address autistaAddress) public view returns (Viaggio[] memory) {
        require(hasRole(DRIVER_ROLE, autistaAddress), "Indirizzo non associato a nessun autista");

        uint contatoreViaggi = 0;

        // Conta i viaggi associati all'autista
        for (uint i = 0; i < viaggi.length; i++) {
            if (keccak256(abi.encodePacked(viaggi[i].aut.email)) == keccak256(abi.encodePacked(autisti[autistaAddress].email))) {
                contatoreViaggi++;
            }
        }

        Viaggio[] memory viaggiAutista = new Viaggio[](contatoreViaggi);
        uint j = 0;

        // Popola l'array con i viaggi dell'autista
        for (uint i = 0; i < viaggi.length; i++) {
            if (keccak256(abi.encodePacked(viaggi[i].aut.email)) == keccak256(abi.encodePacked(autisti[autistaAddress].email))) {
                viaggiAutista[j] = viaggi[i];
                j++;
            }
        }

        return viaggiAutista;
    }
}