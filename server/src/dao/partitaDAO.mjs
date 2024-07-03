import db from "../db/db.mjs";
import Partita from "../components/Partita.mjs"

export default function PartitaDAO(){

    const getPartiteByUtenteIDQuery = "SELECT * FROM partite WHERE utenteID = ?";
    const addPartitaQuery = "INSERT INTO partite(utenteID, punteggio, data) VALUES(?, ?, ?)";

    this.getPartiteByUtenteID = (utenteID) => {
        return new Promise((resolve, reject) => {
            db.all(getPartiteByUtenteIDQuery, [utenteID], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!rows) {
                    resolve([]);
                    return;
                }
                let partite = [];
                for(let row of rows)           //rounds=null, i round verranno recuperati nel controller
                    partite.push(new Partita(row.partitaID, row.utenteID, null, row.punteggio, row.data));
                resolve(partite);
            });
        });
    }

    //restituisce l'id della partita se l'insert va a buon fine
    this.addPartita = (utenteID, punteggio, data) => {
        return new Promise((resolve, reject) => {
            db.run(addPartitaQuery, [utenteID, punteggio, data], function(err){ //function server per this.lastID
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

}
