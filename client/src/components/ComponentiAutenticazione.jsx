/* NEW */
import { useState } from 'react';
import { Form, Button, Row, Col, Card, FloatingLabel} from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';


function AccediForm(props){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        const credenziali = {username, password};
        props.accedi(credenziali); 
    };

    return (
        <Row >
            <Col></Col>
            <Col md={3} >
                <Card className='text-center-align'>
                    <Card.Body>
                        <Card.Title>Accedi</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <FloatingLabel controlId="username" label="username" className="mb-3">
                                <Form.Control type="username" placeholder="username" value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                            </FloatingLabel>
                            <FloatingLabel controlId="password" label="Password">
                                <Form.Control type="password" placeholder="password" value={password} onChange={ev => setPassword(ev.target.value)} required={true} />
                            </FloatingLabel>
                            <Button variant="primary" type="submit">Accedi</Button>
                            <Link className='btn btn-danger mx-2 my-2' to={'/'}>Indietro</Link>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col></Col>
        </Row>
    );
    
}

function LogoutButton(props) {
    return(
      <Button className='btn btn-outline-light' variant='outline-light' onClick={props.esci}>Esci</Button>
    )
}

function RegistratiForm(props){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registrato, setRegistrato] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const utente = {username, password};
        props.registrati(utente);
        setRegistrato(true);
    }

    if(registrato)
        return (<Navigate to ="/"/>);

    return (
        <Row >
            <Col></Col>
            <Col md={3} >
                <Card className='text-center-align'>
                    <Card.Body>
                        <Card.Title>Registrati</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <FloatingLabel controlId="username" label="username" className="mb-3">
                                <Form.Control type="username" placeholder="username" value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                            </FloatingLabel>
                            <FloatingLabel controlId="password" label="Password">
                                <Form.Control type="password" placeholder="password" value={password} onChange={ev => setPassword(ev.target.value)} required={true} />
                            </FloatingLabel>
                            <Button variant="primary" type="submit">Registrati</Button>
                            <Link className='btn btn-danger mx-2 my-2' to={'/'}>Indietro</Link>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col></Col>
        </Row>
    );
}


export { AccediForm, RegistratiForm, LogoutButton};