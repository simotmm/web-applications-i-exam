export default function UtenteModel(utenteID, username){
    this.utenteID = utenteID;
    this.username = username;

    this.toJSON = () => {
        return { ...this };
    }
    
}
