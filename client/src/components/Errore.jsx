import {Row, Col, Button} from "react-bootstrap";
import {Link} from "react-router-dom";

export default function PaginaNonTrovata() {
    return(
        <Row>
            <Col></Col>
            <Col md={2}>
                <h3>Errore</h3>
                <h5>404... pagina inesistente</h5>
                <br/> <br/>
                <Button mb={3} as={Link} to="/" variant="primary" className="text-white mb-2 me-4">Torna alla home</Button>
            </Col>
            <Col></Col>
        </Row>
    );
}