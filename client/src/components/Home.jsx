
import {React, useState} from 'react';
import Button from "react-bootstrap/Button"
import { Link } from 'react-router-dom';
import { Row, Col, Image, Modal } from 'react-bootstrap';
import MyFooter from './MyFooter';
import "../App.css"
const SERVER_URL = "http://localhost:3001/"

function Home() {
    const [mostraModale, setMostraModale] = useState(false);

    return (
        <Row className='justify-content-center align-items-center text-center row'>
            <Col></Col>

            <Col mb={9} className="justify-content-center align-items-center">
                <Row className='justify-content-center align-items-center text-center'>
                    <Banner></Banner>
                </Row>
                <Row className='justify-content-center align-items-center text-center'>
                    <Col className="justify-content-center align-items-center">
                        <Button as={Link} to="/nuovaPartita" variant="primary" className="text-white">Nuova Partita</Button>
                    </Col >
                    <Col className="justify-content-center align-items-center text-center">

                        <Button variant="primary" onClick={() => setMostraModale(true)}>
                            Istruzioni di gioco
                        </Button>
                        <ModaleRegoleGioco
                            show={mostraModale}
                            onHide={() => setMostraModale(false)}
                        >
                        </ModaleRegoleGioco>
                    </Col>
                </Row>
            </Col>
            <Col></Col>
            <MyFooter></MyFooter>
        </Row>
        
    );

}

function Banner(){
    const file = "banner.png"
    return (
        <Col className="banner-container justify-content-center align-items-center text-center row" >
            <Image className="blur-border" src={SERVER_URL+file}></Image>
        </Col>
        
    );
}


function ModaleRegoleGioco(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>  
                <Modal.Title id="contained-modal-title-vcenter">What Do You Meme?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Regole di gioco</h4>
                <p>
                    Abbina al meglio didascalie a immagini di meme! <br/>
                    Ogni round di ogni partita propone un'immagine di meme e sette possibili didascalie, hai 30 secondi per scegliere quella più appropriata. 
                    Tra le sette didascalie solo due sono appropriate. <br/>
                    Se la didascalia scelta è corretta guadagni 5 punti, altrimenti 0. <br/>
                    Le partite per gli ospiti sono composte da un solo round. Accedi o registrati per giocare partite da tre round e avere a disposizione
                    la cronologia completa delle tue partite. <br/>
                    Buon divertimento!
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button as={Link} to="/nuovaPartita" variant="primary" className="text-white">Nuova Partita</Button>
                <Button onClick={props.onHide}>Chiudi</Button>
            </Modal.Footer>
        </Modal>
    );
}


export default Home;
