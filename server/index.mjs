import express from "express";
import morgan from "morgan";
import cors from "cors";

import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import { check, validationResult } from "express-validator";

import UtenteController from "./src/controllers/utenteController.mjs"
import PartitaController from "./src/controllers/partitaController.mjs"


/*** configurazione ***/

//inizializzazione di express
const app = new express();
const port = 3001;

const utenteController = new UtenteController();
const partitaController = new PartitaController();
const percorsoImmagini = "public/images/"

app.use(express.json());
app.use(morgan("dev"));
const corsOptions = {   //cors per cross origin, il client è alla porta 5173 e manda le richieste al server alla porta 3001
    origin: "http://localhost:5173",
    optionSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.static(percorsoImmagini)); //route statica per le immagini 

//local strategy di express per login e controllo della sessione
passport.use(new LocalStrategy(async function verify(username, password, callback){
    const utente = await utenteController.getUtente(username, password);
    if(!utente) 
        return callback(null, false, "username o password non corretti");
    return callback(null, utente);
}));
passport.serializeUser(function(utente, callback){
    callback(null, utente); // quando avviene il login l'utente viene salvato nella sessione nell'interezza dei suoi campi
});
passport.deserializeUser(function(utente, callback){
    return callback(null, utente); //deserialize prende l'identificatore dell'utente nella sessione e restituisce l'oggetto intero, in questo caso coincidono
});

app.use(session({
    secret: "...inizializzazione della sessione...",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.authenticate("session"));

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) return next();
    return res.status(401).json({error: "non autorizzato"});
};


//validazione dei campi
const onValidationErrors = (validationResult, res) => {
    const errors = validationResult.formatWith(errorFormatter);
    console.error(errors);
    return res.status(422).json({validationErrors: errors.mapped()});
};
//mantiene solo il messaggio nella richiesta
const errorFormatter = ({msg}) => {
    return msg;
};
//validazione credenziali per login e registrazione
const validazioneCredenziali = [
    check("username").isString().notEmpty().withMessage("Il campo 'username' deve essere una stringa non vuota"),
    check("password").isString().notEmpty().withMessage("Il campo 'password' deve essere una stringa non vuota")
];
//validazione dei campi della partita per POST /nuovaPartita
const validazionePartita = [
    check("utenteID").isInt().withMessage("Il campo 'utenteID' deve essere un numero intero non nullo"),
    check("punteggio").isInt().withMessage("Il campo 'punteggio' deve essere un numero intero non nullo"),
    check("rounds").isArray().withMessage("Il campo 'rounds' deve essere un array"),
    check("rounds.*.punteggio").isInt().withMessage("Il campo 'punteggio' di ogni round deve essere un numero intero non nullo"),
    check("rounds.*.meme.memeID").isInt().withMessage("Il campo 'memeID' dell'oggetto 'meme' di ogni round deve essere un numero intero non nullo"),
    check("rounds.*.meme.nomeFile").isString().notEmpty().withMessage("Il campo 'nomeFile' dell'oggetto 'meme' di ogni round non può essere vuoto"),
    check("rounds.*.didascalie").isArray().withMessage("Il campo 'didascalie' di ogni round deve essere un array"),
    check("rounds.*.didascalie.*.didascaliaID").isInt().withMessage("Il campo 'didascaliaID' di ogni didascalia di ogni round deve essere un numero intero non nullo"),
    check("rounds.*.didascalie.*.testo").isString().notEmpty().withMessage("Il campo 'testo' di ogni didascalia di ogni round non può essere vuoto"),
    check("rounds.*.didascalieCorrette").isArray().withMessage("Il campo 'didascalieCorrette' di ogni round deve essere un array"),
    check("rounds.*.didascalieCorrette.*.didascaliaID").isInt().withMessage("Il campo 'didascaliaID' di ogni didascaliaCorretta di ogni round deve essere un numero intero non nullo"),
    check("rounds.*.didascalieCorrette.*.testo").isString().notEmpty().withMessage("Il campo 'testo' di ogni didascaliaCorretta di ogni round non può essere vuoto"),
    check("rounds.*.didascaliaSelezionata.didascaliaID").optional().isInt().withMessage("Il campo 'didascaliaID' dell'oggetto 'didascaliaSelezionata' di ogni round deve essere un numero intero"),
    check("rounds.*.didascaliaSelezionata.testo").optional().isString().notEmpty().withMessage("Il campo 'testo' dell'oggetto 'didascaliaSelezionata' di ogni round non può essere vuoto"),
];
//validazione del risultato della partita per POST /nuovaPartita. il punteggio calcolato nel front-end deve essere uguale a quello calcolato nel back-end
const validazioneRisultatoPartita = (partita) => {
    let punteggioPartita=0;
    for(let round of partita.rounds){
        let punteggioRound = 0;
        if(round.didascaliaSelezionata)
            punteggioRound = round.didascalieCorrette.map(d => d.didascaliaID).includes(round.didascaliaSelezionata.didascaliaID)? 5 : 0;
        if(punteggioRound!=round.punteggio)
            return false;
        punteggioPartita += punteggioRound;
    }
    return punteggioPartita==partita.punteggio;
}

