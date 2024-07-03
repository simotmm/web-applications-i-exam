import { useEffect, useState } from "react";
import { ListGroup, Container, Row, Col, Image, Alert, Form, Button } from 'react-bootstrap';
import { RiepilogoPartita } from "./Partita";
import { Link } from "react-router-dom";
import CaricamentoSpinner from "./CaricamentoSpinner";
import API from "../API.mjs";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CronologiaPartite(props) {
    const [partite, setPartite] = useState(null);
    const [error, setError] = useState(null);
    const [ordine, setOrdine] = useState('desc'); // ordinamento default dalla partita più recente
    const [roundTotali, setRoundTotali] = useState(0);
    const [puntiTotali, setPuntiTotali] = useState(0);
    const [risposteCorretteTotali, setRisposteCorretteTotali] = useState(0);
    const [mostraStatistiche, setMostraStatistiche] = useState(false);
    
    useEffect(() => {
        const fetchCronologiaPartite = async () => {
            try {
                let partiteDalDB = await API.getCronologiaPartite();
                partiteDalDB = ordinaPartite(partiteDalDB, ordine);
                
                let totali = 0;
                let corrette = 0;
                let punti = 0;
                if(partiteDalDB && partiteDalDB.length>0){
                    for (let partita of partiteDalDB) {
                        totali += partita.rounds.length;
                        for (let round of partita.rounds) {
                            corrette += round.punteggio === 5 ? 1 : 0;
                            punti += round.punteggio;
                        }
                    }
                }
                setPartite(partiteDalDB);
                setRoundTotali(totali);
                setPuntiTotali(punti);
                setRisposteCorretteTotali(corrette);
                setMostraStatistiche(partiteDalDB && partiteDalDB.length>0);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchCronologiaPartite();
    }, []);

    useEffect(() => {
        if (partite) {
            setPartite(ordinaPartite(partite, ordine));
        }
    }, [ordine]);

    const handleOrdineChange = (event) => {
        setOrdine(event.target.value);
    };

    const ordinaPartite = (partite, ordine) => {
        return partite.slice().sort((a, b) => {
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);
            return ordine === 'desc' ? dataB - dataA : dataA - dataB;
        });
    };

    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    if (!partite)
        return (<CaricamentoSpinner elemento={"pagina del profilo"}></CaricamentoSpinner>);

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col md={9}>
                    <Row>
                        <Col>
                            <h3>Pagina del profilo: @{props.utente.username}</h3> <br/>
                            <h4>Cronologia partite</h4> <br/>
                            {mostraStatistiche && 
                                <p>Totale partite giocate: {partite.length} <br/>
                                Punti totali: {puntiTotali} <br/>
                                Round totali: {roundTotali} <br/>
                                Risposte corrette totali: {risposteCorretteTotali}<br/>
                                Percentuale di risposta corretta: {roundTotali>0? (100*risposteCorretteTotali/roundTotali).toFixed(1) : 0}%
                            </p>}
                            {!mostraStatistiche &&  <><p>Non hai ancora giocato nessuna partita</p> <br></br>
                            <Button as={Link} to="/nuovaPartita" variant="primary" className="text-white">Nuova Partita</Button></>}
                            
                        </Col>
                        <Col className="d-flex flex-column justify-content-end align-items-end">
                            <Button mb={3} as={Link} to="/" variant="primary" className="text-white mb-2 me-4">Torna alla home</Button>
                        </Col>
                    </Row>
                </Col>
                {partite && partite.length>0 && (
                    <Col>
                        <Form.Group controlId="formOrdine">
                            <Form.Label>Ordina partite</Form.Label>
                            <Form.Control as="select" value={ordine} onChange={handleOrdineChange}>
                                <option value="desc">dalla più recente</option>
                                <option value="asc">dalla più vecchia</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                )}
            </Row>
            <Row>
                {partite && partite.map((partita, index) => (
                    <RiepilogoPartita key={index} partita={partita} mostraRoundPersi={true} mostraData={true} messaggioPartitaPersa={false}/> 
                ))}
            </Row>
        </Container>
    );
}
