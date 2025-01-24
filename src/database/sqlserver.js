import sql from 'mssql';
import config from './config.js';

async function connectToDatabase() {
    try {
        return await sql.connect(config.conecctionString);
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
    }
}

export {sql, connectToDatabase}