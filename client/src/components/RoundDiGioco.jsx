import { Button, ListGroup, Row, Col, Alert, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
const SERVER_URL = "http://localhost:3001/";

function RoundDiGioco(props){
    let partita = props.partita; //dati
    let round = props.round;
    let indiceRound = props.indiceRound;
    let tempoRimasto = props.tempoRimasto;
    let durataPostRound = props.durataPostRound;

    let saltaCountDownAggiuntivo = props.saltaCountDownAggiuntivo; //funzioni
    let gestisciDidascaliaSelezionata = props.gestisciDidascaliaSelezionata;

    let mostraFeedBack = props.mostraFeedBack;
    let messaggioFeedback = props.messaggioFeedback;
    let varianteMessaggioFeedback=props.varianteMessaggioFeedback;

    let ultimoRound = partita && indiceRound == partita.rounds.length-1;
    let testoBottoneSkip = ultimoRound? "vai al resoconto partita" : "vai al prossimo round";

    return (
        <Row>
            <Col className='justify-content-center mt-5'>
                {mostraFeedBack && 
                (<FeedbackDidascalie messaggio={messaggioFeedback} 
                    variante={varianteMessaggioFeedback} 
                    didascalie={round.didascalieCorrette}
                    didascaliaSelezionata={round.didascaliaSelezionata}>
                </FeedbackDidascalie>)}
            </Col>

            <Col md={8}>
                <h5>Partita in corso</h5>
                <h6>Punteggio totale corrente: {partita.punteggio}</h6>
                <Card>
                    <Card.Body>
                        <Row className="justify-content-center align-items-center">
                            <Card.Body>
                                <Card.Title> Round {indiceRound+1} </Card.Title>
                                <h6>Punteggio round: {round.punteggio}</h6>
                                <CountDown tempoRimasto={tempoRimasto}
                                    durataPostRound={durataPostRound}
                                    ultimoRound={ultimoRound}
                                    indiceRound={indiceRound}>
                                </CountDown>
                            </Card.Body>
                            <Col md={6} className="justify-content-center align-items-center" >
                                <Card.Img className="border" rounded src={SERVER_URL+round.meme.nomeFile}/>
                            </Col>

                            <Col>
                                <p>Seleziona una didascalia</p>
                                <ListaDidascalie didascalie={round.didascalie}
                                        gestisciDidascaliaSelezionata={gestisciDidascaliaSelezionata}
                                        tempoRimasto={tempoRimasto}
                                        durataPostRound={durataPostRound}>
                                </ListaDidascalie>

                                <Row className='justify-content-center mt-2'>
                                    
                                    <Col className="d-flex justify-content-center align-items-center">
                                        {mostraFeedBack && (
                                        <BottonePiccolo funzione={saltaCountDownAggiuntivo} testo={testoBottoneSkip}></BottonePiccolo>
                                        )}
                                    </Col>
                                    
                                </Row>
                                
                            </Col>  
                        </Row>
                    </Card.Body>
                </Card>
                
            </Col>

            <Col></Col>
        </Row>
    );

}

function CountDown(props){
    let tempoRimasto = props.tempoRimasto;
    let durataPostRound = props.durataPostRound;
    let ultimoRound = props.ultimoRound;

    let testoCountDown;
    if(tempoRimasto > durataPostRound) // se il round è in corso...
        testoCountDown = "Round in corso. Tempo rimasto: "
    else
        testoCountDown = ultimoRound? "Round terminato. Resoconto partita tra: " : "Round terminato. Prossimo round tra: "

    let tempo = tempoRimasto > durataPostRound ? tempoRimasto - durataPostRound : tempoRimasto;

    return (
        <p>{testoCountDown}{tempo}</p>
    );

}

function ListaDidascalie(props){
    let didascalie = props.didascalie;
    let gestisciDidascaliaSelezionata = props.gestisciDidascaliaSelezionata;
    let disabilitaClick = props.tempoRimasto<=props.durataPostRound;
    
    return (
        <ListGroup>
            {didascalie.map(didascalia => (
            <ListGroup.Item key={didascalia.didascaliaID}
                action variant="primary"
                onClick={() => gestisciDidascaliaSelezionata(didascalia.didascaliaID)} 
                disabled={disabilitaClick}> 
                    {didascalia.testo} 
            </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

function FeedbackDidascalie(props){
    const messaggio = props.messaggio;
    const variante = props.variante; // se la didascalia selezionata è corretta non vengono mostrate le tutte le didascalie corrette del round ma solo quella selezionata
    const didascalie = props.didascalie; 
    const didascaliaSelezionata = variante=="success"? props.didascaliaSelezionata : null;

    return didascaliaSelezionata?
        (<Alert variant={variante} className="mt-2 mr-2"> 
            {messaggio}
            <ListGroup>
                <ListGroup.Item className="bg-transparent" variant={variante}>{didascaliaSelezionata.testo}</ListGroup.Item>
            </ListGroup>
        </Alert>)
        :
        (
            <Alert variant={variante} className="mt-2 mr-2"> 
                {messaggio}
                {didascalie.map((didascalia, index) => (
                    <ListGroup >
                        <ListGroup.Item className="bg-transparent" variant={variante} key={index}>{didascalia.testo}</ListGroup.Item>
                    </ListGroup>
                    
                ))}
            </Alert>
        );
}

function BottonePiccolo(props){
    return (
        <Button size="sm" variant="outline-primary" onClick={props.funzione}>{props.testo}</Button>
    );
}

export default RoundDiGioco;