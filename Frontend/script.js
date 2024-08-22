$(document).ready(function() {
    // Gestione registrazione
    $('#registration-form').on('submit', function(e) {
        e.preventDefault();
        const name = $('#name').val();
        const surname = $('#surname').val();
        const dob = $('#dob').val();
        const email = $('#email').val();

        const autista = {
            nome: name,
            cognome: surname,
            dataDiNascita: dob,
            email: email
        }
        
        // Salvataggio dei dati in locale (simulazione registrazione)
        addUser(autista);
        loadUsers();
        // Redirect alla dashboard
        window.location.href = 'index.html';
    });

    // Gestione login
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#email').val();
        if(email == "emanuelevitale73@gmail.com"){
            window.location.href = 'dashboard.html';  
        }else{
            window.location.href = 'index.html';
        }
    });

    // Mostra le informazioni nella dashboard
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        $('#tiles-container').append(`
            <div class="col-md-4">
                <div class="tile">
                    <h4>${user.name} ${user.surname}</h4>
                    <p>Data di Nascita: ${user.dob}</p>
                    <p>Email: ${user.email}</p>
                </div>
            </div>
        `);
    }

    //Gestione pag autista
    const utente = JSON.parse(localStorage.getItem('user'));
    if(utente){
        $('#titolo')= "Benvenuto "+ utente.name;
        alert(utente.name);
    }
    

    // Gestione logout
    $('#logout').on('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });

    

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