import React from 'react';
import { Col, Card, ListGroup } from 'react-bootstrap';
import "../App.css";
const SERVER_URL = "http://localhost:3001/";

export default function CardMeme(props){
    const round = props.round;
    const didascalia = round.didascaliaSelezionata? '"'+round.didascaliaSelezionata.testo+'"' : "nessuna";

    return (
        <Col className="d-flex justify-content-center align-items-center card-meme-container">
            <Card className="card-meme">
                <Card.Body className="card-text-center">
                    <Card.Subtitle>Round {round.numero + 1}</Card.Subtitle>
                    <Card.Text>Punti ottenuti: {round.punteggio}</Card.Text>
                </Card.Body>   
                <Card.Img src={SERVER_URL + round.meme.nomeFile} className="card-img-2" />
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                        {round.punteggio === 5 ? (
                            <span className="card-icon">✅</span>
                        ) : (
                            <span className="card-icon">❌</span>
                        )}
                        Didascalia selezionata: {didascalia}
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
    );
};

