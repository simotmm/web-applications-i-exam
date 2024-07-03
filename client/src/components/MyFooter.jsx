import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const MyFooter = () => {
  return (
    <footer className="footer bg-primary text-light myfooter">
      <Container>
        <Row>
          <Col>
          </Col>
          <Col md={5}>
            <br></br>
            <h5>What Do You Meme?</h5>
            <ul className="list-unstyled">
              <li>Simone Tumminelli, Applicazioni Web I </li>
              <li>Politecnico di Torino, 2023-2024</li>
            </ul>
          </Col>
          <Col>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default MyFooter;
