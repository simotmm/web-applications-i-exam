const SERVER_URL = "http://localhost:3001";

// GET nuovaPartita
const getNuovaPartita = async() => {
    const response = await fetch(SERVER_URL + "/api/nuovaPartita", {
        method: "GET",
        credentials: "include",
    });

    if(!response.ok)
        throw new Error("fetch di GET nuovaPartita fallita");

    return await response.json();
};

//POST nuovaPartita
const postNuovaPartita = async(partita) => {
    const response = await fetch(SERVER_URL + "/api/nuovaPartita", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(partita),
        credentials: "include"
    });
    return response.json();
};

// GET cronologiaPartite
const getCronologiaPartite = async() => {
    const response = await fetch(SERVER_URL + "/api/cronologiaPartite", {
        method: "GET",
        credentials: "include"
    });

    if(!response.ok)
        throw new Error("fetch di GET cronologiaPartite fallita ("+JSON.stringify(response.text(), null, 2)+")");

    return await response.json();
}

// POST sessions
const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + "/api/sessions", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
};

// POST nuovoUtente
const signIn = async(credentials) => {
    const response = await fetch(SERVER_URL + "/api/nuovoUtente", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(credentials),
    });
    if(response.ok){
        const user = await response.json();
        return user;
    }
    else{
        const dettagli = await response.text();
        throw dettagli;
    } 
    
};

// GET sessions/current
const getUserInfo = async () => {    
    const response = await fetch(SERVER_URL + "/api/sessions/current", {
        credentials: "include",
        method: "GET"
    });
    const user = await response.json();
    if(response.ok) return user;
    else throw user;
};

// DELETE sessions/current
const logOut = async() => {
    const response = await fetch(SERVER_URL + "/api/sessions/current", {
        method: "DELETE",
        credentials: "include"
    });
    if(response.ok) 
        return null;
}

const API = {signIn, logIn, logOut, getUserInfo, getNuovaPartita, postNuovaPartita, getCronologiaPartite};
export default API;
  