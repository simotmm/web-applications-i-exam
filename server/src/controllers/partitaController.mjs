import Partita from "../components/Partita.mjs";
import Round from "../components/Round.mjs";
import MemeDAO from "../dao/memeDAO.mjs";
import RoundDAO from "../dao/roundDAO.mjs";
import DidascaliaDAO from "../dao/didascaliaDAO.mjs";
import PartitaDAO from "../dao/partitaDAO.mjs";

export default function PartitaController(){

    const memeDAO = new MemeDAO();
    const didascaliaDAO = new DidascaliaDAO();
    const partitaDAO = new PartitaDAO();
    const roundDAO = new RoundDAO();

    //nuova partita da mandare al frontend
    this.nuovaPartita = async(utente) => {
        const numeroRound = utente? 3 : 1;
        const utenteID = utente? utente.utenteID : null;
        const memes = await memeDAO.getRandomMemes(numeroRound);
        let rounds = [];
        
        for(let meme of memes){ //assumendo che il numero di meme presenti nel db sia >=3 allora memes.length sarà 1 oppure 3
            const corrette = await didascaliaDAO.getDidascalieCorretteRandomByMemeID(meme.memeID);
            const sbagliate = await didascaliaDAO.getDidascalieSbagliateRandomByMemeID(meme.memeID);
            let tutte = corrette.concat(sbagliate);
            tutte = mescolaVettore(tutte);
            rounds.push(new Round(null, meme, tutte, corrette, null, 0));
        }
                    //data=null perchè la partita potrebbe terminare nella giornata successiva o in ogni caso termina in un momento successivo (per data si intende data e ora)
        return(new Partita(null, utenteID, rounds, 0, null)); //la data verrà calcolata alla fine della partita
    };

    //partita ricevuta dal frontend da salvare nel db
    this.salvaPartita = async(partita) => {
        let partitaID = await partitaDAO.addPartita(partita.utenteID, partita.punteggio, partita.data);
        for(let round of partita.rounds){                               //se la didascalia non è null allora si salva l'id, altrimenti null
            let roundID = await roundDAO.addRound(partitaID, round.meme.memeID, round.didascaliaSelezionata? round.didascaliaSelezionata.didascaliaID : null, round.punteggio);
            
            for(let didascalia of round.didascalie)
                await roundDAO.addDidascaliaToRound(roundID, didascalia.didascaliaID); 
        }
        return partitaID;
    }

    //cronologia delle partite di un utente
    this.getPartite = async(utente) => { 
        let partite = await partitaDAO.getPartiteByUtenteID(utente.utenteID);
        let partiteRes = [];

        for(let partita of partite){
            let rounds = await roundDAO.getRoundsByPartitaID(partita.partitaID);
            let roundsRes = [];
            
            for(let round of rounds){ 
                let didascalie = await didascaliaDAO.getDidascalieByRoundID(round.roundID);
                let meme = await memeDAO.getMemeByID(round.meme);   //didascalieCorrette non serve, se la didascalia selezionata è corretta si evince dal punteggio
                roundsRes.push(new Round(round.roundID, meme, didascalie, null, round.didascaliaSelezionata, round.punteggio));
            }
            partiteRes.push(new Partita(partita.partitaID, utente.utenteID, roundsRes, partita.punteggio, partita.data));
        }
        return partiteRes;
    }

    function mescolaVettore(v) {
        for (let i = v.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); //indice casuale 
            [v[i], v[j]] = [v[j], v[i]]; //scambia gli elementi contenuti nel vettore all'indice casuale e all'indice corrente
        }
        return v;
    }

}