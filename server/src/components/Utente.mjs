export default function Utente(utenteID, username){
    this.utenteID = utenteID;
    this.username = username;

    this.toJSON = () => {
        return { ...this };
    }
    
}
