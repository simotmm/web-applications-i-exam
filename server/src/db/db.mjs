import sqlite3 from "sqlite3";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const databasePath = join(__dirname, 'meme.db');
const db = new sqlite3.Database(databasePath, (err) => {
    if(err) 
        throw err;
});


export default db;