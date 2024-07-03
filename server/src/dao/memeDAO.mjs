import db from "../db/db.mjs";
import Meme from "../components/Meme.mjs";
import Didascalia from "../components/Didascalia.mjs";

export default function MemeDAO(){

    const getMemeByIDQuery = "SELECT * FROM meme WHERE memeID = ?"
    const getAllMemes = "SELECT * FROM meme";
    const getRandomMemesQuery = "SELECT * FROM meme ORDER BY RANDOM() LIMIT ?";
    const addMemeQuery = "INSERT INTO meme(nomeFile) VALUES(?)";

    //ritorna un meme dato l'id
    this.getMemeByID = (memeID) => {
        return new Promise((resolve, reject) => {
            db.get(getMemeByIDQuery, [memeID], (err, row) => {
                if(err){
                    reject(err);
                    return;
                }

                if(!row)
                    return;

                resolve(new Meme(row.memeID, row.nomeFile));
            });
        });
    }

    //ritorna un massimo di n meme casuali, il controller chiama con 1 o 3 in base all'utente loggato/non loggato
    this.getRandomMemes = (n) => {
        return new Promise((resolve, reject) => {
            db.all(getRandomMemesQuery, [n], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!rows){
                    reject(new Error("nessun meme nella tabella meme"));
                    return;
                }
                const memes = [];
                for(let row of rows)
                    memes.push(new Meme(row.memeID, row.nomeFile));
                resolve(memes);
            });
        });
    }

    //ritorna tutti i meme presenti nel db
    this.getAllMemes = () => {
        return new Promise((resolve, reject) => {
            db.all(getAllMemes, [], async(err, rows) => {
                if(err){
                    reject(err);
                    return;
                }

                if(!rows){
                    resolve([]);
                    return;
                }

                let memes = [];
                for(let row of rows){
                    memes.push(new Meme(row.memeID, row.nomeFile));
                }
                    
                resolve(memes);
            });
        });
    }

    //riceve un oggetto Meme, restituisce true oppure un errore
    this.addMeme = (nomeFile) => {
        return new Promise((resolve, reject) => {
            db.run(addMemeQuery, [nomeFile], (err) => {
                if(err){
                    reject(err);
                    return;
                }
                    
                resolve(true);
            });
        });
    }
}