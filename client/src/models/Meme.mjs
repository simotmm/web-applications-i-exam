export default function MemeModel(memeID, nomeFile){
    this.memeID = memeID;
    this.nomeFile = nomeFile;

    this.toJSON = () => {
        return { ...this };
    }
}

