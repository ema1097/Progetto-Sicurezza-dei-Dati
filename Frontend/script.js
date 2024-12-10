$(document).ready(function () {

    const ethAddresses = [
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
        "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
        "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
        "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
        "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
        "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
        "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
        "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
        "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
        "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
        "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
        "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
        "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
        "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
        "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
    ];

    // Funzione per ottenere e rimuovere il prossimo indirizzo disponibile
    function getNextAddress() {
        if (ethAddresses.length === 0) {
            console.error("Nessun indirizzo Ethereum disponibile.");
            return null;
        }
        return ethAddresses.shift(); // Rimuove e restituisce il primo indirizzo
    }


    // Gestione registrazione
    $('#registration-form').on('submit', function (e) {
        e.preventDefault();
        const name = $('#name').val();
        const surname = $('#surname').val();
        const email = $('#email').val();
        const pass = $('#password').val();

         // Ottieni il prossimo indirizzo Ethereum
         const ethAddress = getNextAddress();
         if (!ethAddress) {
             alert("Errore: nessun indirizzo Ethereum disponibile.");
             return;
         }

        const autistaData = {
            autistaAddress: ethAddress,
            email: email,
            nome: name,
            cognome: surname,
            admin: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        };

        $.ajax({
            url: "http://127.0.0.1:3007/registrazione/registraAutista", // URL del tuo endpoint
            type: "POST", // Metodo di richiesta
            contentType: "application/json", // Tipo di contenuto
            data: JSON.stringify(autistaData), // Converti i dati in JSON
            success: function(response) {
                if (response.success) {
                    console.log("Autista registrato con successo:", response);



                    const autista = {
                        autistaAddress: ethAddress,
                        nome: name,
                        cognome: surname,
                        email: email,
                        password: pass,
                        address: ethAddress,
                        viaggi: 0,
                        disponibilita: 0,
                    }
            
            
                    // Salvataggio dei dati in locale (simulazione registrazione)
                    addUser(autista);
                    loadUsers();
                    // Redirect alla dashboard
                    window.location.href = 'login.html';

                } else {
                    console.error("Errore nella registrazione:", response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("Errore durante la richiesta:", error);
            }
        });



        
    });


    // Mostra le informazioni nella dashboard
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        $('#tiles-container').append(`
            <div class="col-md-4">
                <div class="tile">
                    <h4>${user.name} ${user.surname}</h4>
                    <p>Email: ${user.email}</p>
                </div>
            </div>
        `);
    }

    //Gestione pag autista
    const utente = JSON.parse(localStorage.getItem('user'));
    if (utente) {
        $('#titolo') = "Benvenuto " + utente.name;
    }


    // Gestione logout
    $('#logout').on('click', function () {
        //localStorage.removeItem('user');
        localStorage.removeItem('loggedUser');
        window.location.href = 'login.html';
    });



    function addUser(user) {

        // Ottieni la lista degli utenti dal localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (!users.some(existingUser => existingUser.email === user.email)) {
            // Aggiungi il nuovo utente alla lista
            users.push(user);

            // Salva nuovamente la lista nel localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Aggiorna la visualizzazione della lista degli utenti
            displayUsers(users);
        } else {
            alert("L'utente con questa email esiste già nella lista.");
        }


    }

    function loadUsers() {
        // Ottieni la lista degli utenti dal localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Mostra la lista degli utenti
        displayUsers(users);
    }

    function displayUsers(users) {
        // Svuota la lista attuale
        /*userList.innerHTML = '';

        // Mostra ogni utente nella lista
        users.forEach(function(user, index) {
            const li = document.createElement('li');
            li.textContent = `${user.name} - ${user.email}`;
            userList.appendChild(li);
        });*/
        console.log('Autisti: ');
        users.forEach(function (users, index) {
            console.log(index + ' ' + users.nome);
        });
    }

    // Gestione login
   /* $('#login-form').on('submit', function (e) {
        e.preventDefault(); // Previene il comportamento predefinito del form

        const email = $('#email').val(); // Prende l'email inserita
        const password = $('#password').val(); // Prende la password inserita
        let utenti = JSON.parse(localStorage.getItem('users')) || []; // Recupera gli utenti dal localStorage
        let userLogged = null; // Variabile che conterrà l'utente loggato, se esiste
        const index = 0;

        if ((email !== "emanuelevitale73@gmail.com")) {
            // Controlla se l'email inserita corrisponde a un utente esistente nel localStorage
            utenti.forEach(function (user, indice) {
                console.log(user.email);

                if ((user.email === email) && (user.password === password)) {
                    index = indice; // Salva l'utente trovato in userLogged
                }
            });
            userLogged = utenti[index];


            if (userLogged) {
                // Se l'utente esiste, memorizza l'utente loggato nel localStorage
                localStorage.setItem('loggedUser', JSON.stringify(userLogged));
                // Reindirizza alla dashboard
                window.location.href = 'home.html';
            } else {
                // Se l'utente non esiste, reindirizza alla pagina di errore o homepage
                alert("Utente non trovato! Registrati o riprova.");
                window.location.href = 'login.html';
            }
        } else {
            window.location.href = 'dashboard.html';
        }
    });*/
    // Gestione login
    $('#login-form').on('submit', function(e) {
        e.preventDefault(); // Evita il ricaricamento della pagina

        const email = $('#email').val();
        const pass = $('#password').val();

        // Controlla se le credenziali corrispondono a un admin
        if (email == "emanuelevitale73@gmail.com" && pass == 'AdminPass') {
            // Salva l'admin come utente autenticato
            localStorage.setItem('loggedUser', JSON.stringify({ email: email, role: 'admin' }));
            alert('Ciao Admin');
            window.location.href = 'dashboard.html';
        } else {
            // Ottieni la lista degli utenti dal localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];
            console.log(users);
        
            // Verifica se l'email e la password corrispondono a un utente nella lista
            const utenteLoggato = users.find(existingUser => (existingUser.email === email));
            console.log(utenteLoggato);

            if (utenteLoggato) {
                // Salva l'utente loggato nel localStorage
                localStorage.setItem('loggedUser', JSON.stringify(utenteLoggato));

                alert('Ciao ' + utenteLoggato.nome); // Saluto personalizzato con il nome dell'utente
                window.location.href = 'home.html'; // Reindirizzamento dopo il login
            } else {
                alert('Email o password non validi');
            }
        }
    });

    // Gestione pulsante "Candidati"
    $('#btnCandidati').on('click', function() {
        alert('Ti sei candidato!');
        const logUser = getLoggedUser();
        logUser.disponibilita = 1;
        updateUserInList(logUser);
        $('#disponibilita').text('Si');

    });

    // Gestione pulsante "Rimuovi Disponibilità"
    $('#btnRimuovi').on('click', function() {
        alert('Hai rimosso la tua disponibilità!');
        const logUser = getLoggedUser();
        logUser.disponibilita = 0;
        updateUserInList(logUser);
        $('#disponibilita').text('No');
        
    });

    function updateUserInList(updatedUser) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === updatedUser.email);
        
        console.log('disponibilita: '+ updatedUser.disponibilita);

        if (userIndex !== -1) {
            users[userIndex] = updatedUser; // Aggiorna l'utente nella lista
            localStorage.setItem('users', JSON.stringify(users)); // Salva nuovamente la lista aggiornata nel localStorage
            console.log(users[userIndex]);
        }
    }

    function getLoggedUser(){
        return JSON.parse(localStorage.getItem('loggedUser'));
     }
 
     function setLoggedUser(user){
         localStorage.setItem('loggedUser', JSON.stringify(user));
 
     }




    document.getElementById('aggiungiTrattaForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita il reload della pagina

        // Genera un id unico per la tratta
        const generateId = () => Math.random();

        // Ottiene i valori inseriti dall'utente
        const partenza = document.getElementById('partenza').value;
        const arrivo = document.getElementById('arrivo').value;
        const data = document.getElementById('data').value;
        const importo = parseFloat(document.getElementById('pagamento').value); // Converti il pagamento in un numero

        // Crea un oggetto tratta con i campi richiesti
        const tratta = {
            id: generateId(),
            partenza: partenza,
            arrivo: arrivo,
            data: data,
            importo: importo,
            assegnata: false // Imposta assegnata su false per default
        };

        console.log(tratta);

        // Recupera eventuali tratte già salvate nel localStorage
        let tratte = JSON.parse(localStorage.getItem('tratte')) || [];

        // Aggiunge la nuova tratta alla lista di tratte
        tratte.push(tratta);

        // Salva la lista aggiornata nel localStorage
        localStorage.setItem('tratte', JSON.stringify(tratte));

        // Messaggio di conferma (facoltativo)
        alert('Tratta aggiunta con successo!');

        // Resetta il form
        document.getElementById('aggiungiTrattaForm').reset();
    });
});