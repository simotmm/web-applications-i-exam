export default function DidascaliaModel(didascaliaID, testo){
    this.didascaliaID = didascaliaID;
    this.testo = testo;

    this.toJSON = () => {
        return { ...this };
    }
}