import { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from "../API.mjs";
import RoundDiGioco from './RoundDiGioco';
import CardMeme from './CardMeme';
import CaricamentoSpinner from './CaricamentoSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import PartitaModel from '../models/Partita.mjs';

function Partita(props) { //alla fine di ogni round deve essere mostrato un messaggio di resoconto. per mostrare il messaggio senza che cominci il round
    const durataPrevistaRound = 30;      //successivo o senza che la partita finisca il timer è aumentato di 'durataPostRound' secondi, durante i quali non è possibile
    const durataPostRound = 6;           //selezionare una didascalia e viene mostrato il messaggio di feedback. questo breve countdown aggiuntivo si può saltare.
    const durataRound = durataPrevistaRound + durataPostRound; //il tempo visualizzato nel countdown durante il round è quello previsto (30 secondi).

    const utente = props.utente;

    const [partita, setPartita] = useState(null);
    const [round, setRound] = useState(null);
    const [indiceRound, setIndiceRound] = useState(0);

    const [tempoRimasto, setTempoRimasto] = useState(durataRound);
    const [partitaFinita, setPartitaFinita] = useState(false);
    const [roundFinito, setRoundFinito] = useState(false);
    const [error, setError] = useState(null);

    const [messaggioFeedback, setMessaggioFeedback] = useState(null);
    const [varianteMessaggioFeedback, setVarianteMessaggioFeedback] = useState("info");
    const [mostraFeedBack, setMostraFeedBack] = useState(false);

    // Funzione per iniziare una nuova partita 
    const iniziaNuovaPartita = async () => {       // settare lo stato iniziale solo in fase di dichiarazione non va bene perchè dalla stessa pagina /nuovaPartita si  
        try {                                      // può selezionare "gioca ancora" per iniziare una nuova partita, per evitare di farlo usando  un auto-refresh 
            let p = await API.getNuovaPartita(); // della pagina si settano gli stati iniziali con questa funzione
            p = {...p, punteggio: 0}
            setPartita(p);
            //inizialmente era "setPartita(new PartitaModel(p.partitaID, p.utenteID, p.rounds, p.punteggio, p.data));", i dati venivano aggiornati ma poi nella fetch no.
            setRound(p.rounds[0]);
            setIndiceRound(0);
            setTempoRimasto(durataRound);
            setPartitaFinita(false);
            setRoundFinito(false);
            setMessaggioFeedback(null);
            setMostraFeedBack(false);
        } catch (error) {
            setError(error.message);
        }
    };

    // set nuova partita
    useEffect(() => {
        iniziaNuovaPartita();
    }, []); //chiamata una volta all'inizio

    // salvataggio partita per utente loggato
    useEffect(() => {
        const fetchSalvaPartita = async () => {
            try {
                if (partita && partitaFinita && utente) {
                    const partitaDaSalvare = {...partita, data: new Date().toISOString()};
                    await API.postNuovaPartita(partitaDaSalvare);
                    console.log("Partita salvata con successo");
                }
            } catch (err) {
                setError(err.message);
                console.error("Errore durante il salvataggio della partita:", err.message);
            }
        };

        fetchSalvaPartita(); 
    }, [partitaFinita]); //ogni volta che partitaFinita cambia stato viene chiamata questa fetch

    // set round corrente
    useEffect(() => {
        if (partita && indiceRound < partita.rounds.length) {
            setRoundFinito(false);
            setRound(partita.rounds[indiceRound]);
            setMessaggioFeedback(null);
        }
    }, [indiceRound, partita]); //chiamata quando cambia l'indice del round

    // gestione tempo durante il gioco
    useEffect(() => {
        if (tempoRimasto > 0 && !partitaFinita) {
            const timer = setInterval(() => {
                setTempoRimasto(corrente => corrente - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (tempoRimasto === 0) {
            gestisciFineRound();
        }
    }, [tempoRimasto, partitaFinita]); //timer: viene chiamata ogni volta che tempo rimasto cambia (ricorsione)

    //gestione messaggi di feedback alla fine del round
    useEffect(()=>{
        if(round && round.didascaliaSelezionata){
            if(round.punteggio === 5){
                setMessaggioFeedback("Round terminato, risposta corretta! +5 punti ottenuti.");
                setVarianteMessaggioFeedback("success");
            }
            else{
                setMessaggioFeedback("Round terminato, risposta sbagliata. 0 punti ottenuti. Risposte corrette: ");
                setVarianteMessaggioFeedback("danger");
            }
        } 
        if(tempoRimasto <= durataPostRound){
            setMostraFeedBack(true);
            if (!round.didascaliaSelezionata) {
                setMessaggioFeedback("Round terminato, risposta non data. 0 punti ottenuti. Risposte corrette: ");
                setVarianteMessaggioFeedback("secondary");
            }
        }
        else{
            setMostraFeedBack(false);
        }
    }, [round, roundFinito, tempoRimasto]); // viene chiamata alla fine di ogni round

    // selezione della didascalia
    const gestisciDidascaliaSelezionata = (didascaliaID) => {
        const didascaliaSelezionata = round.didascalie.find(d => d.didascaliaID === didascaliaID);
        const punteggio = round.didascalieCorrette.map(d => d.didascaliaID).includes(didascaliaSelezionata.didascaliaID) ? 5 : 0;
        const nuovoRound = {
            ...round, 
            punteggio: punteggio,
            didascaliaSelezionata: didascaliaSelezionata
        };
        setRound(nuovoRound);

        const nuoviRounds = [...partita.rounds];
        nuoviRounds[indiceRound] = nuovoRound;
        const nuovaPartita = {
            ...partita, 
            rounds: nuoviRounds,
            punteggio: partita.punteggio+nuovoRound.punteggio,
        };
        setPartita(nuovaPartita);
        
        setTempoRimasto(durataPostRound);
    }; // viene chiamata ogni volta che si clicca su una didascalia

    const saltaCountDownAggiuntivo = () => {
        setTempoRimasto(0);
    }; // viene chiamata ogni volta che si clicca sul pulsante di skip del countdown post round

    const gestisciFineRound =() => { 
        if(!round.didascaliaSelezionata){
            const didascaliaSelezionata = null;
            const punteggio = 0;
            const nuovoRound = {
                ...round, 
                punteggio: punteggio, 
                didascaliaSelezionata: didascaliaSelezionata
            };
            setRound(nuovoRound);

            const nuoviRounds = [...partita.rounds];
            nuoviRounds[indiceRound] = nuovoRound;
            const nuovaPartita = {
                ...partita, 
                rounds: nuoviRounds,
                punteggio: partita.punteggio+nuovoRound.punteggio,
            };
            setPartita(nuovaPartita);
        }

        setRoundFinito(true);
        setMessaggioFeedback(null);
        if (indiceRound<partita.rounds.length-1) {
            setIndiceRound(indiceRound + 1);
            setTempoRimasto(durataRound);
        } else {
            console.log("partita finita...");
            setPartitaFinita(true);
        }
    };

    if (!partita || !round) {
        return (<CaricamentoSpinner elemento={!partita? "partita":"round"}></CaricamentoSpinner>);
    }

    return (
        <Container>
            {!partitaFinita ? (  
                <>
                <RoundDiGioco 
                    partita={partita}
                    round={round}
                    indiceRound={indiceRound}
                    utente={utente}
                    tempoRimasto={tempoRimasto}
                    durataPostRound={durataPostRound}
                    saltaCountDownAggiuntivo={saltaCountDownAggiuntivo}
                    gestisciDidascaliaSelezionata={gestisciDidascaliaSelezionata}
                    mostraFeedBack={mostraFeedBack}
                    messaggioFeedback={messaggioFeedback}
                    varianteMessaggioFeedback={varianteMessaggioFeedback}>
                </RoundDiGioco>
                
                <Row>
                    <Col></Col>
                    <Col md={8}>
                        <div class="mt-3" >
                            <Button as={Link} to="/" variant="primary" className="text-white">Abbandona partita</Button>
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
                </>
            ) 
            : 
            (
                <>
                <RiepilogoPartita partita={partita} mostraRoundPersi={false} mostraData={false} messaggioPartitaPersa={true}/>
                <Row>
                    <Col></Col>
                    <Col md={9}>
                        <div class="mt-3" >
                            <BottoniFinePartita utente={utente} iniziaNuovaPartita={iniziaNuovaPartita}></BottoniFinePartita>
                        </div>
                    </Col>
                    <Col></Col>
                </Row>
                </>
            )}
        </Container>
    );
}

function RiepilogoPartita(props){
    const punteggioPartita = props.partita.punteggio;
    let rounds = props.partita.rounds.map((round, index) => {
        return { ...round, numero: index };
    }); // aggiunta di un campo provvisorio che identifica il numero del round
    const roundVinti = rounds.filter(round => round.punteggio == 5);
    const mostraRoundPersi = props.mostraRoundPersi;
    rounds = !mostraRoundPersi? roundVinti : rounds;
    const intestazione = !mostraRoundPersi? "Round vinti:" : "Round:";
    const mostraLinea = (roundVinti.length> 0 && !mostraRoundPersi) || mostraRoundPersi;
    let data = null;
    if(props.mostraData && props.partita.data)
        data = new Date(props.partita.data).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

    return (
        <Row className='mb-3'>
            <Col></Col>

            <Col md={9}>
                <Card  >
                    <Card.Body>
                        <Row>
                            <TitoloCardPartita data={data}></TitoloCardPartita>
                            <Card.Subtitle>Totale punti ottenuti: {punteggioPartita} </Card.Subtitle>
                            {punteggioPartita == 0 && props.messaggioPartitaPersa && <Card.Text>
                                Non hai abbinato correttamente nessuna didascalia a nessun meme.<br/>
                                Ritenta, la fortuna è dalla tua parte!
                            </Card.Text>}
                        </Row>

                        {mostraLinea && <><hr/><h6>{intestazione}</h6></>} {/* linea di demarcazione "round vinti:" nel caso in cui ci siano round da mostrare */}
                        
                        <Row className="justify-content-center align-items-center">
                            {rounds.map((round) => (
                                <CardMeme round={round}></CardMeme>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            </Col>

            <Col></Col>
        </Row>
    );

}

function TitoloCardPartita(props){
    return ( 
        props.data? (<Card.Title>Partita del {props.data}</Card.Title>) : (<Card.Title>Riepilogo Partita</Card.Title>)
    );
}

function BottoniFinePartita(props) {
    return (
        <Row className="justify-content-center align-items-center text-center">
            <Col>
                <Button onClick={props.iniziaNuovaPartita} variant="primary" className="text-white">Gioca ancora</Button>
            </Col>
            {props.utente &&
            <Col>
                <Button as={Link} to="/cronologiaPartite" variant="primary" className="text-white">Cronologia partite</Button>
            </Col>}
            <Col>
                <Button as={Link} to="/" variant="primary" className="text-white">Torna alla home</Button>
            </Col>
        </Row>
    );
}

export default Partita;
export { RiepilogoPartita };