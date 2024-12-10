// Importa le funzioni necessarie da altri moduli
import { getWeb3, getContract } from './utils.js';

let web3;
let contract;

// Middleware per ottenere web3 e il contratto
async function InizializzaContratto(){
    let web3_temp, contract_temp;
    if (!web3 || !contract) {
        web3_temp = await getWeb3();
        //const accounts = await web3.eth.getAccounts();
        contract_temp = await getContract(web3_temp);
        web3 = web3_temp;
        contract = contract_temp
    }
    return { web3: web3, contract: contract };
};

// Funzione per registrare un autista sulla blockchain
export const registraAutista = async (autistaAddress, email, nome, cognome, admin) => {

    const { contract } = await InizializzaContratto();
    
    try {
        // Esegui la registrazione dell'autista
        const output = await contract.methods.registraNuovoAutista(autistaAddress, email, nome, cognome).send({ from: admin });
        
        return { success: true, message: 'Autista aggiunto' };
    } catch (error) {
        return { success: false, message: error };
        
    }
}

// Funzione per aggiornare la disponibilità di un autista
export const aggiornaDisponibilitaAutista = async (autistaAddress, disponibilita) => {
    const { contract } = await InizializzaContratto();

    try {
        await contract.methods
            .aggiornaDisponibilitaAutista(autistaAddress, disponibilita)
            .send({ from: autistaAddress });

        return { success: true, message: 'Disponibilità aggiornata con successo' };
    } catch (error) {
        return { success: false, message: error.message || error };
    }
};


export const aggiungiNuovaTratta = async (partenza, arrivo, data, pagamento, admin) => {
    const { contract } = await InizializzaContratto();

    try {
        await contract.methods
            .aggiungiNuovaTratta(partenza, arrivo, data, pagamento)
            .send({ from: admin });

        return { success: true, message: 'Nuova tratta aggiunta con successo' };
    } catch (error) {
        return { success: false, message: error.message || error };
    }
};

// Funzione per creare un viaggio
export const creaViaggio = async (autistaAddress, trattaId, admin) => {
    const { contract } = await InizializzaContratto();

    try {
        await contract.methods
            .creaViaggio(autistaAddress, trattaId)
            .send({ from: admin });

        return { success: true, message: 'Viaggio creato con successo' };
    } catch (error) {
        return { success: false, message: error.message || error };
    }
};

// Funzione per mostrare tutti i viaggi
export const mostraTuttiIViaggi = async () => {
    const { contract } = await InizializzaContratto();

    try {
        const allViaggi = await contract.methods.mostraTuttiIViaggi().call();

        // Mappare i dati dei viaggi in un formato leggibile
        const viaggiFormattati = allViaggi.map(viaggio => ({
            autista: {
                id: viaggio.aut.id,
                email: viaggio.aut.email,
                nome: viaggio.aut.nome,
                cognome: viaggio.aut.cognome,
                numeroViaggi: viaggio.aut.numeroViaggi.toString(),  // Convertire BigInt in stringa
                disponibile: viaggio.aut.disponibile
            },
            tratta: {
                id: viaggio.t.id.toString(),
                partenza: viaggio.t.partenza,
                arrivo: viaggio.t.arrivo,
                data: viaggio.t.data,
                pagamento: viaggio.t.pagamento,
                assegnata: viaggio.t.assegnata
            }
        }));

        return { success: true, message: viaggiFormattati };
    } catch (error) {
        return { success: false, message: error.message || error };
    }
};

// Funzione per mostrare i viaggi di un autista
export const mostraViaggiAutista = async (autistaAddress) => {
    const { contract } = await InizializzaContratto();

    try {
        const allViaggi = await contract.methods.mostraViaggiAutista(autistaAddress).call();

        // Mappare i dati dei viaggi in un formato leggibile
        const viaggiAutistaFormattati = allViaggi.map(viaggio => ({
            autista: {
                id: viaggio.aut.id,
                email: viaggio.aut.email,
                nome: viaggio.aut.nome,
                cognome: viaggio.aut.cognome,
                numeroViaggi: viaggio.aut.numeroViaggi.toString(),  // Convertire BigInt in stringa
                disponibile: viaggio.aut.disponibile
            },
            tratta: {
                id: viaggio.t.id.toString(),
                partenza: viaggio.t.partenza,
                arrivo: viaggio.t.arrivo,
                data: viaggio.t.data,
                pagamento: viaggio.t.pagamento,
                assegnata: viaggio.t.assegnata
            }
        }));

        return { success: true, message: viaggiAutistaFormattati };
    } catch (error) {
        return { success: false, message: error.message || error };
    }
};

export const getAllAutisti = async () =>{
    const { contract, admin} = await InizializzaContratto();

    try {
        const allAutisti = await contract.methods.getAllAutisti().call();

        // Mappare e formattare i dati per avere solo proprietà leggibili
        const autistiFormattati = allAutisti.map(autista => ({
            id: autista.id,
            email: autista.email,
            nome: autista.nome,
            cognome: autista.cognome,
            numeroViaggi: autista.numeroViaggi.toString(), // Convertilo a stringa, in modo che BigInt non crei problemi
            disponibile: autista.disponibile
        }));
        
        return { success: true, message: autistiFormattati };
    } catch (error) {
        return { success: false, message: error.message || error };
    }
}

export const getAllTratte = async () =>{
    const { contract } = await InizializzaContratto();

    try {
        const allTratte = await contract.methods.getAllTratte().call();

        // Mappare e formattare i dati per avere solo proprietà leggibili
        const tratteFormattate = allTratte.map(tratta => ({
            id: tratta.id.toString(),
            partenza: tratta.partenza,
            arrivo: tratta.arrivo,
            data: tratta.data,
            pagamento: tratta.pagamenti, 
            assegnata: tratta.assegnata
        }));

        return { success: true, message: tratteFormattate };
    } catch (error) {
        return { success: false, message: error.message || error };
    }
}

export const getAutistaDisponibile = async () =>{
    const { contract } = await InizializzaContratto();

    try {
        const autistiDiponibili = await contract.methods.getAutistaDisponibile().call();

        // Mappare e formattare i dati per avere solo proprietà leggibili
        const autistiFormattati = autistiDiponibili.map(autista => ({
            id: autista.id,
            email: autista.email,
            nome: autista.nome,
            cognome: autista.cognome,
            numeroViaggi: autista.numeroViaggi.toString(), // Convertilo a stringa, in modo che BigInt non crei problemi
            disponibile: autista.disponibile
        }));
        return { success: true, message: autistiFormattati };
    } catch (error) {
        return { success: false, message: error.message || error };
    }
}