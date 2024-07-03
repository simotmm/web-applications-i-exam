import db from "../db/db.mjs";
import Didascalia from "../components/Didascalia.mjs";

export default function DidascaliaDAO(){

    const getDidascalieQuery = "SELECT * FROM didascalie";
    const addDidascaliaQuery = "INSERT INTO didascalie(testo) VALUES(?)";
    const getDidascaliaByIDQuery = "SELECT * FROM didascalie WHERE didascaliaID = ?";
    const getDidascalieByRoundIDQuery = "SELECT * FROM didascalie d, didascalieInRound dir \
                                         WHERE d.didascaliaID = dir.didascaliaID \
                                            AND dir.roundID = ?";
    const getDidascalieCorretteByMemeIDQuery = "SELECT * \
                                        FROM didascalie d, didascalieInMeme dm\
                                        WHERE d.didascaliaID = dm.didascaliaID \
                                            AND memeID = ?"
    const getDidascalieSbagliateByMemeIDQuery = "SELECT didascaliaID, testo\
                                                 FROM didascalie\
                                                 WHERE didascaliaID NOT IN(\
                                                    SELECT didascaliaID\
                                                    FROM didascalieInMeme\
                                                    WHERE memeID = ?)";
    const getDidascalieCorretteRandomByMemeIDQuery = "SELECT * \
                                        FROM didascalie d, didascalieInMeme dm\
                                        WHERE d.didascaliaID = dm.didascaliaID \
                                            AND memeID = ? \
                                        ORDER BY RANDOM() \
                                        LIMIT 2";
    const getDidascalieSbagliateRandomByMemeIDQuery = "SELECT didascaliaID, testo\
                                                       FROM didascalie\
                                                       WHERE didascaliaID NOT IN(\
                                                          SELECT didascaliaID\
                                                          FROM didascalieInMeme\
                                                          WHERE memeID = ?)\
                                                       ORDER BY RANDOM()\
                                                       LIMIT 5";
    const associaDidascaliaAMemeQuery = "INSERT INTO didascalieInMeme(didascaliaID, memeID) \
                                         VALUES(?, ?)";

    //ritorna tutte le didascalie proposte in un round
    this.getDidascalieByRoundID = (roundID) => {
        return new Promise((resolve, reject) => {
            db.all(getDidascalieByRoundIDQuery, [roundID], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    resolve([]);
                    return;
                }
                let didascalie = [];
                for(let didascalia of rows)
                    didascalie.push(new Didascalia(didascalia.didascaliaID, didascalia.testo));
                resolve(didascalie);
            });
        });
    }

    //ritorna un massimo di 2 didascalie casuali correte per un meme
    this.getDidascalieCorretteRandomByMemeID = (memeID) => {
        return new Promise((resolve, reject) => {
            db.all(getDidascalieCorretteRandomByMemeIDQuery, [memeID], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    resolve([]);
                    return;
                }
                let didascalie = [];
                for(let didascalia of rows)
                    didascalie.push(new Didascalia(didascalia.didascaliaID, didascalia.testo));
                resolve(didascalie);
            });
        });
    }

    //ritorna un massimo di 5 didascalie casuali sbagliate per un meme
    this.getDidascalieSbagliateRandomByMemeID = (memeID) => {
        return new Promise((resolve, reject) => {
            db.all(getDidascalieSbagliateRandomByMemeIDQuery, [memeID], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    resolve([]);
                    return;
                }
                let didascalie = [];
                for(let didascalia of rows)
                    didascalie.push(new Didascalia(didascalia.didascaliaID, didascalia.testo));
                resolve(didascalie);
            });
        });
    }
    
    //ritorna una didascalia dato l'id
    this.getDidascaliaByID = (didascaliaID) => {
        return new Promise((resolve, reject) => {
            db.get(getDidascaliaByIDQuery, [didascaliaID], (err, row) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!row){
                    reject(new Error("didascalia inesistente"));
                    return;
                }
                resolve(new Didascalia(row.didascaliaID, row.testo));
            });
        });
    }

    //ritorna tutte le didascalie presenti nel db
    this.getDidascalie = () => {
        return new Promise((resolve, reject) => {
            db.all(getDidascalieQuery, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                
                let didascalie = [];
                for(let row of rows)
                    didascalie.push(new Didascalia(row.didascaliaID, row.testo));

                resolve(didascalie);
            });
        });
    }

    //ritorna tutte le didascalie corrette per un meme
    this.getDidascalieCorretteByMemeID = (memeID) => {
        return new Promise((resolve, reject) => {
            db.all(getDidascalieCorretteByMemeIDQuery, [memeID], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    resolve([]);
                    return;
                }
                let didascalie = [];
                for(let didascalia of rows)
                    didascalie.push(new Didascalia(didascalia.didascaliaID, didascalia.testo));
                resolve(didascalie);
            });
        });
    }

    //ritorna tutte le didascalie sbagliate per un meme
    this.getDidascalieSbagliateByMemeID = (memeID) => {
        return new Promise((resolve, reject) => {
            db.all(getDidascalieSbagliateByMemeIDQuery, [memeID], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    resolve([]);
                    return;
                }
                let didascalie = [];
                for(let didascalia of rows)
                    didascalie.push(new Didascalia(didascalia.didascaliaID, didascalia.testo));
                resolve(didascalie);
            });
        });
    }

    //aggiunge una didascalia al db
    this.addDidascalia = (testo) => {
        return new Promise((resolve, reject) => {
            db.run(addDidascaliaQuery, [testo], function(err) { //function serve per definire "this" e quindi ottenere l'id dell'ultima riga inserita
                if(err){
                    reject(err);
                    return;
                }
                resolve(this.lastID)
            });
        });
    }

    this.associaDidascaliaAMeme = (didascaliaID, memeID) => {
        return new Promise((resolve, reject) => {
            db.run(associaDidascaliaAMemeQuery, [didascaliaID, memeID], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                
                resolve(true)
            });
        });
    }   

}