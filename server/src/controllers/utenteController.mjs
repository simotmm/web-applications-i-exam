import UtenteDAO from "../dao/utenteDAO.mjs"
import Utente from "../components/Utente.mjs";
import crypto from "crypto";

export default function UtenteController(){

    const utenteDAO = new UtenteDAO();

    this.getUtente = async(username, password) => {
        return await utenteDAO.getUtente(username, password);
    }

    this.getUtenteByUsername = async(username) => {
        return await utenteDAO.getUtenteByUsername(username);
    }

    this.addUtente = async (username, password) => {
        const salt = crypto.randomBytes(16).toString('hex');
    
        return new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, 32, async(err, hashedPassword) => {
                if (err) {
                    reject("Error in hashing password");
                } else {
                    try {
                        const utente = await utenteDAO.addUtente(username, hashedPassword.toString("hex"), salt);
                        resolve(utente);
                    } catch (err) {
                        reject(err);
                    }
                }
            });
        });
    };
    


}