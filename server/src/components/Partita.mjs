export default function Partita(partitaID, utenteID, rounds, punteggio, data){
    this.partitaID = partitaID;
    this.utenteID = utenteID;
    this.rounds = rounds;
    this.punteggio = punteggio;
    this.data = data;

    this.toJSON = () => {
        return { ...this };
    }

    this.stampaPartita = () => {
        let data = this.data? this.data.split("T")[0] : this.data;
        
        console.log("partita:\n"+
            "partitaID: "+ this.partitaID+
             ", utenteID: "+ this.utenteID+ 
             ", punteggio: "+ this.punteggio+ 
             ", data: "+ data);
        let i=0;
        if(!this.rounds) return;
        for(let r of this.rounds){
            console.log("round #"+ (++i)+":");
            r.stampaRound();
        }
        console.log();
    }
    
    
}