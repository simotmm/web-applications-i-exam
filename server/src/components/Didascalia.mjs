export default function Didascalia(didascaliaID, testo){
    this.didascaliaID = didascaliaID;
    this.testo = testo;

    this.toJSON = () => {
        return { ...this };
    }
}