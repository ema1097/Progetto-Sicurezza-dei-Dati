$(document).ready(function () {

    if (!localStorage.getItem("ethAddresses")) {
        localStorage.setItem(
            "ethAddresses",
            JSON.stringify([
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
                "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
            ])
        );
    }

    //controlla se è stato effettuato l'accesso altrimenti rimanda alla login
    checkAuthentication();


    // Funzione per ottenere e rimuovere il prossimo indirizzo disponibile
    function getNextAddress() {
        const addresses = JSON.parse(localStorage.getItem("ethAddresses")) || [];
        if (addresses.length === 0) {
            console.error("Nessun indirizzo Ethereum disponibile.");
            localStorage.removeItem("ethAddresses"); // Rimuove la chiave se l'array è vuoto
            return null;
        }
        const nextAddress = addresses.shift(); // Rimuove il primo indirizzo
        localStorage.setItem("ethAddresses", JSON.stringify(addresses)); // Aggiorna lo stato
        return nextAddress;
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
            success: function (response) {
                if (response.success) {
                    console.log("Autista registrato con successo:", response);
                    alert("Autista registrato con successo.");

                    // Recupera gli utenti esistenti da localStorage (o un array vuoto se non ce ne sono)
                    let users = JSON.parse(localStorage.getItem('users')) || [];

                    const newUser = {
                        email: email,
                        password: pass, // Meglio non salvarla in chiaro
                        ethAddress: ethAddress
                    };

                    // Trova l'indice dell'utente con la stessa email
                    const existingIndex = users.findIndex(user => user.email === email);

                    if (existingIndex !== -1) {
                        // Se l'utente esiste già, sostituiscilo
                        users[existingIndex] = newUser;
                    } else {
                        // Altrimenti, aggiungilo all'array
                        users.push(newUser);
                    }

                    // Salva l'array aggiornato in localStorage
                    localStorage.setItem('users', JSON.stringify(users));

                    // Redirect alla dashboard
                    window.location.href = 'dashboard.html';

                } else {
                    console.error("Errore nella registrazione:", response.message);
                }
            },
            error: function (xhr, status, error) {
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
        sessionStorage.removeItem('loggedUser');
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
    /* $('#login-form').on('submit', function(e) {
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
             
         const autistaData = {
             autistaAddress: getIDLoggedUser(),
         };
 
         console.log("ENTROOOOO");
 
             
         $.ajax({
             url: "http://127.0.0.1:3007/info/getAutista", // URL del tuo endpoint
             type: "POST", // Metodo di richiesta
             contentType: "application/json", // Tipo di contenuto
             data: JSON.stringify(autistaData), // Converti i dati in JSON
             success: function(response) {
                 if (response.success) {
                     console.log("Accesso effettuato con successo:", response);
 
 
 
                     const autista = {
                         autistaAddress: response.id,
                         nome: response.nome,
                         cognome: response.cognome,
                         email: response.email,
                         password: "utente1",
                         disponibilita: response.disponibilita,
                     
                     }
                     if (autista) {
                         // Salva l'utente loggato nel localStorage
                         localStorage.setItem('loggedUser', JSON.stringify(autista));
         
                         alert('Ciao ' + autista.nome); // Saluto personalizzato con il nome dell'utente
                         window.location.href = 'home.html'; // Reindirizzamento dopo il login
                     } else {
                         alert('Email o password non validi');
                     }
                     // Salvataggio dei dati in locale (simulazione registrazione)
                     //addUser(autista);
                     //loadUsers();
                     // Redirect alla dashboard
                     window.location.href = 'home.html';
 
                 } else {
                     console.error("Errore nella registrazione:", response.message);
                 }
             },
             error: function(xhr, status, error) {
                 console.error("Errore durante la richiesta:", error);
             }
         });
 
             
           /*  // Ottieni la lista degli utenti dal localStorage
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
             }*/
    // }
    /*});/*/

    $('#login-form').on('submit', function (e) {
        e.preventDefault(); // Evita il ricaricamento della pagina

        const email = $('#email').val();
        const password = $('#password').val();

        // Controlla se le credenziali corrispondono a un admin
        if (email === "emanuelevitale73@gmail.com" && password === 'AdminPass') {
            // Salva l'admin come utente autenticato
            sessionStorage.setItem('loggedUser', JSON.stringify({ email: email, role: 'admin', id: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" }));
            alert('Ciao Admin');
            window.location.href = 'dashboard.html';
        } else {
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Trova l'utente corrispondente
            const user = users.find(u => u.email === email && u.password === password);


            if (user) {

                console.log(user);
                const autistaAddress = user.ethAddress;
                console.log(autistaAddress);

                $.ajax({
                    url: "http://127.0.0.1:3007/info/getAutista",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({ autistaAddress: autistaAddress }), // Passa un oggetto JSON
                    success: function (response) {

                        const msg = response.message;

                        if (response.success) {
                            const autista = {
                                autistaAddress: response.message.id,
                                nome: response.message.nome,
                                cognome: response.message.cognome,
                                email: response.message.email,
                                numViaggi: response.message.numeroViaggi,
                                password: password,
                                disponibilita: response.message.disponibile,
                            };

                            console.log("Login effettuato con successo:", user);

                            // Salva l'utente loggato nel localStorage
                            sessionStorage.setItem('loggedUser', JSON.stringify(autista));
                            window.location.href = 'home.html'; // Reindirizzamento dopo il login
                        } else {
                            alert('Errore: ' + response.message);
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Errore durante la richiesta:", error);
                        console.error("Dettagli della risposta:", xhr.responseText); // Per maggiori dettagli
                        alert('Si è verificato un errore. Riprova più tardi.');
                    }
                });

            } else {
                alert("Email o password non corretti!");
            }
        }

    });

    // Gestione pulsante "Disponibilita"
    $('#btnCandidati').on('click', function (e) {
        e.preventDefault();

        const users = JSON.parse(sessionStorage.getItem('loggedUser'));

        const autistaData = {
            autistaAddress: users.autistaAddress,
            disponibilita: true
        };

        $.ajax({
            url: "http://127.0.0.1:3007/servizio/autistaAggiornaDisponibilita", // URL del tuo endpoint
            type: "POST", // Metodo di richiesta
            contentType: "application/json", // Tipo di contenuto
            data: JSON.stringify(autistaData), // Converti i dati in JSON
            success: function (response) {
                if (response.success) {
                    console.log("Disponibilita aggiornata con successo:", response);

                    $('#disponibilita').text('Si');
                    users.disponibilita = true;


                } else {
                    console.error("Errore nella registrazione:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Errore durante la richiesta:", error);
            }
        });
    });

    // Gestione pulsante "Rimuovi Disponibilità"
    $('#btnRimuovi').on('click', function (e) {
        e.preventDefault();

        const users = JSON.parse(sessionStorage.getItem('loggedUser'));

        const autistaData = {
            autistaAddress: users.autistaAddress,
            disponibilita: false
        };

        $.ajax({
            url: "http://127.0.0.1:3007/servizio/autistaAggiornaDisponibilita", // URL del tuo endpoint
            type: "POST", // Metodo di richiesta
            contentType: "application/json", // Tipo di contenuto
            data: JSON.stringify(autistaData), // Converti i dati in JSON
            success: function (response) {
                if (response.success) {
                    console.log("Disponibilita aggiornata con successo:", response);

                    $('#disponibilita').text('No');
                    users.disponibilita = false;

                } else {
                    console.error("Errore nella registrazione:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("Errore durante la richiesta:", error);
            }
        });
    });

    function updateUserInList(updatedUser) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === updatedUser.email);

        console.log('disponibilita: ' + updatedUser.disponibilita);

        if (userIndex !== -1) {
            users[userIndex] = updatedUser; // Aggiorna l'utente nella lista
            localStorage.setItem('users', JSON.stringify(users)); // Salva nuovamente la lista aggiornata nel localStorage
            console.log(users[userIndex]);
        }
    }


    function getLoggedUser() {
        return JSON.parse(localStorage.getItem('loggedUser'));
    }

    function setLoggedUser(user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));

    }


    $('#aggiungiTrattaForm').on('submit', function (e) {
        e.preventDefault();
        const partenza = document.getElementById('partenza').value;
        const arrivo = document.getElementById('arrivo').value;
        const data = document.getElementById('data').value;
        const importo = parseFloat(document.getElementById('pagamento').value).toString(); // Converti il pagamento in un numero

        const dataOggi = new Date().toISOString().split('T')[0];


        if (data >= dataOggi) {

            const tratta = {
                partenza: partenza,
                arrivo: arrivo,
                data: data,
                pagamento: importo,
                admin: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                //assegnata: false // Imposta assegnata su false per default
            };

            $.ajax({
                url: "http://127.0.0.1:3007/registrazione/registraTratta", // URL del tuo endpoint
                type: "POST", // Metodo di richiesta
                contentType: "application/json", // Tipo di contenuto
                data: JSON.stringify(tratta), // Converti l'oggetto tratta in JSON
                success: function (response) {
                    if (response.success) {
                        console.log("Tratta aggiunta con successo:", response);

                        // Messaggio di conferma (facoltativo)
                        alert('Tratta aggiunta con successo!');

                        // Resetta il form
                        document.getElementById('aggiungiTrattaForm').reset();
                        window.location.href = 'dashboard.html';

                    } else {
                        console.error("Errore nell'aggiunta della tratta:", response.message);
                        alert("Errore nell'aggiunta della tratta!");

                    }
                },
                error: function (xhr, status, error) {
                    console.error("Errore durante la richiesta:", error);
                    alert("Errore nell'aggiunta della tratta!");

                }
            });

        } else {
            alert("Data non valida");
            document.getElementById("data").focus();
        }
    });

    function checkAuthentication() {
        const loggedInUser = sessionStorage.getItem('loggedUser');
        const currentPage = window.location.pathname.split("/").pop(); // Ottiene il nome del file attuale

        if (!loggedInUser && currentPage !== "login.html") {
            window.location.href = 'login.html';
        }
    }

});