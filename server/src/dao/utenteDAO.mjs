import db from "../db/db.mjs";
import crypto from "crypto";
import Utente from "../components/Utente.mjs";

export default function UtenteDAO(){

    const getUtenteByUsernameQuery = "SELECT * FROM utenti WHERE username = ?";
    const getUtentiQuery = "SELECT * FROM utenti";
    const addUtenteQuery = "INSERT INTO utenti(username, hashedPassword, salt) VALUES(?, ?, ?)";
    
    this.getUtente = (username, password) => {
        return new Promise((resolve, reject) => {
            db.get(getUtenteByUsernameQuery, [username], (err, row) => {
                if(err){
                    reject(err);
                    return;
                }
                if(!row) {
                    resolve(false); 
                    return; 
                }
                
                const utente = new Utente(row.utenteID, row.username);
                crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
                    if(err) reject(err);
                    if(!crypto.timingSafeEqual(Buffer.from(row.hashedPassword, "hex"), hashedPassword)){
                        resolve(false);
                        return;
                    }
                    else
                      resolve(utente);
                  });
                
            });
        });
    }

    this.getUtenteByUsername = (username) => {
        return new Promise((resolve, reject) => {
            db.get(getUtenteByUsernameQuery, [username], (err, row) => {
                if(err) reject(err)
                if(!row){
                    resolve(false);
                    return;
                }
                resolve(new Utente(row.utenteID, row.username));
            });
        });
    }

    this.getUtenti = () => {
        return new Promise((resolve, reject) => {
            db.all(getUtentiQuery, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                
                const utenti = [];
                for(let row of rows)
                    utenti.push(new Utente(row.utenteID, row.username));
                resolve(utenti);
            });
        });
    }

    this.addUtente = (username, hashedPassword, salt) => {
        return new Promise((resolve, reject) => {
            db.run(addUtenteQuery, [username, hashedPassword, salt], function(err) { //function serve per usare this.lastID
                if(err){
                    reject(err);
                    return;
                }
                resolve(new Utente(this.lastID, username));
            });
        });
    }
}