const sql = require('mssql');
const {conecctionString} = require('./config');


 const config = {
            server: 'localhost', // Nombre del servidor o IP
            database: 'FisionTech', // Nombre de la base de datos
            user: 'sa', // Especifica el driver para autenticación integrada
            password: 'sasa',
            options: {
                encrypt: false,
                trustServerCertification: true // Habilita autenticación de Windows
            }
        };


async function connectToDatabase() {
    try {
        return await sql.connect(conecctionString);
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
    }
}

module.exports = {sql, connectToDatabase}