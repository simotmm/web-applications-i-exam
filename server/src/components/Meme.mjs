export default function Meme(memeID, nomeFile){
    this.memeID = memeID;
    this.nomeFile = nomeFile;

    this.toJSON = () => {
        return { ...this };
    }
}

