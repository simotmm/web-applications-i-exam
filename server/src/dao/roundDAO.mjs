import db from "../db/db.mjs";
import Round from "../components/Round.mjs";
import Didascalia from "../components/Didascalia.mjs";

export default function RoundDAO(){

    const getRoundsByPartitaIDQuery = "SELECT r.roundID, r.memeID, r.didascaliaSelezionataID, r.punteggio, d.didascaliaID, d.testo \
                                       FROM round r \
                                       LEFT JOIN didascalie d ON r.didascaliaSelezionataID = d.didascaliaID \
                                       WHERE r.partitaID = ?"; // left join: didascaliaSelezionataID potrebbe essere null, nel caso in cui lo sia viene restituito null
    const addRoundQuery = "INSERT INTO round(partitaID, memeID, didascaliaSelezionataID, punteggio) \
                           VALUES(?, ?, ?, ?)";
    const addDidascaliaToRoundQuery = "INSERT INTO didascalieInRound(roundID, didascaliaID) \
                                       VALUES(?, ?)";

    this.getRoundsByPartitaID = (partitaID) => {
        return new Promise((resolve, reject) => {
            db.all(getRoundsByPartitaIDQuery, [partitaID], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!rows)
                    return([]);

                let rounds = [];
                
                for(let row of rows){
                    let didascalia = row.didascaliaID? new Didascalia(row.didascaliaID, row.testo) : null;
                    rounds.push(new Round(row.roundID, row.memeID, null, null, didascalia, row.punteggio));
                }
                
                resolve(rounds);
            });
        });
    }

    this.addRound = (partitaID, memeID, didascaliaSelezionataID, punteggio) => {
        return new Promise((resolve, reject) => {
            db.run(addRoundQuery, [partitaID, memeID, didascaliaSelezionataID, punteggio], function(err){
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    this.addDidascaliaToRound = (roundID, didascaliaID) => {
        return new Promise((resolve, reject) => {
            db.run(addDidascaliaToRoundQuery, [roundID, didascaliaID], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

}
