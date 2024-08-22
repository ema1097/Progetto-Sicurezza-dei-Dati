$(document).ready(function() {
    // Gestione registrazione
    $('#registration-form').on('submit', function(e) {
        e.preventDefault();
        const name = $('#name').val();
        const surname = $('#surname').val();
        const dob = $('#dob').val();
        const email = $('#email').val();
        const pass = $('#password').val();

        const autista = {
            nome: name,
            cognome: surname,
            dataDiNascita: dob,
            email: email,
            password: pass,
            viaggi: 0,
            disponibilita: 0,
        }
        
        // Salvataggio dei dati in locale (simulazione registrazione)
        addUser(autista);

        loadUsers();
        
        window.location.href = 'login.html';
    });

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

            // Verifica se l'email e la password corrispondono a un utente nella lista
            const user = users.find(existingUser => (existingUser.email === email && existingUser.password === pass));

            if (user) {
                // Salva l'utente loggato nel localStorage
                localStorage.setItem('loggedUser', JSON.stringify(user));

                alert('Ciao ' + user.name); // Saluto personalizzato con il nome dell'utente
                window.location.href = 'home.html'; // Reindirizzamento dopo il login
            } else {
                alert('Email o password non validi');
            }
        }
    });


 /*   // Mostra le informazioni nella dashboard
    const user = JSON.parse(localStorage.getItem('loggedUser'));
    if (user) {
        console.log(user.nome);
        alert(user.nome);
        $('#tiles-container').append(`
            <div class="col-md-5">
                <div class="tile">
                    <h4>${user.nome} ${user.cognome}</h4>
                    <p>Data di Nascita: ${user.dataDiNascita}</p>
                    <p>Email: ${user.email}</p>
                    <p>Viaggi effettuati: ${user.viaggi}</p>
                </div>
            </div>
        `);
    }
*/
// <button id="Seleziona" tag: ${users.email} `+` `+`class="btn btn-danger mt-3">Seleziona</button>

     // Mostra le informazioni nella dashboard Admin
     let users = JSON.parse(localStorage.getItem('users')) || [];
     
     users.forEach(function(user,index) {    
        let disponibilitaText = user.disponibilita == '1' ? 'SI' : 'NO';
        let buttonHTML = '';

    // Se la disponibilità è "SI", aggiungi il pulsante
        if (user.disponibilita == '1') {
            buttonHTML = '<button class="btn btn-primary">Seleziona</button>';
        }
        $('#tiles-container-admin').append(`
            <div class="col-md-5">
                <div class="tile">
                    <h4>${user.nome} ${user.cognome}</h4>
                    <p>Data di Nascita: ${user.dataDiNascita}</p>
                    <p>Email: ${user.email}</p>
                    <p>Viaggi effettuati: ${user.viaggi}</p>
                    <p>Disponibilità: ${disponibilitaText}</p>
                    ${buttonHTML}
                </div>
            </div>
        `);
       
    });
     

    $('#Seleziona').on('click', function(){
            
    });
    

    // Gestione logout
    $('#logout').on('click', function() { 
        localStorage.removeItem('loggedUser');
        window.location.href = 'login.html';
    });

    // Gestione pulsante "Candidati"
    $('#btnCandidati').on('click', function() {
        alert('Ti sei candidato!');
        const logUser = getLoggedUser();
        logUser.disponibilita = '1';
        updateUserInList(logUser);
        $('#disponibilita').html('Si');

    });

    // Gestione pulsante "Rimuovi Disponibilità"
    $('#btnRimuovi').on('click', function() {
        alert('Hai rimosso la tua disponibilità!');
        const logUser = getLoggedUser();
        logUser.disponibilita = '0';
        updateUserInList(logUser);
        $('#disponibilita').html('No');
        
    });

    function updateUserInList(updatedUser) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === updatedUser.email);
        
        console.log('disponibilita: '+ updatedUser.disponibilita);

        if (userIndex !== -1) {
            users[userIndex] = updatedUser; // Aggiorna l'utente nella lista
            localStorage.setItem('users', JSON.stringify(users)); // Salva nuovamente la lista aggiornata nel localStorage
        }
    }


    function addUser(user) {
        
        // Ottieni la lista degli utenti dal localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        if(!users.some(existingUser => existingUser.email === user.email)){
           // Aggiungi il nuovo utente alla lista
             users.push(user);

             // Salva nuovamente la lista nel localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Aggiorna la visualizzazione della lista degli utenti
            displayUsers(users); 
        }else{
            alert("L'utente con questa email esiste già nella lista.");
        }

        
    }

    function loadUsers() {
        // Ottieni la lista degli utenti dal localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // Mostra la lista degli utenti
        displayUsers(users);
    }

    function getLoggedUser(){
       return JSON.parse(localStorage.getItem('loggedUser'));
    }

    function setLoggedUser(user){
        localStorage.setItem('loggedUser', JSON.stringify(user));

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
        users.forEach(function(users,index) {
            console.log(index + ' '+ users.nome);
        });
    }
});