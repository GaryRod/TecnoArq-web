import mysql from "mysql2/promise.js"
import config from './config.js';

async function connectToDatabase() {
    try {
        return await mysql.createConnection(config.conecctionString);
    } catch (err) {
        throw new Error('Error al conectar a la base de datos: ' + err);
    }
}

export {mysql, connectToDatabase}
