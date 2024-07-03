import MemeModel from "./Meme.mjs";
import DidascaliaModel from "./Didascalia.mjs";

export default function RoundModel(roundID, meme, didascalie, didascalieCorrette, didascaliaSelezionata, punteggio){
    this.roundID = roundID;
    this.meme = meme && new MemeModel(meme.memeID, meme.nomeFile);
    this.didascalie = didascalie && didascalie.map(d => new DidascaliaModel(d.didascaliaID, d.testo));
    this.didascalieCorrette = didascalieCorrette && didascalieCorrette.map(d => new DidascaliaModel(d.didascaliaID, d.testo));
    this.didascaliaSelezionata = didascaliaSelezionata && new DidascaliaModel(didascaliaSelezionata.didascaliaID, didascaliaSelezionata.testo);
    this.punteggio = punteggio;

    this.toJSON = () => {
        return { ...this };
    };

    this.stampaRound = () => {
        let didascaliaSelezionata = this.didascaliaSelezionata? this.didascaliaSelezionata.testo : this.didascaliaSelezionata;
        console.log("punteggio: "+this.punteggio);
        console.log("meme: ", this.meme.nomeFile);
        console.dir("didascalie: "); stampaDidascalie(this.didascalie);
        console.dir("didascalie corrette: "); if(this.didascalieCorrette) stampaDidascalie(this.didascalieCorrette); else console.log(null);
        console.log("didascalia selezionata: '"+didascaliaSelezionata+"'");
    };
    
    const stampaDidascalie = (dd) => {
        let i=0;
        for(let d of dd)
            console.log("  didascalia #"+(++i)+": '"+d.testo+"'");
    } 
    
}