/*** API Utenti ***/
//POST /api/sessions (login)
app.post("/api/sessions", validazioneCredenziali, function(req, res, next) {
    
    const errori = validationResult(req);
    if(!errori.isEmpty())
        return onValidationErrors(errori, res);

    passport.authenticate("local", (err, user, info) => {
        if (err)
            return next(err);
        if (!user) 
             return res.status(401).send(info);

        req.login(user, (err) => {
            if (err)
                return next(err);
          
            return res.status(200).json(req.user);
        });
    })(req, res, next);
  });

//POST /api/nuovoUtente (registrazione)
app.post("/api/nuovoUtente", validazioneCredenziali, async(req, res) =>{
    const errori = validationResult(req);
    if(!errori.isEmpty())
        return onValidationErrors(errori, res);

    if(await utenteController.getUtenteByUsername(req.body.username)) 
        return res.status(409).json({error: "username non disponibile, inserire un username diverso"});

    try{
        const utente = await utenteController.addUtente(req.body.username, req.body.password);
        return res.status(201).json({...utente});
    }
    catch(err){
        console.error("errore server: "+err.message);
        return res.status(500).json({error: "Impossibile registrare l'utente."});
    }
});

//GET /api/sessions/current (controlla se l'utente è loggato)
app.get("/api/sessions/current", (req, res) => {
    if(req.isAuthenticated()) 
        return res.status(200).json(req.user);
    else 
        return res.status(401).json({error: "non autenticato"});
});

// DELETE /api/sessions/current (logout)
app.delete("/api/sessions/current", (req, res) => {
    req.logout(() => { 
        return res.status(204).end(); 
    });
});


/*** API Partite ***/
//GET /api/nuovaPartita (generazione nuova partita)
app.get("/api/nuovaPartita", async(req, res) => {
    try{
        const user = isLoggedIn? req.user : null;
        const nuovaPartita = await partitaController.nuovaPartita(user);
        return res.status(200).json(nuovaPartita);
    } 
    catch{
        return res.status(500).end();
    }
});

//controllo sulla data
function isValidISOString(dateString) {
    const d = new Date(dateString);
    return d instanceof Date && !isNaN(d);
}

//POST /api/nuovaPartita (salvataggio partita appena finita)
app.post("/api/nuovaPartita", isLoggedIn, validazionePartita, async(req, res) => {

    const errori = validationResult(req);
    if(!errori.isEmpty())
        return onValidationErrors(errori, res);

    if(!validazioneRisultatoPartita(req.body))
        return res.status(409).json({ message: "Impossibile salvare la partita. Il risultato non è valido secondo le regole"});

    try{
        if(!req.body.data || !isValidISOString(req.body.data))
            req.body.data = new Date().toISOString();
        await partitaController.salvaPartita(req.body);
        return res.status(201).json({ message: "Partita salvata correttamente", data: req.body });
    }
    catch(err){
        console.error("ERRORE: "+err.message);
        return res.status(500).json({error: "Impossibile salvare la partita."});
    }
});

//GET /api/cronologiaPartite (cronologia delle partite dell'utente loggato (no parametri id, basta req.user))
app.get("/api/cronologiaPartite", isLoggedIn, async(req, res) => {
    try{
        const partite = await partitaController.getPartite(req.user);
        return res.status(200).json(partite);
    }
    catch{
        return res.status(500).end();
    }
});

/*** attivazione del server ***/
app.listen(port, () => {
  console.log("Server listening at http://localhost:"+port);
});
