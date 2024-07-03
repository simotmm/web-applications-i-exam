
import { useEffect, useState } from 'react'
import Row from "react-bootstrap/Row"
import Container from 'react-bootstrap/esm/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import MyHeader from './components/MyHeader'
import Errore from "./components/Errore"
import { Routes, Route, Outlet, Navigate, useNavigate} from 'react-router-dom'
import { AccediForm, RegistratiForm } from './components/ComponentiAutenticazione.jsx'
import API from "./API.mjs";
import Alert from "react-bootstrap/Alert"
import Home from "./components/Home"
import Partita from './components/Partita';
import CronologiaPartite from './components/CronologiaPartite'
import UtenteModel from './models/Utente.mjs';

function App() {
    const [utente, setUtente] = useState(null);
    const [loggato, setLoggato] = useState(false);
    const [message, setMessage] = useState(""); 

    const accesso = async(credenziali) => {
        try {
            const res = await API.logIn(credenziali);
            const utente = new UtenteModel(res.utenteID, res.username);
            setLoggato(true);
            setMessage({msg: "Benvenuto, @"+utente.username+"!", type: "success"});
            setUtente(utente);
        }catch(err) {
            setMessage({msg: err, type: "danger"});
        }
    };

    const registrazione = async(credenziali) => {
        try{
            const utente = await API.signIn(credenziali);
            setMessage({msg: "Registrazione dell'utente '@"+utente.username+"' avvenuta correttamente.", type: "success"});
        }
        catch(err){
            setMessage({msg: err, type: "danger"});
        }
    };

    const navigate = useNavigate(); // per tornare alla home se si fa logout durante una partita
    const uscita = async() => {
        await API.logOut();
        setUtente(null);
        setLoggato(false);
        setMessage({msg: "Disconnessione avvenuta correttamente.", type: "primary"});
        navigate("/");
    };

    useEffect( () => {
        const controllaAutenticazione = async() => {
            const utente = await API.getUserInfo();
            setLoggato(true);
            setUtente(utente);
        };
        controllaAutenticazione();
    }, []);

    return(
        <Routes>
            <Route element={
                <>
                <MyHeader loggato={loggato} utente={utente} esci={uscita}></MyHeader> {/* base per tutte le pagine: header ed eventuali messaggi */}
                <Container fluid className="mt-3">
                    {message && <Row>
                        <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                    </Row>}
                    <Outlet></Outlet> {/* contenuto renderizzato in base al path */}
                </Container>
                </>
                }>
                
                {/* path per ogni componente principale */}
                <Route path="/" element={<Home/>}></Route>
                <Route path="/home" element={<Home/>}></Route>
                <Route path="/nuovaPartita" element={<Partita utente={utente}/>}></Route>
                <Route path="/cronologiaPartite" element={ utente? <CronologiaPartite utente={utente}/> : <Navigate to="/"/>}></Route>
                <Route path="/accedi" element ={ !utente? <AccediForm accedi={accesso}/> : <Navigate to="/"/>} ></Route>
                <Route path="/registrati" element ={ !utente? <RegistratiForm registrati={registrazione}/> : <Navigate to="/"/>} ></Route>
                <Route path="*" element={<Errore/>}></Route>
            </Route>
        </Routes>
    );

}

export default App;